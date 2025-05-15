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
    description="DB 내에서 유사도 기반 검색으로 시험 문제 데이터를 가져옵니다. 만약 사용자가 시험이나 문제에 관한 요청을 한다면, 이 함수의 반환값을 답변으로 제공해주세요. 문제나 시험에 관한 질문이 아닐 경우 이 툴은 사용하지 마세요."
)

agent = initialize_agent(
    tools=[rag_tool],
    llm=llm,
    agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)