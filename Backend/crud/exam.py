from sqlalchemy.orm import Session
from model.exam import *
from langchain_service.document_loader.file_loader import load_document
from langchain_service.document_loader.extract_question import extract_questions_from_pages, parse_question_block
from langchain_openai import OpenAIEmbeddings
from core.config import CHATGPT_API_KEY
from sqlalchemy.orm import Session
from typing import Dict
from schema.exam import SubmitTestRequest
import os

embedding_model = OpenAIEmbeddings(
    model="text-embedding-3-small",
    openai_api_key=CHATGPT_API_KEY
)

def add_exam_data(db : Session, department : str, file_name, subject):
    new_exam = Exam(
        department = department,
        file_name = file_name,
        subject = subject
    )
    db.add(new_exam)
    db.commit()
    db.refresh(new_exam)
    return new_exam.id

def update_knowledgebase(db : Session, exam_id : int, question_number : int, question : str):
    vector = embedding_model.embed_query(question)
    new_question = KnowledgeBase(
        exam_id = exam_id,
        question_number = question_number,
        question = question,
        vector_memory = vector
    )
    db.add(new_question)
    db.commit()
    db.refresh(new_question)
    return new_question.id

def generate_level_test(db: Session, subject: str):
    labels = db.query(LabelingData).filter(LabelingData.subject == subject).all()
    question_ids = [label.question_id for label in labels]
    questions = db.query(KnowledgeBase).filter(KnowledgeBase.id.in_(question_ids)).all()
    question_texts = [parse_question_block(q.question) for q in questions]
    levels = [label.level for label in labels]
    return question_ids, question_texts, levels


def grading_test(db: Session, answers: Dict[str, int]):
    for key, value in answers.items():
        label = db.query(LabelingData).filter(LabelingData.question_id == key).first()
        score = 0
        print(f"라벨링 응답 : {label.correct_answer}")
        print(f"사용자 응답 : {value}")
        if label.correct_answer == value:
            print("정답")
            if label.level == "상":
                print("상급 문제 맞춤 - 5점 추가")
                score += 5
            elif label.level == "중":
                print("중급 문제 맞춤 - 3점 추가")
                score += 3
            elif label.level == "하":
                print("중급 문제 맞춤 - 2점 추가")
                score += 2
        else:
            print("오답")
        return score

