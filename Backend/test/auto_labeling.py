'''from langchain_service.document_loader.file_loader import load_document_by_ocr

file_path = "test2.pdf"


document = load_document_by_ocr(file_path)

for doc in document:
    print(doc.page_content)'''

from langchain_service.document_loader.file_loader import load_document_by_ocr

docs = load_document_by_ocr("test2.pdf")
for d in docs:
    print(d.page_content)
