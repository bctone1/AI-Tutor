from fastapi import APIRouter, File, UploadFile
from core.config import UPLOAD_DIR
from crud.exam import *
from crud.user import update_user_score
from langchain_service.document_loader.file_loader import load_document
from langchain_service.document_loader.extract_question import extract_questions_from_pages
from fastapi.responses import JSONResponse
import os
from database.session import get_db
from fastapi import Depends
from schema.exam import *
import json
exam_router = APIRouter()

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

@exam_router.post('/getTestQuestion')
async def get_test_endpoint(db: Session = Depends(get_db)):
    subject = "물리치료"
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

