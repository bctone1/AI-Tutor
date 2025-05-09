from langchain_service.document_loader.file_loader import load_document
from langchain_service.document_loader.extract_question import extract_questions_from_pages

a = load_document("test1.pdf")

page_texts = [doc.page_content for doc in a]

questions = extract_questions_from_pages(page_texts)

for idx, q in enumerate(questions, 1):
    print(f"--- 문제 {idx} ---")
    print(q)
    print("\n\n\n")
