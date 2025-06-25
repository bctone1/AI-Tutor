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

**기존 문제 데이터**
{additional_prompt}

기존 문제에 약간의 변형을 줘서,
아래 JSON 형식으로 출력해주세요:
{{ 
  "question": "문제 내용", 
  "choices": ["선택지1", "선택지2", "선택지3", "선택지4", "선택지5"], 
  "answer": 정답 번호 (예: 2),
  "description": "문제 해설"
}}

기존 문제 내용을 기반으로 하되 선택지의 순서를 바꾸고,
문제 내용의 말투 및 어순에 변화를 주는 정도로 수정해주세요.

주의사항:
1. **출력 형식은 반드시 위의 JSON 구조로 고정.**
2. **"choices"는 항상 정확히 5개의 개수를 맞춰서 생성.**
3. **문제의 큰 맥락 자체는 기존 문제 데이터에서 벗어나지 않도록 변형만 하여 출력.**
4. **문제의 맥락이나 주제는 유지하되 원본 문장을 그대로 다시 출력하는 것은 안 됨.**
5. **선택지를 바꾸는 과정에서 정답 번호를 틀리지 않도록 주의할 것.**

출력 생성시 위의 규칙은 반드시 지켜주세요.
"""

prompt = PromptTemplate(
    input_variables=["major", "subject", ["additional_prompt"]],
    template=template
)

# 2. LLM 모델 설정
llm = ChatOpenAI(
    model_name="gpt-3.5-turbo",
    temperature=0.3,
    streaming=True,
    openai_api_key=CHATGPT_API_KEY
)

# 3. Chain 구성
chain = LLMChain(llm=llm, prompt=prompt)

# 4. 함수 정의
def generate_ai_question(major: str, subject : str, add_prompt : str) -> int:
    response = chain.run({
        "major": major,
        "subject": subject,
        "additional_prompt": add_prompt
    })
    return response

