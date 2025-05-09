from langchain_community.chat_models import ChatOpenAI
from core.config import CHATGPT_API_KEY

llm = ChatOpenAI(
    model_name="gpt-4",
    temperature=0.7,
    openai_api_key = CHATGPT_API_KEY
)