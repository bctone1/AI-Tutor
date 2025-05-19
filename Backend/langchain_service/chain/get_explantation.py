from langchain_community.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from core.config import CHATGPT_API_KEY

# OpenAI API 키 설정
import os
os.environ["OPENAI_API_KEY"] = CHATGPT_API_KEY

# 1. 프롬프트 템플릿 정의
template = """
다음은 두 개의 입력값을 바탕으로 작성된 질문입니다.

입력 1 (시험 문제 내용 ) : {input_1}
입력 2 (시험 문제의 정답 ): {input_2}

위 정보를 바탕으로 왜 해당 문제의 정답이 input_2인지 해설을 작성해주세요.
"""

prompt = PromptTemplate(
    input_variables=["input_1", "input_2"],
    template=template
)

# 2. LLM 모델 설정
llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.7)

# 3. Chain 구성
chain = LLMChain(llm=llm, prompt=prompt)

# 4. 함수 정의
def generate_explantation(input_1: str, input_2: int) -> str:
    response = chain.run({
        "input_1": input_1,
        "input_2": input_2
    })
    return response
'''
# ✅ 예시 사용
if __name__ == "__main__":
    answer = get_explantation("한국 초대 대통령은 누구인가? 1 - 이승만, 2-이순신, 3-을지문덕, ", 1)
    print("LLM 응답:", answer)

'''