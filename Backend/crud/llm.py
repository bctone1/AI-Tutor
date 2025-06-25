from langchain_openai import OpenAIEmbeddings
from core.config import CHATGPT_API_KEY
from sqlalchemy import text
from model.exam import *
from model.llm import *
from sqlalchemy.sql.expression import func
from langchain_service.chain.generate_question import generate_ai_question

embedding_model = OpenAIEmbeddings(
    model="text-embedding-3-small",
    openai_api_key=CHATGPT_API_KEY
)

def convert_to_vector(user_prompt : str):
    vector = embedding_model.embed_query(user_prompt)
    return vector

# RAG 기반 검색 : 유사성 있는 데이터 여러 개 조회
def get_similar_questions(
    db: Session,
    embedding: list[float],
    exclude_ids: list[int],
    id_list: list[int],
    top_k: int = 5
):
    vector_str = "[" + ",".join(map(str, embedding)) + "]"
    conditions = []
    if id_list:
        id_list_str = ",".join(map(str, id_list))
        conditions.append(f"id IN ({id_list_str})")

    if exclude_ids:
        exclude_ids_str = ",".join(map(str, exclude_ids))
        conditions.append(f"id NOT IN ({exclude_ids_str})")

    where_clause = ""
    if conditions:
        where_clause = "WHERE " + " AND ".join(conditions)


    query = text(f"""
        SELECT *, vector_memory <-> CAST(:embedding AS vector) AS distance
        FROM knowledge_base
        {where_clause}
        ORDER BY distance ASC
        LIMIT :top_k;
    """)
    result = db.execute(query, {"embedding": vector_str, "top_k": top_k}).fetchall()
    if not result:
        return None
    return result

# RAG 기반 검색 : 가장 유사도가 높은 단 하나의 데이터 조회
def get_most_similar_question(db: Session, embedding: list[float], id_list: list[int]):
    if not id_list:
        return None
    vector_str = "[" + ",".join(map(str, embedding)) + "]"
    id_list_str = ",".join(map(str, id_list))
    query = text(f"""
        SELECT *, vector_memory <-> CAST(:embedding AS vector) AS distance
        FROM reference_chunk
        WHERE reference_id IN ({id_list_str})
        ORDER BY distance ASC
        LIMIT 1;
    """)
    result = db.execute(query, {"embedding": vector_str}).mappings().fetchone()
    return result["content"] if result else None


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

def save_reference_chunk(db : Session, reference_id : int, chunk : str):
    embedding_vector = convert_to_vector(chunk)
    new_chunk = ReferenceChunk(
        reference_id = reference_id,
        content = chunk,
        vector_memory = embedding_vector
    )
    db.add(new_chunk)
    db.commit()
    db.refresh(new_chunk)
    return new_chunk

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

def get_id_by_subject(db : Session, question_id : int):
    label = db.query(LabelingData).filter(LabelingData.question_id == question_id).first()
    ids = db.query(Reference.id).filter(Reference.subject == label.subject).all()
    id_list = [id_tuple[0] for id_tuple in ids]
    return id_list

def get_id_by_case(db : Session, case : str):
    ids = db.query(LabelingData.question_id).filter(LabelingData.case == case).all()
    id_list = [id_tuple[0] for id_tuple in ids]
    return id_list


def delete_reference(db: Session, reference_id: int):
    reference = db.query(Reference).filter(Reference.id == reference_id).first()
    if reference:
        db.delete(reference)
        db.commit()

def get_question_prompt(db: Session, subject: str):
    labeling_list = db.query(LabelingData).filter(LabelingData.case == subject)
    labeling_data = labeling_list.order_by(func.random()).first()
    if labeling_data is None:
        return None
    questino_id = labeling_data.question_id
    question_data = db.query(KnowledgeBase).filter(KnowledgeBase.id == questino_id).first()
    print(f"QUESTION : {question_data.question}")


    answer = labeling_data.correct_answer
    prompt = (f"""문제 : {question_data.question}
                  정답 : {answer}""")
    return prompt


def get_ai_question(major : str, subject : str, add_prompt : str):
    question = generate_ai_question(major = major, subject = subject, add_prompt = add_prompt)
    return question