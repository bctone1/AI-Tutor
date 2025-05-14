from langchain_community.document_loaders import (
    PyPDFLoader,
    UnstructuredPDFLoader
)
import os
from pdf2image import convert_from_path
import pytesseract
from langchain_core.documents import Document

def load_document(file_path):
    ext = os.path.splitext(file_path)[1].lower()

    if ext == '.pdf':
        loader = PyPDFLoader(file_path, )
        print(f"FULL TEXT : {loader}")
    else:
        raise ValueError(f"지원되지 않는 파일 형식: {ext}")

    return loader.load()

def load_document_by_ocr(file_path):
    ext = os.path.splitext(file_path)[1].lower()

    if ext == '.pdf':
        loader = UnstructuredPDFLoader(file_path, mode="elements", ocr=True)
        print(f"FULL TEXT: {loader}")
    else:
        raise ValueError(f"지원되지 않는 파일 형식: {ext}")

    return loader.load()

def load_document_by_ocr_manual(file_path, poppler_path):
    # 이미지로 변환
    images = convert_from_path(file_path, poppler_path=poppler_path)

    docs = []
    for i, img in enumerate(images):
        text = pytesseract.image_to_string(img, lang="eng+kor")  # 한국어+영어 OCR
        doc = Document(page_content=text, metadata={"page": i + 1})
        docs.append(doc)

    return docs