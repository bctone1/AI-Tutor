import bcrypt
from sqlalchemy.orm import Session
from model.user import User

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
                "email": user.email,
                "name": user.name,
                "role": user.role,
                "department" : user.department,
                "grade" : user.grade
            }
    return None