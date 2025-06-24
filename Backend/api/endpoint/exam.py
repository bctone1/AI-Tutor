from fastapi import APIRouter, File, UploadFile, HTTPException
from core.config import LABELING_DATA, EXAM_DATA
from crud.exam import *
from crud.user import update_user_score, save_total_correct, get_total_record, add_daily_record
from langchain_service.document_loader.file_loader import load_document
from langchain_service.document_loader.read_labeling_data import excel_to_list
from langchain_service.document_loader.extract_question import extract_questions_from_pages
from langchain_service.document_loader.read_excel import extract_questions_from_excel
from fastapi.responses import JSONResponse
from crud.llm import convert_to_vector, get_most_similar_question, get_id_by_subject
import os
from database.session import get_db
from fastapi import Depends
from schema.exam import *
import json
from fastapi import Form
exam_router = APIRouter()


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

    ext = os.path.splitext(file.filename)[1].lower()

    file_lower = file.filename.lower()
    if "작업치료" in file_lower:
        department = "작업치료학과"
        subject = "작업치료기초"
    elif "물리치료" in file_lower:
        department = "물리치료학과"
        subject = "물리치료기초"
    else:
        department = "학과 미지정"
        subject = "과목 미지정"

    exam_data = add_exam_data(
        db=db,
        department=department,
        file_name=file.filename,
        subject=subject,
        email=email
    )

    if ext == ".pdf":
        try:
            documents = load_document(unique_file_location)
            print(f"PAGE TEXT : {documents}")
        except ValueError as e:
            return {"error": str(e)}

        page_texts = [doc.page_content for doc in documents]
        print(f"PAGE TEXT : {page_texts}")
        questions = extract_questions_from_pages(page_texts)


        for i, q in enumerate(questions, start=1):
            print(f"[문항 {i}]\n{q}\n{'-' * 40}")
            update_knowledgebase(db=db, exam_id=exam_data.id, question_number=i, question=q)

        return exam_data

    elif ext == ".xlsx":
        excel_dictionary = extract_questions_from_excel(unique_file_location)
        for number, content in excel_dictionary.items():
            try:
                qnum = int(number)
            except ValueError:
                qnum = number  # 'A1', '1-a' 같은 경우
            update_knowledgebase(db=db, exam_id=exam_data.id, question_number=qnum, question=content)

        return exam_data

    elif ext == ".txt":
        return {"message": "TXT 파일 업로드는 준비 중입니다."}

    else:
        raise HTTPException(status_code=400, detail="지원하지 않는 파일 형식입니다.")



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

    sheet_number = get_sheet_number(db = db, exam_id = ExamID)
    print(f"SHEET NUMBER : {sheet_number}")
    label = excel_to_list(file_path = label_location, sheet_number=sheet_number)

    question_ids = sorted(pick_question_ids(db, ExamID))

    print(label)
    print(question_ids)

    for subject, rows in label.items():
        for i, row in enumerate(rows):
            if i >= len(question_ids):
                break  # question_id가 부족할 경우 방지

            question_id = question_ids[i]
            _, subject_name, _, correct_answer, _, _, _, case, level= row

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




@exam_router.post('/getTestQuestion')
async def get_test_endpoint(request : GetTestQuestionRequest, db: Session = Depends(get_db)):
    major = request.major
    print(f"MAJOR : {major}")
    subject = ""
    if major == "물리치료학과":
        subject = "물리치료학기초_해부생리학"
    elif major == "작업치료학과":
        subject = "작업치료학기초_해부생리학"
    question_ids, question_texts, levels, subjects, cases = generate_level_test(db = db, subject=subject)

    if not question_ids:
        return JSONResponse(content={"error": "No questions found."}, status_code=404)

    formatted_questions = [
        {
            "id": qid,
            "level" : level,
            "question": json.dumps(qtext, ensure_ascii=False),
            "subject" : subjects,
            "cases" : cases
        }
        for qid, level, qtext, subjects, cases in zip(question_ids, levels, question_texts, subjects, cases)
    ]
    print("================= 생성된 시험 문제 ======================")

    for idx, q in enumerate(formatted_questions, 1):
        print(f"\n문제 {idx} (ID: {q['id']}, 난이도: {q['level']}, 과목: {q['subject']}, 주제: {q['cases']})")

        # JSON 문자열로 되어 있는 'question' 필드를 파싱
        question_data = json.loads(q['question'])
        question_text = question_data['question']
        choices = question_data['choices']

        print(f"Q. {question_text}")
        for i, choice in enumerate(choices, start=1):
            print(f"   {i}) {choice}")
    return formatted_questions

