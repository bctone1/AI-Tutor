from database.session import SessionLocal
from crud.llm import convert_to_vector, get_similar_questions

def rag_search_tool(prompt: str) -> str:
    db = SessionLocal()  # 세션 생성
    try:
        embedding = convert_to_vector(prompt)  # 텍스트 -> 벡터
        results = get_similar_questions(db=db, embedding=embedding, top_k=3)
        questions = [row._mapping["question"] for row in results]
        return "\n".join(questions) if questions else "유사한 질문이 없습니다."
    finally:
        db.close()