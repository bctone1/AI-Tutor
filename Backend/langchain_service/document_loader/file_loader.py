from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import (
    PyPDFLoader,
    TextLoader
)
import os


def load_document(file_path):
    ext = os.path.splitext(file_path)[1].lower()

    if ext == '.pdf':
        loader = PyPDFLoader(file_path, )
        print(f"FULL TEXT : {loader}")
    elif ext == '.txt':
        loader = TextLoader(file_path, encoding='utf-8')
        print(f"FULL TEXT : {loader}")
    else:
        raise ValueError(f"지원되지 않는 파일 형식: {ext}")

    return loader.load()

def split_text_into_chunks(content_text: str, chunk_size: int = 500, chunk_overlap: int = 50):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", " ", ""],  # 문단 > 줄바꿈 > 공백 > 문자 기준
    )
    return text_splitter.split_text(content_text)