from starlette.middleware.cors import CORSMiddleware
from api.router import router
from fastapi import FastAPI
import uvicorn
from fastapi.staticfiles import StaticFiles
from apscheduler.schedulers.background import BackgroundScheduler
from database.session import SessionLocal
from crud.user import scheduled_backup
from contextlib import asynccontextmanager

scheduler = BackgroundScheduler()

@asynccontextmanager
async def lifespan(app: FastAPI):
    if not scheduler.running:
        def job_wrapper():
            db = SessionLocal()
            try:
                scheduled_backup(db)
            finally:
                db.close()
        scheduler.add_job(
            job_wrapper,
            trigger='cron',
            day_of_week='sat',
            hour=2,
            minute=0,
            timezone='Asia/Seoul'
        )
        scheduler.start()

    yield

    if scheduler.running:
        scheduler.shutdown()

# ✅ 앱을 lifespan 기반으로 1번만 생성
app = FastAPI(lifespan=lifespan, debug=True)

# 📁 정적 파일, CORS, 라우터 등록
app.mount("/files", StaticFiles(directory="files"), name="files")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5001)