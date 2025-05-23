from starlette.middleware.cors import CORSMiddleware
from api.router import router
from fastapi import FastAPI
import uvicorn
from fastapi.staticfiles import StaticFiles



app = FastAPI(debug = True)
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
