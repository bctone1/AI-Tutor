from langchain_community.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from core.config import CHATGPT_API_KEY

import os
os.environ["OPENAI_API_KEY"] = CHATGPT_API_KEY

template = """
다음은 두 개의 입력값을 바탕으로 작성된 질문입니다.

입력 1 (시험 문제 내용 ) : {input_1}
입력 2 (시험 문제의 정답 ): {input_2}

위 정보를 바탕으로 왜 해당 문제의 정답이 input_2인지 해설을 작성해주세요.
만약 정답으로 입력되는 input_2가 0일 경우, 그냥 풀이 과정만 적어주세요.  
"""

# 힌트용 프롬프트 템플릿 추가
hint_template = """
다음은 시험 문제입니다.

문제 내용: {question}

이 문제를 해결하는데 도움이 되는 단계별 힌트를 제공해주세요.
정답을 직접 알려주지 말고, 학습자가 스스로 답을 찾을 수 있도록 점진적인 힌트를 3단계로 나누어 제공해주세요.

힌트 1: 문제에서 핵심 키워드나 개념을 파악하는 방향
힌트 2: 문제 해결을 위한 접근 방법이나 관련 이론
힌트 3: 답을 도출하기 위한 구체적인 사고 과정

각 힌트는 간결하고 명확하게 작성해주세요.
"""

prompt = PromptTemplate(
    input_variables=["input_1", "input_2"],
    template=template
)

# 힌트용 프롬프트 추가
hint_prompt = PromptTemplate(
    input_variables=["question"],
    template=hint_template
)

llm = ChatOpenAI(model_name = "gpt-3.5-turbo", temperature=0.7)

chain = LLMChain(llm=llm, prompt=prompt)
# 힌트용 체인 추가
hint_chain = LLMChain(llm=llm, prompt=hint_prompt)

def generate_explantation(input_1: str, input_2: int) -> str:
    response = chain.run({
        "input_1": input_1,
        "input_2": input_2
    })
    return response

def generate_hint(question: str) -> str:
    """
    문제에 대한 단계별 힌트를 생성합니다.
    
    Args:
        question (str): 문제 내용
        
    Returns:
        str: 단계별 힌트 텍스트
    """
    response = hint_chain.run({
        "question": question
    })
    return response
