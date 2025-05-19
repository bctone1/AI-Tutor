from starlette.middleware.cors import CORSMiddleware
from core.config import DB_SERVER
from api.router import router
from fastapi import FastAPI
import uvicorn

app = FastAPI(debug = True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3001",
        f"http://{DB_SERVER}:3001",
        "https://onecloud.kr",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5001)
