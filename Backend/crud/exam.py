from model.exam import *
from model.user import UserCaseScore, UserCurrentScore, UserTotalRecord
from langchain_service.document_loader.extract_question import parse_question_block
from langchain_openai import OpenAIEmbeddings
from core.config import CHATGPT_API_KEY
from sqlalchemy.orm import Session
from typing import Dict, Tuple
from collections import defaultdict
from model.user import User
from langchain_service.chain.get_explantation import generate_explantation, generate_hint
import random
from datetime import datetime
from core.util import *


embedding_model = OpenAIEmbeddings(
    model="text-embedding-3-small",
    openai_api_key=CHATGPT_API_KEY
)

def add_exam_data(db : Session, department : str, file_name : str, subject : str, email : str):
    new_exam = Exam(
        department = department,
        file_name = file_name,
        subject = subject,
        uploader = email,
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
    labels = db.query(LabelingData).filter(LabelingData.subject == subject).all()

    case_level_map = defaultdict(lambda: defaultdict(list))
    for label in labels:
        case_level_map[label.case][label.level].append(label.question_id)

    selected_question_ids = []

    for case, level_dict in case_level_map.items():
        selected_ids_for_case = []

        for level in ['상', '중', '하']:
            question_ids = level_dict.get(level, [])
            if question_ids:
                selected_ids_for_case.append(random.choice(question_ids))

        remaining = 3 - len(selected_ids_for_case)
        if remaining > 0:
            all_question_ids = sum(level_dict.values(), [])
            remaining_ids = list(set(all_question_ids) - set(selected_ids_for_case))
            if remaining_ids:
                additional_ids = random.sample(remaining_ids, min(remaining, len(remaining_ids)))
                selected_ids_for_case.extend(additional_ids)

        selected_question_ids.extend(selected_ids_for_case)

    questions = db.query(KnowledgeBase).filter(KnowledgeBase.id.in_(selected_question_ids)).all()

    questions_dict = {q.id: q for q in questions}
    questions_sorted = [questions_dict[qid] for qid in selected_question_ids if qid in questions_dict]

    question_texts = [parse_question_block(q.question) for q in questions_sorted]

    id_to_label = {label.question_id: label for label in labels}
    levels = [id_to_label[q.id].level if q.id in id_to_label else "미정" for q in questions_sorted]
    subjects = [id_to_label[q.id].subject if q.id in id_to_label else "미정" for q in questions_sorted]
    cases = [id_to_label[q.id].case if q.id in id_to_label else "미정" for q in questions_sorted]

    ordered_question_ids = [q.id for q in questions_sorted]

    return ordered_question_ids, question_texts, levels, subjects, cases

def grading_test(db: Session, answers: Dict[str, int]):
    score = 0
    max_score = 0  # 최대 점수용 변수 추가
    case_set = set()

    for key, value in answers.items():
        label = db.query(LabelingData).filter(LabelingData.question_id == key).first()
        print(f"라벨링 응답 : {label.correct_answer}")
        print(f"사용자 응답 : {value}")
        case_set.add(label.case)

        # 문제 난이도에 따른 해당 문제의 점수
        if label.level == "상":
            problem_score = 5
        elif label.level == "중":
            problem_score = 3
        elif label.level == "하":
            problem_score = 2
        else:
            problem_score = 0  # 혹시 모를 예외 처리

        max_score += problem_score  # 최대 점수 누적

        if label.correct_answer == value:
            print("정답")
            score += problem_score
        else:
            print("오답")

    num_cases = len(case_set)
    return score, num_cases, max_score  # 최대 점수 함께 반환



def grading_test_by_case(db: Session, answers: Dict[str, int]) -> Tuple[int, int, Dict[str, Dict]]:
    total_score = 0
    case_results = defaultdict(lambda: {
        'total_questions': 0,
        'correct_answers': 0,
        'total_score': 0,
        'questions': []
    })
    
    for question_id, user_answer in answers.items():
        label = db.query(LabelingData).filter(LabelingData.question_id == question_id).first()
        if not label:
            continue
            
        case = label.case
        is_correct = (label.correct_answer == user_answer)
        
        # 문제별 점수 계산
        question_score = 0
        if is_correct:
            if label.level == "상":
                question_score = 5
            elif label.level == "중":
                question_score = 3
            elif label.level == "하":
                question_score = 2
        
        # 유형별 결과 누적
        case_results[case]['total_questions'] += 1
        case_results[case]['total_score'] += question_score
        if is_correct:
            case_results[case]['correct_answers'] += 1
            
        case_results[case]['questions'].append({
            'question_id': question_id,
            'level': label.level,
            'is_correct': is_correct,
            'score': question_score
        })
        
        total_score += question_score
        
        print(f"문제 {question_id} ({case}, {label.level}): {'정답' if is_correct else '오답'} - {question_score}점")
    
    # 유형별 정확도 계산
    for case, result in case_results.items():
        if result['total_questions'] > 0:
            result['accuracy'] = result['correct_answers'] / result['total_questions']
        else:
            result['accuracy'] = 0.0
    
    num_cases = len(case_results)
    return total_score, num_cases, dict(case_results)

def classify_level_by_case(case_result: Dict) -> str:
    accuracy = case_result['accuracy']
    
    if accuracy >= 0.7:  # 80% 이상
        return "상"
    elif accuracy >= 0.4:  # 50% 이상
        return "중"
    else:  # 50% 미만
        return "하"

def save_user_case_scores(db: Session, user_id: int, case_results: Dict[str, Dict]):
    for case, result in case_results.items():
        level = classify_level_by_case(result)
        new_case_score = UserCaseScore(
            user_id=user_id,
            case=case,
            total_questions=result['total_questions'],
            correct_answers=result['correct_answers'],
            total_score=result['total_score'],
            accuracy=result['accuracy'],
            level=level,
            last_updated=datetime.utcnow()
        )
        db.add(new_case_score)
    
    db.commit()
    print(f"사용자 {user_id}의 유형별 점수가 저장되었습니다.")

def get_user_case_progress(db: Session, user_id: int) -> Dict[str, Dict]:
    case_scores = db.query(UserCaseScore).filter(UserCaseScore.user_id == user_id).all()
    user_data = db.query(User).filter(User.id == user_id).first()
    department = user_data.department
    progress = {}
    for score in case_scores:
        progress[score.case] = {
            'total_questions': score.total_questions,
            'correct_answers': score.correct_answers,
            'total_score': score.total_score,
            'accuracy': score.accuracy,
            'level': score.level,
            'last_updated': score.last_updated.isoformat() if score.last_updated else None
        }

    if department == "물리치료학과":
        for case in PHYSICAL_THERAPY_CASES:
            if case not in progress:
                progress[case] = {
                    'total_questions': 0,
                    'correct_answers': 0,
                    'total_score': 0,
                    'accuracy': 0.0,
                    'level': '미시도',
                    'last_updated': None
                }
    elif department == "작업치료학과":
        for case in Occupational_Therapy:
            if case not in progress:
                progress[case] = {
                    'total_questions': 0,
                    'correct_answers': 0,
                    'total_score': 0,
                    'accuracy': 0.0,
                    'level': '미시도',
                    'last_updated': None
                }
    return progress

def classify_level(score: int, num_cases: int, max_score : int) -> Tuple[str, int]:
    print(f"NUM_CASES = {num_cases}")
    ratio = score / max_score
    normalized_score = int(ratio * 100)

    if ratio >= 70:
        level = "상"
    elif ratio >= 40:
        level = "중"
    else:
        level = "하"

    return level, normalized_score

def get_correct_answer(db: Session, question_id : int):
    label = db.query(LabelingData).filter(LabelingData.question_id == question_id).first()
    if label:
        return label.correct_answer
    else:
        return 0

def get_explantation(db : Session, question_id : int, correct_answer : int, reference : str):
    question = db.query(KnowledgeBase).filter(KnowledgeBase.id == question_id).first()
    explantation = generate_explantation(question.question, correct_answer, reference)
    return explantation

def get_hint(db: Session, question_id: int):
    question = db.query(KnowledgeBase).filter(KnowledgeBase.id == question_id).first()
    if not question:
        raise ValueError(f"Question with ID {question_id} not found")
    
    hint = generate_hint(question.question)
    return hint

def get_all_exam(db : Session):
    exam_entries = db.query(Exam).all()
    return exam_entries

def change_status(db : Session, exam_id = int, file_name = str):
    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    exam.status = True
    exam.file_location = file_name
    db.add(exam)
    db.commit()
    db.refresh(exam)
    return exam.id

def get_unique_filename(path: Path) -> tuple[Path, str]:
    path = Path(path)
    if not path.exists():
        return path, path.name  # path.name만 리턴해도 됨

    stem = path.stem
    suffix = path.suffix
    parent = path.parent

    counter = 1
    while True:
        new_name = f"{stem}_{counter}{suffix}"
        new_path = parent / new_name
        if not new_path.exists():
            return new_path, new_name  # 경로 전체 + 파일명만 분리해서 리턴
        counter += 1

def update_current_score(db : Session, user_id : int, question_id : int, correct_answer : bool):
    question = db.query(LabelingData).filter(LabelingData.question_id == question_id).first()
    user_status = (
        db.query(UserCurrentScore)
        .filter(
            UserCurrentScore.case == question.case,
            UserCurrentScore.user_id == user_id
        )
        .first()
    )
    print(f"과목 : {question.case}")
    print(f"사용자 데이터 : {user_status.id}")
    user_status.total_questions += 1
    if correct_answer is True:
        user_status.correct_answers += 1
        if question.level == "하":
            user_status.total_score += 2
        elif question.level == "중":
            user_status.total_score += 3
        elif question.level == "상":
            user_status.total_score += 5
        db.add(user_status)
        db.commit()
        db.refresh(user_status)
    user_status.accuracy = user_status.correct_answers/user_status.total_questions
    if user_status.accuracy >= 0.8:
        user_status.level = "상"
    elif user_status.accuracy >= 0.5:
        user_status.level = "중"
    else:
        user_status.level = "하"

    db.add(user_status)
    db.commit()
    db.refresh(user_status)
    return user_status

def get_sheet_number(db: Session, exam_id: int):
    result = db.query(Exam.file_name).filter(Exam.id == exam_id).first()
    if not result:
        return 0

    exam_name = result[0]

    if "2024" in exam_name:
        return 0
    elif "2023" in exam_name:
        return 1
    elif "2022" in exam_name:
        return 2
    elif "2021" in exam_name:
        return 3
    elif "2020" in exam_name:
        return 4
    else:
        return 0

def get_commentary(db: Session):
    results = (
        db.query(LabelingData, KnowledgeBase.question)
        .join(KnowledgeBase, LabelingData.question_id == KnowledgeBase.id)
        .all()
    )

    output = []
    for label, question_text in results:
        item = {
            "id": label.id,
            "subject": label.subject,
            "problemId": label.question_id,
            "problem": question_text,
            "answer": label.correct_answer,
            "difficulty": label.level,
            "topic": label.case,
            "explanation": label.commentary
        }
        output.append(item)

    return output

def get_exist_commentary(db : Session, question_id):
    result = (db.query(LabelingData).
              filter(LabelingData.question_id == question_id and LabelingData.commentary.isnot(None))
              .first())
    return result.commentary

def save_new_commentary(db : Session, question_id, commentary):
    label = db.query(LabelingData).filter(LabelingData.question_id==question_id).first()
    label.commentary = commentary
    db.add(label)
    db.commit()
    db.refresh(label)

def save_comment(db : Session, label_id, commentary, answer):
    label = db.query(LabelingData).filter(LabelingData.id==label_id).first()
    label.commentary = commentary
    label.answer = answer
    db.add(label)
    db.commit()
    db.refresh(label)

def get_question_by_id(db : Session, question_id):
    question = db.query(KnowledgeBase).filter(KnowledgeBase.id == question_id).first()
    return question.question

def save_score_record(db : Session, user_id : int, is_correct : bool):
    user_record = db.query(UserTotalRecord).filter(UserTotalRecord.user_id == user_id).first()

    if is_correct:
        user_record.total_score += 3
    else:
        user_record.total_score -= 3
    db.add(user_record)
    db.commit()
    db.refresh(user_record)

def delete_exam(db : Session, exam_id : int):
     exam = db.query(Exam).filter(Exam.id == exam_id).first()
     if exam:
         db.delete(exam)
         db.commit()