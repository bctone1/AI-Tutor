from crud.user import *
from schema.user import *
from database.session import get_db
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import core.config as config
from fastapi import Request
import smtplib
user_router = APIRouter()

@user_router.post("/Debug")
async def debug_request(request: Request):
    headers = dict(request.headers)

    try:
        body = await request.json()
    except Exception as e:
        print(e)
        body = await request.body()
        try:
            body = body.decode("utf-8")
        except Exception as e:
            print(e)
            pass

    print("==== [DEBUG] Incoming Request ====")
    print("Headers:", headers)
    print("Body:", body)
    print("==================================")

    return JSONResponse(content={
        "headers": headers,
        "body": body
    })


@user_router.post('/register', response_model=StudentRegisterResponse)
async def register_endpoint(request: StudentRegisterRequest, db: Session = Depends(get_db)):
    email = request.email
    password = request.password
    name = request.name
    department = request.major
    grade = request.grade

    try:
        student_register(db = db, email = email, pw = password, name = name, department = department, grade = grade)
        return {"message": "Register Success"}
    except Exception as e:
        return JSONResponse(content={"message": str(e)}, status_code=500)


@user_router.post('/login', response_model=LoginResponse)
async def login_endpoint(request: LoginRequest, db : Session = Depends(get_db)):
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
                "major" : user_data["major"],
                "grade" : user_data["grade"],
                "testscore" : user_data["testscore"],
            },
            status_code=200
        )
    elif user_data["role"] == "professor":
        return JSONResponse(
            content={
                "message": f"{user_data['name']}님 반갑습니다.",
                "id": user_data["id"],
                "role": "professor",
                "email": user_data["email"],
                "name": user_data["name"],
                "major" : user_data["major"],
                "grade" : user_data["grade"],
                "testscore" : user_data["testscore"],
            },
            status_code=200
        )
    else:
        return JSONResponse(content={'message': '정보가 없습니다.'}, status_code=400)

@user_router.post('/googlelogin', response_model=GoogleLoginResponse)
async def login(request: GoogleLoginRequest, db : Session = Depends(get_db)):
    email = request.email
    name = request.name
    image = request.image
    print(f"GOOGLE EMAIL : {email}")
    print(f"GOOGLE NAME : {name}")

    try:
        user = get_user_data(db, email)

        if not user:
            new_user = create_social_user(db, email, name)
            return JSONResponse(
                content={
                    "message": f"{new_user.name}님 반갑습니다!.",
                    "id": new_user.id,
                    "name": new_user.name,
                    "email": new_user.email,
                    "role": new_user.role,
                    "major": new_user.department,
                    "grade": new_user.grade,
                    "testscore": new_user.score,
                    "image": image
                },
                status_code=200
            )
        else:
            message = "관리자님 반갑습니다." if user.role == "admin" else f"{user.name}님 반갑습니다."
            return JSONResponse(
                content={
                    "message": message,
                    "id": user.id,
                    "name": user.name,
                    "email": user.email,
                    "role": user.role,
                    "major": user.department,
                    "grade": user.grade,
                    "testscore": user.score,
                    "image" : image
                },
                status_code=200
            )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"서버 오류: {e}")


@user_router.post("/sendEmail", response_model=SendEmailResponse)
async def send_email(request: SendEmailRequest):
    email = request.email
    secret_code = request.secretCode
    if not secret_code or not email:
        return JSONResponse(content={'message': 'Missing secretCode or email'}, status_code=400)
    subject = "이메일 인증 코드"
    body = f"귀하의 인증 코드는 {secret_code}입니다."
    msg = MIMEMultipart()
    msg['From'] = config.SENDER_EMAIL
    msg['To'] = email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))
    try:
        server = smtplib.SMTP(config.SMTP_SERVER, config.SMTP_PORT)
        server.starttls()
        server.login(config.SENDER_EMAIL, config.SENDER_PASSWORD)
        server.sendmail(config.SENDER_EMAIL, email, msg.as_string())
        server.quit()
        return JSONResponse(content={'message': '요청되었습니다'}, status_code=200)
    except Exception as e:
        return JSONResponse(content={'message': f'이메일 전송 실패 : {str(e)}'}, status_code=500)

@user_router.post("/updateProfile", response_model=UpdateProfileResponse)
async def update_profile_endpoint(request: UpdateProfileRequest, db : Session = Depends(get_db)):
    email = request.email
    major = request.major
    grade = request.grade

    try:
        user = change_user_info(db = db, email = email, major = major, grade = grade)
        return JSONResponse(
            content={
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "major": user.department,
                "grade": user.grade,
                "testscore": user.score
            },
            status_code=200
        )
    except Exception as e:
        return JSONResponse(content={'message': f'서버 오류 : {str(e)}'}, status_code=500)


@user_router.post("/updateScore", response_model=UpdateScoreResponse)
async def update_profile_endpoint(request: UpdateScoreRequest, db : Session = Depends(get_db)):
    email = request.email
    score = request.testscore

    try:
        user = update_user_score_mail(db = db, user_email = email, score = score)
        return JSONResponse(
            content={
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "major": user.department,
                "grade": user.grade,
                "testscore": user.score
            },
            status_code=200
        )
    except Exception as e:
        return JSONResponse(content={'message': f'서버 오류 : {str(e)}'}, status_code=500)
