from langchain_community.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from core.config import CHATGPT_API_KEY

# OpenAI API 키 설정
import os
os.environ["OPENAI_API_KEY"] = CHATGPT_API_KEY

# 1. 프롬프트 템플릿 정의
template = """
저의 프로젝트는 두 가지 유형의 기능을 제공합니다.

1. DB 내에서 사용자 요청과 관련된 시험지 제공
2. 일반적으로 사용자 질문에 따른 답변 제공

다음은 사용자가 입력한 질문입니다.

입력 ( 사용자 질문 ) : {input}

위 정보를 바탕으로 1과 2 중 어떤 기능을 제공할지 알려주세요.
응답은 단순하게 "1" 혹은 "2"로만 대답해주세요.
"""

prompt = PromptTemplate(
    input_variables=["input_1", "input_2"],
    template=template
)

# 2. LLM 모델 설정
llm = ChatOpenAI(model="gpt-4", temperature=0.7)

# 3. Chain 구성
chain = LLMChain(llm=llm, prompt=prompt)

# 4. 함수 정의
def discrimination(input: str) -> int:
    response = chain.run({
        "input": input
    })
    if "1" in response:
        return 1
    elif "2" in response:
        return 2
    else :
        return 2
'''
# ✅ 예시 사용
if __name__ == "__main__":
    answer = discrimination("관절에 관한 문제 내주세요.")
    print("LLM 응답:", answer)
    if isinstance(answer, str):
        print("문자열(str)입니다.")
    elif isinstance(answer, int):
        print("정수(int)입니다.")
    else:
        print("다른 타입입니다.")

'''