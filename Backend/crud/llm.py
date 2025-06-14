from langchain_openai import OpenAIEmbeddings
from core.config import CHATGPT_API_KEY
from sqlalchemy.orm import Session
from sqlalchemy import text
from model.exam import *
from sqlalchemy.sql.expression import func

embedding_model = OpenAIEmbeddings(
    model="text-embedding-3-small",
    openai_api_key=CHATGPT_API_KEY
)

def convert_to_vector(user_prompt : str):
    vector = embedding_model.embed_query(user_prompt)
    return vector

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
