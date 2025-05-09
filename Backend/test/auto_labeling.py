from crud.exam import *
a = load_document("test1.pdf")


if __name__ == "__main__":
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker

    # DB 연결
    engine = create_engine(
        "postgresql+psycopg2://postgres:3636@localhost/knowledge_base",
        connect_args={"client_encoding": "UTF8"}
    )
    SessionLocal = sessionmaker(bind=engine)

    # 테스트 실행
    with SessionLocal() as session:
        process_exam_with_langchain_embedding(
            session=session,
            file_path="test1.pdf",
            department="컴퓨터공학과",
            subject="자료구조"
        )