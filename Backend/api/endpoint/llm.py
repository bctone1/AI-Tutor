from fastapi import APIRouter, Depends
from database.session import get_db
from langchain_service import get_conversational_chain
from schema.llm import *
from crud.llm import *
from fastapi.responses import JSONResponse
from langchain_service.document_loader.extract_question import parse_question_block
from langchain_service.agent.tutor import agent

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
    similar_example = get_similar_questions(db = db, embedding = vector_response, top_k = 3)
    sample = [row._mapping["question"] for row in similar_example]
    print(sample)
    return JSONResponse(content={"message": sample}, status_code=200)

@llm_router.post("/chatAgent")
async def chat_agent(request: ChatAgentRequest, db: Session = Depends(get_db)):
    user_prompt = request.message
    session_id = str(request.userdata.user.id)
    selected_subject = request.selectedSubject
    if "문제" in user_prompt:
        prompt = f"{selected_subject} | {user_prompt}"
        vector_response = convert_to_vector(prompt)
        similar_example = get_similar_questions(db=db, embedding=vector_response, top_k=1)
        sample = [row._mapping["question"] for row in similar_example]
        sample_id = [row._mapping["id"] for row in similar_example]
        print(f"SAMPLE ID {sample_id[0]}")
        sample2 = parse_question_block(sample[0])
        print(sample2["question"])
        print(sample2["choices"])
        return JSONResponse(content={
            "method":"true",
            "question": sample2["question"],
            "choices": sample2["choices"],
            "id": sample_id[0],
        })
    else:

        chain = get_conversational_chain(session_id)
        response = chain.run(user_prompt)

        return JSONResponse(content={"message": response}, status_code=200)

@llm_router.post("/getQuestion")
async def get_question_endpoint(request: GetQuestRequest, db: Session = Depends(get_db)):
    user_prompt = request.selectedSubject

    vector_response = convert_to_vector(user_prompt)
    similar_example = get_similar_questions(db=db, embedding=vector_response, top_k=1)
    sample = [row._mapping["question"] for row in similar_example]
    print(sample)
    sample_id = [row._mapping["id"] for row in similar_example]
    print(f"SAMPLE ID {sample_id[0]}")
    sample2 = parse_question_block(sample[0])
    print(sample2["question"])
    print(sample2["choices"])

    return JSONResponse(content={
        "question": sample2["question"],
        "choices": sample2["choices"],
        "id": sample_id[0],
    })
