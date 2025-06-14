from fastapi import APIRouter, Depends, Request
from database.session import get_db
from langchain_service import get_conversational_chain
from schema.llm import *
from crud.llm import *
from fastapi.responses import JSONResponse
from langchain_service.document_loader.extract_question import parse_question_block
from langchain_service.chain.discrimination import discrimination
import random
llm_router = APIRouter()

@llm_router.post("/chatLLM2", response_model=MessageResponse)
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
    similar_example = get_similar_questions(db = db, embedding = vector_response, top_k = 5)
    print(similar_example)
    return JSONResponse(content={"message": similar_example}, status_code=200)

@llm_router.post("/chatAgent")
async def chat_agent(request: ChatAgentRequest, db: Session = Depends(get_db)):
    user_prompt = request.message
    session_id = str(request.userdata.user.id)
    selected_subject = request.selectedSubject
    case = discrimination(user_prompt)
    if case == 1:
        prompt = f"{selected_subject} | {user_prompt}"
        vector_response = convert_to_vector(prompt)
        similar_example = get_similar_questions(db=db, embedding=vector_response, top_k=10)
        selected_row = random.choice(similar_example)
        question_text = selected_row._mapping["question"]
        question_id = selected_row._mapping["id"]
        parsed = parse_question_block(question_text)

        return JSONResponse(content={
            "method": "true",
            "question": parsed["question"],
            "choices": parsed["choices"],
            "id": question_id,
        })
    else:

        chain = get_conversational_chain(session_id)
        response = chain.run(user_prompt)

        return JSONResponse(content={"message": response}, status_code=200)

@llm_router.post("/getQuestion")
async def get_question_endpoint(request: Request, db: Session = Depends(get_db)):
    data = await request.json()  # ⬅️ 비동기로 JSON 파싱
    subject = data.get("selectedSubject")
    solved = data.get("solvedProblemIds")
    print(f"SUBJECT : {subject}")

    question = get_question_sub(db = db, subject = subject, solved = solved)

    if not question:
        return JSONResponse(content={
            "message" : "해당 과목의 문제를 전부 학습하셨습니다! 더 이상 풀 문제가 없습니다.",
            "status" : True
        })

    print(f"QUESTION : {question}")
    parsed = parse_question_block(question.question)
    return JSONResponse(content={
        "question": parsed["question"],
        "choices": parsed["choices"],
        "id": question.id
        
    })

