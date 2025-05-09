from langchain_openai import OpenAIEmbeddings
from core.config import CHATGPT_API_KEY

embedding_model = OpenAIEmbeddings(
    model="text-embedding-3-small",
    openai_api_key=CHATGPT_API_KEY
)
