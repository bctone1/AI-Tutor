from langchain_community.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from core.config import CHATGPT_API_KEY

import os
os.environ["OPENAI_API_KEY"] = CHATGPT_API_KEY

# 1. 프롬프트 템플릿 정의
template = """
사용자에게 시험 문제를 하나 생성해주세요.  
사용자는 {major}을 전공하고 있습니다. 
그리고 그 중에서도 현재 {subject} 유형 문제에 대한 학습이 필요한 상황입니다.

아래 구조의 양식으로 문제를 생성해주세요.

예시 1
다음에서 설명하는 상피조직은 ? 
• 피부, 입안, 식도 등에 분포
• 물리화학적 자극에 대한 보호 작용
① 이행상피
② 단층편평상피
③ 단층입방상피
④ 중층편평상피
⑤ 거짓중층섬모원주상피
정답 : 4

예시 2
다음에서 설명하는 척추뼈는 ?
• 치아돌기가 위로 돌출됨
• 척추뼈몸통, 가시돌기, 가로구멍 등으로 구성됨
① 고리뼈
② 중쇠뼈
③ 솟을뼈
④ 다섯째목뼈
⑤ 여섯째목뼈
정답 : 2

예시 3
다음에서 설명하는 머리뼈는 ?
• 머리뼈바닥 중앙에 위치함
• 안장(sella turcica) 바닥에 뇌하수체(hypophysis)가 위치함
① 벌집뼈
② 관자뼈
③ 이마뼈
④ 나비뼈
⑤ 뒤통수뼈
정답 : 4
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

