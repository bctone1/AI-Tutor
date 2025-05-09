from crud.user import *
from schema.user import *
from database.session import get_db
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
user_router = APIRouter()

@user_router.post('/register', response_model=StudentRegisterResponse)
async def register(request: StudentRegisterRequest, db: Session = Depends(get_db)):
    email = request.email
    password = request.password
    name = request.name
    department = request.department
    grade = request.grade

    try:
        student_register(db = db, email = email, pw = password, name = name, department = department, grade = grade)
        return {"message": "Register Success"}
    except Exception as e:
        return JSONResponse(content={"message": str(e)}, status_code=500)

@user_router.post('/login', response_model=LoginResponse)
async def login(request: LoginRequest, db : Session = Depends(get_db)):
    email = request.email
    password = request.password
    user_data = user_login(db, email, password)
    if not user_data:
        return JSONResponse(content={'message': '회원 정보가 없습니다.'}, status_code=404)

    if user_data["role"] == "student":
        return JSONResponse(
            content={
                "message": f"{user_data['name']}님 반갑습니다.",
                "id": user_data["id"],
                "role": "user",
                "email": user_data["email"],
                "name": user_data["name"],
                "department" : user_data["department"],
                "grade" : user_data["grade"]
            },
            status_code=200
        )
    else:
        return JSONResponse(content={'message': '정보가 없습니다.'}, status_code=400)

