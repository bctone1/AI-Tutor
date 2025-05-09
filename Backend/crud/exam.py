from sqlalchemy.orm import Session
from model import *
from langchain_service.document_loader.file_loader import load_document
from langchain_service.document_loader.extract_question import extract_questions_from_pages
from langchain_openai import OpenAIEmbeddings
from core.config import CHATGPT_API_KEY
import os

embedding_model = OpenAIEmbeddings(
    model="text-embedding-3-small",
    openai_api_key=CHATGPT_API_KEY
)

def process_exam_with_langchain_embedding(session: Session, file_path: str, department: str, subject: str):
    # 1. PDF 불러오기
    pages = load_document(file_path)
    page_texts = [doc.page_content for doc in pages]

    # 2. 문항 단위로 분리
    questions = extract_questions_from_pages(page_texts)

    # 3. Exam 레코드 생성
    exams = Exam(
        department=department,
        file_name=os.path.basename(file_path),
        subject=subject
    )
    session.add(exams)
    session.flush()  # exam.id 확보

    # 4. LangChain 임베딩 및 KnowledgeBase에 저장
    for idx, question_text in enumerate(questions, start=1):
        vector = embedding_model.embed_query(question_text)

        kb_entry = KnowledgeBase(
            exam_id=exams.id,
            question_number=idx,
            question=question_text,
            vector_memory=vector
        )
        session.add(kb_entry)

    session.commit()
