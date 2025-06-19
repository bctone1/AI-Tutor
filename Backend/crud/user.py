import bcrypt
from sqlalchemy.orm import Session
from model.user import *
from model.exam import LabelingData
import random
from datetime import datetime
from core.util import *
from typing import Dict, Tuple
from sqlalchemy import not_, or_

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def student_register(db : Session, email : str, pw : str, name : str, department : str, grade : int):
    hashed_pw = hash_password(pw)
    new_user = User(
        email = email,
        password = hashed_pw,
        name = name,
        role = 'student',
        department = department,
        grade = grade
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def user_login(db: Session, email: str, pw: str):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None

    if user.password.startswith("$2b$"):
        if verify_password(pw, user.password):
            return {
                "id": user.id,
                "name" : user.name,
                "email": user.email,
                "major": user.department,
                "role": user.role,
                "grade" : user.grade,
                "testscore" : user.score
            }
    else:
        if user.password == pw:
            user.password = hash_password(pw)
            db.commit()
            return {
                "id": user.id,
                "name" : user.name,
                "email": user.email,
                "major": user.department,
                "role": user.role,
                "grade" : user.grade,
                "testscore" : user.score
            }

    return None

def generate_random_password():
    random_number = ''.join([str(random.randint(0, 9)) for _ in range(8)])
    return f'default_password{random_number}'

def get_user_data(db : Session, email : str):
    return db.query(User).filter(User.email.ilike(email)).first()

def create_social_user(db : Session, email : str, name : str):
    password = generate_random_password()
    hashed_pw = hash_password(password)
    new_user = User(
        email = email,
        password = hashed_pw,
        name = name,
        role = 'googleUser',
        department = "소속 없음",
        grade= 0
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def change_user_info(db: Session, email : str, major : str, grade : int):
    user = db.query(User).filter(User.email == email).first()
    if user:
        user.department = major
        user.grade = grade

        db.commit()
        db.refresh(user)
        return user
    else:
        return None

def generate_user_current_score(db: Session, email : str, major : str):
    user = db.query(User).filter(User.email == email).first()
    if user:
        if major == "물리치료학과":
            for case in PHYSICAL_THERAPY_CASES:
                new_current_score = UserCurrentScore(
                    user_id = user.id,
                    case = case,
                )
                db.add(new_current_score)
                db.commit()
                db.refresh(new_current_score)

            return user
        elif major == "작업치료학과":
            for case in Occupational_Therapy:
                new_current_score = UserCurrentScore(
                    user_id = user.id,
                    case = case,
                )
                db.add(new_current_score)
                db.commit()
                db.refresh(new_current_score)
            return user
    else:
        return None

def generate_user_score(db: Session, email : str, major : str):
    user = db.query(User).filter(User.email == email).first()
    if user:
        if major == "물리치료학과":
            for case in PHYSICAL_THERAPY_CASES:
                new_score = UserCaseScore(
                    user_id = user.id,
                    case = case,
                )
                db.add(new_score)
                db.commit()
                db.refresh(new_score)

            return user
        elif major == "작업치료학과":
            for case in Occupational_Therapy:
                new_score = UserCaseScore(
                    user_id = user.id,
                    case = case,
                )
                db.add(new_score)
                db.commit()
                db.refresh(new_score)
            return user
    else:
        return None

def update_user_score(db: Session, user_id : int, score : int):
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        user.score = score
        db.commit()
        db.refresh(user)
        return user
    else:
        return None



def update_user_score_mail(db: Session, user_email : str, score : int):
    user = db.query(User).filter(User.email == user_email).first()
    if user:
        user.score = score
        db.commit()
        db.refresh(user)
        return user
    else:
        return None

def add_new_record(db : Session, user_id : int):
    new_record = UserTotalRecord(
        user_id=user_id
    )
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record

def save_total_correct(db : Session, user_id : int, is_correct : bool):
    record = db.query(UserTotalRecord).filter(UserTotalRecord.user_id == user_id).first()
    if not record:
        new_record = UserTotalRecord(
            user_id = user_id
        )
        db.add(new_record)
        db.commit()
        db.refresh(new_record)
    if record:
        if is_correct:
            print(is_correct)
            record.total_question += 1
            record.total_correct += 1
            record.correct_rate = record.total_correct/record.total_question
            db.commit()
            db.refresh(record)
        if not is_correct:
            print(is_correct)
            record.total_question += 1
            record.total_correct = record.total_correct / record.total_question
            db.commit()
            db.refresh(record)
        return record

def get_total_record(db : Session, user_id : int):
    record = db.query(UserTotalRecord).filter(UserTotalRecord.user_id == user_id).first()
    return record


def add_daily_record(db : Session, user_id : int, question_id : int):
    today_date = datetime.utcnow().date()
    new_daily = UserDaily(
        user_id=user_id,
        question_id = question_id,
        date=today_date
    )
    db.add(new_daily)
    db.commit()
    db.refresh(new_daily)
    return new_daily


def get_daily_record(db : Session, user_id : int):
    record = db.query(UserDaily).filter(UserDaily.user_id == user_id).all()
    result = [
        {
            "id": r.id,
            "user_id": r.user_id,
            "question_id": r.question_id,
            "date": r.date.isoformat()  # datetime은 문자열로 바꿔줘야 함
        }
        for r in record
    ]
    return result


def generate_current_score_status(db: Session, user_email: str, major: str):
    user = db.query(User).filter(User.email == user_email).first()
    if major == "물리치료학과":
        for case in PHYSICAL_THERAPY_CASES:
            new_status = UserCurrentScore(
                user_id=user.id,
                case=case
            )
            db.add(new_status)
    elif major == "작업치료학과":
        for case in Occupational_Therapy:
            new_status = UserCurrentScore(
                user_id=user.id,
                case=case
            )
            db.add(new_status)

    db.commit()




def get_user_case_current(db: Session, user_id: int) -> Dict[str, Dict]:
    case_scores = db.query(UserCurrentScore).filter(UserCurrentScore.user_id == user_id).all()
    department = db.query(User.department).filter(User.id == user_id).first()[0]
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
        print(f"PROGRESS : {score.case}")
    cases_list = Occupational_Therapy
    print(f"DEPARTMENT : {department}")
    if department == "물리치료학과":
        cases_list = PHYSICAL_THERAPY_CASES
    elif department == "작업치료학과":
        cases_list = Occupational_Therapy

    for case in cases_list:
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


def get_student_data(db: Session):
    exclude_roles: list[str] = ['professor', 'admin']
    return db.query(User).filter(not_(User.role.in_(exclude_roles))).all()

def get_user_lag_case(db: Session, user_id: int):
    # accuracy 기준으로 낮은 순 3개
    lag_accuracy = (
        db.query(UserCurrentScore)
        .filter(UserCurrentScore.user_id == user_id)
        .order_by(UserCurrentScore.accuracy.asc())
        .limit(3)
        .all()
    )
    accuracy_cases = [score.case for score in lag_accuracy]

    # total_questions 기준으로 낮은 순 3개
    lag_total_questions = (
        db.query(UserCurrentScore)
        .filter(UserCurrentScore.user_id == user_id)
        .order_by(UserCurrentScore.total_questions.asc())
        .limit(3)
        .all()
    )
    question_cases = [score.case for score in lag_total_questions]

    # 두 목록을 합치고 중복 제거 (유지 순서: accuracy → total_questions)
    combined_cases = []
    seen = set()
    for case in accuracy_cases + question_cases:
        if case not in seen:
            combined_cases.append(case)
            seen.add(case)

    return combined_cases