from langchain.chains import ConversationChain
from langchain_service.config import llm
from langchain_service.memory import get_memory

def get_conversational_chain(session_id: str):
    memory = get_memory(session_id)
    return ConversationChain(
        llm=llm,
        memory=memory,
        verbose=True  # 개발 중에는 True로 하면 로그 확인 가능
    )