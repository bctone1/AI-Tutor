from langchain.memory import ConversationBufferMemory

_session_memory = {}

def get_memory(session_id: str):
    if session_id not in _session_memory:
        _session_memory[session_id] = ConversationBufferMemory(
            return_messages=True
        )
    return _session_memory[session_id]