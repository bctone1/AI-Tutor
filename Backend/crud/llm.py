from langchain_openai import OpenAIEmbeddings
from core.config import CHATGPT_API_KEY
from sqlalchemy.orm import Session
from sqlalchemy import text
from model.exam import *

embedding_model = OpenAIEmbeddings(
    model="text-embedding-3-small",
    openai_api_key=CHATGPT_API_KEY
)

def convert_to_vector(user_prompt : str):
    vector = embedding_model.embed_query(user_prompt)
    return vector

def get_similar_questions(db: Session, embedding: list[float], top_k: int = 1):
    vector_str = "[" + ",".join(map(str, embedding)) + "]"
    query = text("""
        SELECT *, vector_memory <-> CAST(:embedding AS vector) AS distance
        FROM knowledge_base
        ORDER BY distance ASC
        LIMIT :top_k;
    """)
    result = db.execute(query, {"embedding": vector_str, "top_k": top_k})
    return result.fetchall()
