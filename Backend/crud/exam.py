from model.exam import *
from langchain_service.document_loader.extract_question import parse_question_block
from langchain_openai import OpenAIEmbeddings
from core.config import CHATGPT_API_KEY
from sqlalchemy.orm import Session
from typing import Dict, Tuple
from collections import defaultdict
from langchain_service.chain.get_explantation import generate_explantation
import random

embedding_model = OpenAIEmbeddings(
    model="text-embedding-3-small",
    openai_api_key=CHATGPT_API_KEY
)

def add_exam_data(db : Session, department : str, file_name, subject):
    new_exam = Exam(
        department = department,
        file_name = file_name,
        subject = subject,
        status = False
    )
    db.add(new_exam)
    db.commit()
    db.refresh(new_exam)
    return new_exam

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
    exam = db.query(Exam).filter(Exam.id == new_question.exam_id).first()
    db.commit()
    db.refresh(exam)
    return new_question.id

def pick_question_ids(db: Session, exam_id : int):
    questions = db.query(KnowledgeBase).filter(KnowledgeBase.exam_id == exam_id).all()
    question_ids = [q.id for q in questions]
    return question_ids


def update_labelingdata(db : Session, subject : str, question_id : int, correct_answer : int, level : str, case : str):
    new_label = LabelingData(
        subject = subject,
        question_id = question_id,
        correct_answer = correct_answer,
        level = level,
        case = case
    )
    db.add(new_label)
    db.commit()
    db.refresh(new_label)
    return new_label.id

def generate_level_test(db: Session, subject: str):
    # 1. 해당 과목의 라벨링 데이터 모두 조회
    labels = db.query(LabelingData).filter(LabelingData.subject == subject).all()

    # 2. case별로 level 분류
    case_level_map = defaultdict(lambda: defaultdict(list))
    for label in labels:
        case_level_map[label.case][label.level].append(label.question_id)

    selected_question_ids = []

    for case, level_dict in case_level_map.items():
        for level in ['상', '중', '하']:
            question_ids = level_dict.get(level, [])
            if question_ids:
                selected_question_ids.append(random.choice(question_ids))

    questions = db.query(KnowledgeBase).filter(KnowledgeBase.id.in_(selected_question_ids)).all()
    question_texts = [parse_question_block(q.question) for q in questions]

    id_to_level = {label.question_id: label.level for label in labels}
    levels = [id_to_level[q.id] for q in questions]

    return selected_question_ids, question_texts, levels



def grading_test(db: Session, answers: Dict[str, int]):
    score = 0
    case_set = set()
    for key, value in answers.items():
        label = db.query(LabelingData).filter(LabelingData.question_id == key).first()
        print(f"라벨링 응답 : {label.correct_answer}")
        print(f"사용자 응답 : {value}")
        case_set.add(label.case)

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
    num_cases = len(case_set)
    return score, num_cases

def classify_level(score: int, num_cases: int) -> Tuple[str, int]:
    print(f"NUM_CASES = {num_cases}")
    max_score = num_cases * 10
    ratio = score / max_score
    normalized_score = int(ratio * 100)

    if ratio >= 80:
        level = "상"
    elif ratio >= 50:
        level = "중"
    else:
        level = "하"

    return level, normalized_score

def get_correct_answer(db: Session, question_id : int):
    label = db.query(LabelingData).filter(LabelingData.question_id == question_id).first()
    return label.correct_answer

def get_explantation(db : Session, question_id : int, correct_answer : int):
    question = db.query(KnowledgeBase).filter(KnowledgeBase.id == question_id).first()
    explantation = generate_explantation(question.question, correct_answer)
    return explantation

def get_all_exam(db : Session):
    exam_entries = db.query(Exam).all()
    return exam_entries

def change_status(db : Session, exam_id = int):
    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    exam.status = True
    db.add(exam)
    db.commit()
    db.refresh(exam)
    return exam.id