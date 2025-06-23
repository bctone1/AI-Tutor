from langchain_community.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from core.config import CHATGPT_API_KEY

import os
os.environ["OPENAI_API_KEY"] = CHATGPT_API_KEY

# 1. 프롬프트 템플릿 정의
template = """
사용자는 {major}를 전공 중이며,
현재 {subject}에 관한 문제를 학습하고자 합니다.
직접 문제를 생성하고, 
아래 JSON 형식으로 출력해주세요:
{{ 
  "question": "문제 내용", 
  "choices": ["① 선택지1", "② 선택지2", "③ 선택지3", "④ 선택지4", "⑤ 선택지5"], 
  "answer": 정답 번호 (예: 2),
  "description": "문제 해설"
}}
"""

prompt = PromptTemplate(
    input_variables=["major", "subject"],
    template=template
)

# 2. LLM 모델 설정
llm = ChatOpenAI(
    model_name="gpt-3.5-turbo",
    temperature=0,
    streaming=True,
    openai_api_key=CHATGPT_API_KEY
)

# 3. Chain 구성
chain = LLMChain(llm=llm, prompt=prompt)

# 4. 함수 정의
def generate_ai_question(major: str, subject : str) -> int:
    response = chain.run({
        "major": major,
        "subject": subject
    })
    return response

