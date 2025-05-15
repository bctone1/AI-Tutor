from fastapi import APIRouter, Depends
from database.session import get_db
from langchain_service import get_conversational_chain
from schema.llm import *
from crud.llm import *
from fastapi.responses import JSONResponse
from langchain_service.agent.tutor import agent

llm_router = APIRouter()

@llm_router.post("/chatLLM", response_model=MessageResponse)
async def chat(request: MessageRequest):
    user_prompt = request.message
    session_id = request.session_id

    chain = get_conversational_chain(session_id)
    response = chain.run(user_prompt)

    return JSONResponse(content={"message": response}, status_code=200)

@llm_router.post("/RagSearch", response_model=MessageResponse)
async def rag(request: MessageRequest, db: Session = Depends(get_db)):
    user_prompt = request.message

    vector_response = convert_to_vector(user_prompt)
    similar_example = get_similar_questions(db = db, embedding = vector_response, top_k = 3)
    sample = [row._mapping["question"] for row in similar_example]
    print(sample)
    return JSONResponse(content={"message": sample}, status_code=200)

@llm_router.post("/chatAgent", response_model=MessageResponse)
async def chat_agent(request: MessageRequest, db: Session = Depends(get_db)):
    user_prompt = request.message
    session_id = request.session_id
    if "문제" or "시험" or "테스트" or "문항" in user_prompt:
        vector_response = convert_to_vector(user_prompt)
        similar_example = get_similar_questions(db=db, embedding=vector_response, top_k=3)
        sample = [row._mapping["question"] for row in similar_example]
        print(sample)
        return JSONResponse(content={"message": sample}, status_code=200)
    else:

        chain = get_conversational_chain(session_id)
        response = chain.run(user_prompt)

        return JSONResponse(content={"message": response}, status_code=200)