@exam_router.post('/submitTest')
async def submit_test_endpoint(request: SubmitTestRequest, db: Session = Depends(get_db)):
    answers = request.answers
    user_id = request.userdata.user.id

    print("\n===== 사용자가 제출한 답안 =====")
    for qid, ans in answers.items():
        print(f"문제 ID: {qid}, 사용자 답안: {ans}")
    print("================================\n")

    # 기존 전체 채점
    score, num_cases, max_score = grading_test(db, answers)
    level, normalized_score = classify_level(score, num_cases, max_score)

    # 유형별 채점 추가
    total_score_by_case, num_cases_by_case, case_results = grading_test_by_case(db, answers)
    
    # 유형별 점수 저장
    save_user_case_scores(db, user_id, case_results)

    print(f"LEVEL : {level} | SCORE : {score} | NORMALIZED_SCORE : {normalized_score}")
    print(f"유형별 결과: {case_results}")
    
    update_user_score(db = db, user_id = user_id, score = normalized_score, level = level)

    return {
        "score": score,
        "grade": level,
        "norm_score" : normalized_score,
        "case_results": case_results
    }

@exam_router.post('/getUserCaseProgress')
async def get_user_case_progress_endpoint(request: dict, db: Session = Depends(get_db)):
    try:
        user_id = request.get("user_id")
        if not user_id:
            raise HTTPException(status_code=400, detail="user_id가 필요합니다.")
        
        progress = get_user_case_progress(db, user_id)
        record = get_total_record(db=db, user_id=user_id)
        return {
            "success": True,
            "progress": progress,
            "total_question": record.total_question,
            "correct_rate" : record.correct_rate * 100,
            "attendance": record.attendance,
            "total_score": record.total_score
        }
        
    except Exception as e:
        print(f"유형별 학습 현황 조회 오류: {str(e)}")
        raise HTTPException(status_code=500, detail="학습 현황 조회 중 오류가 발생했습니다.")

@exam_router.post("/getExplanation")
async def get_explantation_endpoint(request: GetExplantationRequest, db: Session = Depends(get_db)):
    answer = request.answer
    question_id = request.question_id
    user_id = request.userdata.user.id
    exist = get_exist_commentary(db = db, question_id = question_id)
    question = get_question_by_id(db = db, question_id = question_id)
    embedding_vector = convert_to_vector(question)
    ids = get_id_by_subject(db = db, question_id = question_id)

    reference = get_most_similar_question(db = db, embedding = embedding_vector, id_list = ids)
    print(f"REFERENCE : {reference}")
    print(f"사용자 ID : {user_id}")


    correct_answer = get_correct_answer(db = db, question_id = question_id)
    print(f"CORRECT ANSWER  {correct_answer}")
    if correct_answer == answer:
        is_correct = True
    else:
        is_correct = False
    save_score_record(db = db, user_id = user_id, is_correct = is_correct)

    if exist:
        save_total_correct(db=db, user_id=user_id, is_correct=is_correct)
        update_current_score(db=db, user_id = user_id, question_id=question_id, correct_answer=is_correct)
        add_daily_record(db=db, user_id=user_id, question_id=question_id)
        return JSONResponse(content={
            "isCorrect" : is_correct,
            "explanation" : exist
        })
    else:
        explanation = get_explantation(db=db, question_id=question_id, correct_answer=correct_answer, reference=reference)
        save_new_commentary(db = db, question_id = question_id, commentary = explanation)
        save_total_correct(db=db, user_id=user_id, is_correct=is_correct)
        update_current_score(db=db, user_id = user_id, question_id=question_id, correct_answer=is_correct)
        add_daily_record(db=db, user_id=user_id, question_id=question_id)

        return JSONResponse(content={
            "isCorrect": is_correct,
            "explanation": explanation,
        })

@exam_router.get("/getHint/{question_id}")
async def get_hint_endpoint(question_id: int, db: Session = Depends(get_db)):

    try:
        hint = get_hint(db=db, question_id=question_id)
        
        return JSONResponse(content={
            "hint": hint
        })
    
    except ValueError as e:
        print(f"ERROR: {str(e)}")
        raise HTTPException(status_code=404, detail=str(e))
    
    except Exception as e:
        print(f"UNEXPECTED ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail="힌트 생성 중 오류가 발생했습니다.")

@exam_router.post("/getQuestionData")
async def get_qeuestion_data_endpoint(db: Session = Depends(get_db)):
    exams = get_all_exam(db)
    return exams

@exam_router.post("/getCommentary")
async def get_commentary_endpoint(db: Session = Depends(get_db)):
    data = get_commentary(db = db)
    return data

@exam_router.post("/saveCommentary")
async def save_commentary_endpoint(request: SaveCommentRequest, db: Session = Depends(get_db)):
    label_id = request.id
    new_answer = request.answer
    new_explanation = request.explanation
    save_comment(db = db, label_id = label_id, commentary = new_explanation, answer = new_answer)
    return JSONResponse(content={
        "message": "등록이 완료되었습니다."})

@exam_router.post("/DeleteExamData")
async def delete_exam_endpoint(request: DeleteExamData, db: Session = Depends(get_db)):
    exam_id = request.exam_id
    delete_exam(db = db, exam_id = exam_id)
    return JSONResponse(content={
        "message": "시험지가 삭제되었습니다."})

