from langchain_openai import OpenAIEmbeddings
from core.config import CHATGPT_API_KEY
from sqlalchemy.orm import Session
from sqlalchemy import text
from model.exam import *
from model.llm import *
from sqlalchemy.sql.expression import func

embedding_model = OpenAIEmbeddings(
    model="text-embedding-3-small",
    openai_api_key=CHATGPT_API_KEY
)

def convert_to_vector(user_prompt : str):
    vector = embedding_model.embed_query(user_prompt)
    return vector

# RAG 기반 검색 : 유사성 있는 데이터 여러 개 조회
def get_similar_questions(db: Session, embedding: list[float], top_k: int = 5):
    vector_str = "[" + ",".join(map(str, embedding)) + "]"
    query = text("""
        SELECT *, vector_memory <-> CAST(:embedding AS vector) AS distance
        FROM knowledge_base
        ORDER BY distance ASC
        LIMIT :top_k;
    """)
    result = db.execute(query, {"embedding": vector_str, "top_k": top_k})
    return result.fetchall()

# RAG 기반 검색 : 가장 유사도가 높은 단 하나의 데이터 조회
def get_most_similar_question(db: Session, embedding: list[float]):
    vector_str = "[" + ",".join(map(str, embedding)) + "]"
    query = text("""
        SELECT *, vector_memory <-> CAST(:embedding AS vector) AS distance
        FROM reference
        ORDER BY distance ASC
        LIMIT 1;
    """)
    result = db.execute(query, {"embedding": vector_str})
    return result.fetchone()


def get_question_sub(db: Session, subject: str, solved: list[int]):
    query = db.query(LabelingData.question_id).filter(LabelingData.case == subject)

    if solved:
        query = query.filter(~LabelingData.question_id.in_(solved))  # solved에 없는 문제만

    question_id_row = query.order_by(func.random()).first()

    if question_id_row is None:
        return None  # 혹은 HTTPException 발생

    question_id = question_id_row[0]
    print(f"QUESTION ID : {question_id}")

    question = db.query(KnowledgeBase).filter(KnowledgeBase.id == question_id).first()
    return question

def save_reference_data(db : Session, file_name : str, file_size : int, subject : str, file_content : str):
    embedding_vector = convert_to_vector(file_content)
    new_reference = Reference(
        file_name = file_name,
        file_size = file_size,
        subject = subject,
        file_content = file_content,
        vector_memory = embedding_vector
    )
    db.add(new_reference)
    db.commit()
    db.refresh(new_reference)
    return new_reference

def get_reference_data(db : Session):
    references = db.query(Reference).all()
    return [
        {
            "id" : r.id,
            "file_name" : r.file_name,
            "file_size" : r.file_size,
            "subject" : r.subject,
            "file_content" : r.file_content
        }
        for r in references
    ]