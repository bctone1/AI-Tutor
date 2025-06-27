from langchain.agents import initialize_agent, Tool, AgentType
from langchain_community.chat_models import ChatOpenAI
from langchain_service.tools.rag import rag_search_tool
from core.config import CHATGPT_API_KEY

llm = ChatOpenAI(
    temperature=0,
    model_name="gpt-3.5-turbo",
    openai_api_key=CHATGPT_API_KEY
)

rag_tool = Tool(
    name="RAG Retriever",
    func=rag_search_tool,
    description=(
        "Searches for exam question data using similarity-based retrieval from the DB. "
        "If the user asks about exams or test questions, use the result of this tool as part of your answer. "
        "Do not use this tool for unrelated topics."
    )
)

agent = initialize_agent(
    tools=[rag_tool],
    llm=llm,
    agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)