from fastapi import APIRouter, File, UploadFile, HTTPException
from core.config import LABELING_DATA, EXAM_DATA
from crud.exam import *
from crud.user import update_user_score
from langchain_service.document_loader.file_loader import load_document
from langchain_service.document_loader.read_labeling_data import excel_to_list
from langchain_service.document_loader.extract_question import extract_questions_from_pages
from fastapi.responses import JSONResponse
import os
from database.session import get_db
from fastapi import Depends
from schema.exam import *
import json
from fastapi import Form
exam_router = APIRouter()

'''
@exam_router.post("/uploadquestion")
async def upload_question(
        file: UploadFile = File(...),
        userData: str = Form(...),
        ExamID: str = Form(None)  # 선택사항
):
    try:
        print("=== [UPLOAD DEBUG] ===")
        print(f"Filename: {file.filename}")
        print(f"Raw userData: {userData}")

        user_info = json.loads(userData)
        print(f"Parsed userData: {user_info}")

        # ✅ 이메일만 추출
        email = user_info["user"]["email"]
        print(f"✅ Extracted Email: {email}")

    except json.JSONDecodeError as e:
        print(f"❌ JSON Decode Error: {e}")
        raise HTTPException(status_code=400, detail="Invalid userData format")

    print("======================\n")

    return {"message": "DEBUG: received data"}
'''

@exam_router.post("/uploadquestion")
async def upload_file(file: UploadFile = File(...), userData: str = Form(...), db: Session = Depends(get_db)):
    file_location = os.path.join(EXAM_DATA, file.filename)
    unique_file_location, unique_name = get_unique_filename(file_location)

    try:
        user_info = json.loads(userData)
        email = user_info["user"]["email"]
        if not email:
            raise ValueError("email missing")
    except Exception as e:
        print(f"userData JSON decode error: {str(e)}")
        raise HTTPException(status_code=400, detail=f"userData JSON decode error: {str(e)}")

    with open(unique_file_location, "wb") as f:
        contents = await file.read()
        f.write(contents)


    try:
        documents = load_document(unique_file_location)
        print(f"PAGE TEXT : {documents}")
    except ValueError as e:
        return {"error": str(e)}

    page_texts = [doc.page_content for doc in documents]
    print(f"PAGE TEXT : {page_texts}")
    questions = extract_questions_from_pages(page_texts)
    exam_data = add_exam_data(db = db, department="물리치료학과", file_name = file.filename, subject="물리치료 기초", email = email)
    for i, q in enumerate(questions, start=1):
        print(f"[문항 {i}]\n{q}\n{'-' * 40}")
        update_knowledgebase(db = db, exam_id = exam_data.id, question_number=i, question = q)

    return exam_data



@exam_router.post("/uploadAnswer")
async def upload_two_files(
    ExamID: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    LABELING_DATA.mkdir(parents=True, exist_ok=True)
    label_location = LABELING_DATA / file.filename

    # 중복 방지된 파일명으로 경로 변경
    unique_label_location, unique_name = get_unique_filename(label_location)

    with open(unique_label_location, "wb") as f:
        contents = await file.read()
        f.write(contents)


    label = excel_to_list(label_location)

    question_ids = sorted(pick_question_ids(db, ExamID))

    print(label)
    print(question_ids)

    for subject, rows in label.items():
        for i, row in enumerate(rows):
            if i >= len(question_ids):
                break  # question_id가 부족할 경우 방지

            question_id = question_ids[i]
            _, subject_name, _, correct_answer, level, case = row

            # DB 저장 함수 호출
            update_labelingdata(
                db=db,
                subject=subject_name,
                question_id=question_id,
                correct_answer=correct_answer,
                level=level,
                case=case
            )

    change_status(db = db, exam_id = ExamID, file_name=str(unique_name))
    exam_data = get_all_exam(db = db)


    return exam_data



'''
@exam_router.post("/upload/")
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    file_location = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_location, "wb") as f:
        contents = await file.read()
        f.write(contents)

    try:
        documents = load_document(file_location)
        print(f"PAGE TEXT : {documents}")
    except ValueError as e:
        return {"error": str(e)}

    page_texts = [doc.page_content for doc in documents]
    print(f"PAGE TEXT : {page_texts}")
    questions = extract_questions_from_pages(page_texts)
    exam_data = add_exam_data(db = db, department="물리치료학과", file_name = file.filename, subject="물리치료사 국가시험")
    for i, q in enumerate(questions, start=1):
        print(f"[문항 {i}]\n{q}\n{'-' * 40}")
        update_knowledgebase(db = db, exam_id = exam_data, question_number=i, question = q)

    return {
        "filename": file.filename,
        "question_count": len(questions),
        "questions_preview": questions[:]
    }
'''

@exam_router.post('/getTestQuestion')
async def get_test_endpoint(db: Session = Depends(get_db)):
    subject = "물리치료 기초"
    question_ids, question_texts, levels = generate_level_test(db, subject)

    if not question_ids:
        return JSONResponse(content={"error": "No questions found."}, status_code=404)

    formatted_questions = [
        {
            "id": qid,
            "level" : level,
            "question": json.dumps(qtext, ensure_ascii=False)
        }
        for qid, level, qtext in zip(question_ids, levels, question_texts)
    ]

    return formatted_questions

@exam_router.post('/submitTest')
async def submit_test_endpoint(request: SubmitTestRequest, db: Session = Depends(get_db)):
    answers = request.answers
    user_id = request.userdata.user.id

    print(f"ANSWER : {answers}")

    score, num_cases = grading_test(db, answers)
    level, normalized_score = classify_level(score, num_cases)

    print(f"LEVEL : {level} | SCORE : {score} | NORMALIZED_SCORE : {normalized_score}")
    update_user_score(db = db, user_id = user_id, score = score)

    return {
        "score": score,
        "grade": level,
        "norm_score" : normalized_score
    }


@exam_router.post("/getExplanation")
async def get_explantation_endpoint(request: GetExplantationRequest, db: Session = Depends(get_db)):
    answer = request.answer
    question_id = request.question_id

    correct_answer = get_correct_answer(db = db, question_id = question_id)
    print(f"CORRECT ANSWER  {correct_answer}")
    if correct_answer == answer:
        is_correct = True
    else:
        is_correct = False

    explanation = get_explantation(db = db, question_id = question_id, correct_answer = correct_answer)

    return JSONResponse(content={
        "isCorrect": is_correct,
        "explanation": explanation,
    })


@exam_router.post("/getQuestionData")
async def get_qeuestion_data_endpoint(db: Session = Depends(get_db)):
    exams = get_all_exam(db)
    return exams
