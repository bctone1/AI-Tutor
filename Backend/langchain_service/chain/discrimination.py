from langchain_community.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from core.config import CHATGPT_API_KEY

# OpenAI API 키 설정
import os
os.environ["OPENAI_API_KEY"] = CHATGPT_API_KEY

# 1. 프롬프트 템플릿 정의
template = """
My project provides two types of functions:

1. Retrieving specific **exam papers or past test questions** from the database based on the user's request.  
2. Providing answers to general **knowledge-based** or **casual** questions.

Here is the user's input:

User Question: {input}

If the question is **directly related to** "exam paper", "past exam questions", "test problems", "exam requests", or "question sheets", then choose "1".  
For all other general knowledge or everyday questions, choose "2".

Please respond with **only "1" or "2"**, nothing else.
"""

prompt = PromptTemplate(
    input_variables=["input_1", "input_2"],
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

