import bcrypt
from sqlalchemy.orm import Session
from model.user import User
import random

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
        role = 'SocialLogin',
        group = 'newUser',
        department = "소속 없음",
        grade= 0
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user.id

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