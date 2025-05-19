from langchain_community.document_loaders import (
    PyPDFLoader
)
import os


def load_document(file_path):
    ext = os.path.splitext(file_path)[1].lower()

    if ext == '.pdf':
        loader = PyPDFLoader(file_path, )
        print(f"FULL TEXT : {loader}")
    else:
        raise ValueError(f"지원되지 않는 파일 형식: {ext}")

    return loader.load()


