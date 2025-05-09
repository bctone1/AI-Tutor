from fastapi import APIRouter, File, UploadFile
from core.config import UPLOAD_DIR
from crud.exam import *
from langchain_service.document_loader.file_loader import load_document
from langchain_service.document_loader.extract_question import extract_questions_from_pages
import os
from database.session import get_db
from fastapi import Depends

exam_router = APIRouter()

@exam_router.post("/upload/")
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    file_location = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_location, "wb") as f:
        contents = await file.read()
        f.write(contents)

    try:
        documents = load_document(file_location)
    except ValueError as e:
        return {"error": str(e)}

    page_texts = [doc.page_content for doc in documents]
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

