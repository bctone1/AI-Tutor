from langchain.chains import ConversationChain
from langchain_service.config import llm
from langchain_service.memory import get_memory

def get_conversational_chain(session_id: str):
    memory = get_memory(session_id)
    return ConversationChain(
        llm=llm,
        memory=memory,
        verbose=True
    )