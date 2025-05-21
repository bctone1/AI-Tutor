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
"""

prompt = PromptTemplate(
    input_variables=["input_1", "input_2"],
    template=template
)

llm = ChatOpenAI(model_name = "gpt-3.5-turbo", temperature=0.7)

chain = LLMChain(llm=llm, prompt=prompt)

def generate_explantation(input_1: str, input_2: int) -> str:
    response = chain.run({
        "input_1": input_1,
        "input_2": input_2
    })
    return response
