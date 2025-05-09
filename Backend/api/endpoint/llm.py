from fastapi import APIRouter
from pydantic import BaseModel
from langchain_service import get_conversational_chain
from schema.llm import *
from fastapi.responses import JSONResponse


llm_router = APIRouter()

@llm_router.post("/chat", response_model=MessageResponse)
async def chat(request: MessageRequest):
    chain = get_conversational_chain(request.session_id)
    response = chain.run(request.message)
    return JSONResponse(content={"message": response}, status_code=500)