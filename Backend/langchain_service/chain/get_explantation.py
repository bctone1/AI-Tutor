from langchain_community.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from core.config import CHATGPT_API_KEY

import os
os.environ["OPENAI_API_KEY"] = CHATGPT_API_KEY

template = """
Based on the following three inputs, generate a detailed explanation for the given exam question.

Input 1 (Exam question content): {input_1}
Input 2 (Correct answer to the exam question): {input_2}
Input 3 (Database content): {input_3}

Please write the explanation **in Korean**.

Your explanation should clearly describe the reasoning behind each of the options.
- For incorrect options, explain why they cannot be the correct answer.
- For the correct option, explain clearly why it is the correct choice.

Use the database information (Input 3) **only if** it is necessary to generate a meaningful explanation. Otherwise, ignore it.

Add a visible '\\n\\n' character at every point where a line break is appropriate.  
This includes between explanations for each option and within long explanations for clarity.


"""

hint_template = """
Here is an exam question:

Question: {question}

Provide step-by-step hints to help the learner solve the problem.
Do **not** reveal the correct answer. Instead, guide the learner to find the answer on their own by giving three progressive hints.

Write the hints **in Korean**.

Hint 1: Help the learner identify key concepts or keywords in the question.  
Hint 2: Suggest a general approach or relevant theory for solving the problem.  
Hint 3: Provide a concrete thinking process that leads toward the correct answer.

Each hint should be concise, clear, and presented in a well-structured format.  
Include line breaks between each hint.
"""

prompt = PromptTemplate(
    input_variables=["input_1", "input_2", "input_3"],
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

def generate_explantation(input_1: str, input_2: int, input_3 : str) -> str:
    response = chain.run({
        "input_1": input_1,
        "input_2": input_2,
        "input_3": input_3
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
