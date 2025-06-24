from crud.user import *
from schema.user import *
from crud.exam import get_user_case_progress
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
        student = student_register(db = db, email = email, pw = password, name = name, department = department, grade = grade)
        add_new_record(db = db, user_id = student.id)
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
            add_new_record(db=db, user_id=new_user.id)
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
    generate_user_current_score(db = db, email = email, major = major)
    generate_user_score(db=db, email=email, major=major)
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

@user_router.post("/getDailyRecord")
async def get_daily_endpoint(request: GetDailyRecordRequest, db : Session = Depends(get_db)):
    user_id = request.user_id
    record = get_daily_record(db = db, user_id=user_id)
    print(f"RECORD : {record}")
    return JSONResponse(content=record, status_code=200)


@user_router.post('/getUserCaseScore')
async def get_user_case_progress_endpoint(request: dict, db: Session = Depends(get_db)):
    try:
        user_id = request.get("user_id")
        if not user_id:
            raise HTTPException(status_code=400, detail="user_id가 필요합니다.")

        progress = get_user_case_current(db, user_id)
        return {
            "success": True,
            "progress": progress
        }

    except Exception as e:
        print(f"유형별 학습 현황 조회 오류: {str(e)}")
        raise HTTPException(status_code=500, detail="학습 현황 조회 중 오류가 발생했습니다.")

@user_router.post('/getStudentData')
async def get_student_data_endpoint(db: Session = Depends(get_db)):
    student_data = get_student_data(db = db)
    return student_data

@user_router.post('/GetLagCases')
async def get_student_data_endpoint(request : GetUserLagCase, db: Session = Depends(get_db)):
    user_id = request.user_id
    lag_cases = get_user_lag_case(db = db, user_id = user_id)
    return lag_cases

@user_router.post('/sendFeedback')
async def get_student_data_endpoint(request : SaveFeedbackRequest, db: Session = Depends(get_db)):
    professor = request.professor
    student_id = request.user_id
    feedback = request.feedback
    date_info = request.date
    save_feedback(db = db, professor = professor, student_id = student_id, feedback = feedback, date_info = date_info)

    return JSONResponse(content={'message': '피드백이 저장되었습니다.'}, status_code=200)

@user_router.post('/getFeedbackList')
async def get_feedback_endpoint(request : GetFeedbackRequest, db: Session = Depends(get_db)):
    student_id = request.user_id
    feedback = get_feedback(db = db, student_id = student_id)

    return feedback

@user_router.post('/getMonthTestResult')
async def get_user_case_progress_endpoint(request: dict, db: Session = Depends(get_db)):
    try:
        user_id = request.get("user_id")
        if not user_id:
            raise HTTPException(status_code=400, detail="user_id가 필요합니다.")

        progress = get_user_case_progress(db, user_id)
        return {
            "progress": progress
        }

    except Exception as e:
        print(f"유형별 학습 현황 조회 오류: {str(e)}")
        raise HTTPException(status_code=500, detail="학습 현황 조회 중 오류가 발생했습니다.")