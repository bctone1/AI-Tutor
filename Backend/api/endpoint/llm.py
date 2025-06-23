from fastapi import APIRouter, Depends, Request, UploadFile, File, Form
from database.session import get_db
from langchain_service import get_conversational_chain
from schema.llm import *
from core.util import REFERENCE_LOCATION
from crud.llm import *
from crud.exam import get_unique_filename
from fastapi.responses import JSONResponse
from langchain_service.document_loader.extract_question import parse_question_block
from langchain_service.chain.discrimination import discrimination
from langchain_service.document_loader.file_loader import load_document, split_text_into_chunks
import json
import random
import os

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
    solved_problems = request.solvedProblemIds
    id_list = get_id_by_case(db = db, case = selected_subject)
    
    case = discrimination(user_prompt)
    if case == 1:
        prompt = f"{selected_subject} | {user_prompt}"
        vector_response = convert_to_vector(prompt)
        similar_example = get_similar_questions(db=db, embedding=vector_response, exclude_ids = solved_problems, id_list = id_list, top_k=10)
        if not similar_example:
            return JSONResponse(content={
                "message": "해당 유형의 문제를 전부 학습하셨습니다! 더 이상 풀 문제가 없습니다.",
                "status": True
            })
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
            "message" : "해당 유형의 문제를 전부 학습하셨습니다! 더 이상 풀 문제가 없습니다.",
            "status" : True
        })

    print(f"QUESTION : {question}")
    parsed = parse_question_block(question.question)
    return JSONResponse(content={
        "question": parsed["question"],
        "choices": parsed["choices"],
        "id": question.id
        
    })


@llm_router.post("/uploadReferenceData")
async def upload_reference_data(
        db: Session = Depends(get_db),
        file: UploadFile = File(...),
        department: str = Form(...)
):
    if not os.path.exists(REFERENCE_LOCATION):
        os.makedirs(REFERENCE_LOCATION)

    content = await file.read()
    filename = file.filename

    file_location = os.path.join(REFERENCE_LOCATION, file.filename)
    unique_file_location, unique_name = get_unique_filename(file_location)
    with open(unique_file_location, "wb") as f:
        f.write(content)
    docs = load_document(file_path = unique_file_location)
    content_text = "\n".join([doc.page_content for doc in docs])

    reference = save_reference_data(db = db, file_name=filename, file_size = len(content),
                        subject = department, file_content=content_text)

    chunks = split_text_into_chunks(content_text)
    for chunk in chunks:
        save_reference_chunk(db = db, reference_id = reference.id, chunk = chunk)

    return JSONResponse(content={
        "message" : "정상적으로 업로드 되었습니다."
    })

@llm_router.post("/getReferenceData", response_model=List[ReferenceSchema])
async def get_reference_data_endpoint(db: Session = Depends(get_db)):
    references = get_reference_data(db = db)
    return references

@llm_router.post("/DeleteReferenceData")
async def delete_exam_endpoint(request: DeleteReferenceData, db: Session = Depends(get_db)):
    reference_id = request.file_id
    delete_reference(db = db, reference_id = reference_id)
    return JSONResponse(content={
        "message": "참고자료가 삭제되었습니다."})


@llm_router.post("/getAIQuestion")
async def get_ai_question_endpoint(request: GetAIQuestionRequest):
    major = request.major
    subject = request.selectedSubject
    print(f"DEPARTMENT : {major}")
    print(f"SUBJECT : {subject}")
    question = get_ai_question(major = major, subject = subject)
    print(f"QUESTION : {question}")
    question_obj = json.loads(question)
    return JSONResponse(content={
        "question": question_obj["question"],
        "choices": question_obj["choices"],
        "answer": question_obj["answer"],
        "description": question_obj["description"]
    })