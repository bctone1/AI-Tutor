import re
from typing import List, Dict


def extract_questions_from_pages(page_texts: List[str]) -> List[str]:
    full_text = "\n".join(page_texts)

    matches = list(re.finditer(r'(?<!\d)(\d{1,3})\.', full_text))
    if not matches:
        return []

    starts = []
    for m in matches:
        num_end = m.end()
        if num_end >= len(full_text):
            continue

        if re.match(r'[\s]*[가-힣a-zA-Z0-9]', full_text[num_end:num_end + 3]):
            starts.append(m.start())

    starts.append(len(full_text))  # 마지막 경계

    questions = [
        full_text[starts[i]:starts[i + 1]].strip()
        for i in range(min(len(starts) - 1, 30))
    ]

    clean_questions = [
        re.sub(r'^\d{1,3}\.\s*', '', q).strip()
        for q in questions
    ]

    return clean_questions

def parse_question_block(question_block: str) -> Dict:
    """
    보기 기호(① ~ ⑩)가 공백 없이 이어진 경우도 포함해 문제와 보기를 분리합니다.
    """
    # 질문 추출: 보기 기호가 처음 등장하기 전까지
    match = re.search(r'(?P<question>.*?)(?=[①②③④⑤⑥⑦⑧⑨⑩])', question_block, re.DOTALL)
    if not match:
        return {
            "question": question_block.strip(),
            "choices": []
        }

    question_text = match.group("question").strip()

    # 보기 추출: 기호 기준으로 split
    raw_choices = re.split(r'(?:[①②③④⑤⑥⑦⑧⑨⑩])', question_block)
    # 첫 항목은 질문이므로 제거
    choices = [c.strip() for c in raw_choices[1:] if c.strip()]

    return {
        "question": question_text,
        "choices": choices
    }

def extract_all_structured_questions(page_texts: List[str]) -> List[Dict]:
    raw_blocks = extract_questions_from_pages(page_texts)
    return [parse_question_block(block) for block in raw_blocks]



# 출력 예시 : [{'question': '다음 중 경첩관절은 ?', 'choices': ['어깨관절', '팔꿉관절', '손목관절', '엉덩관절', '복장빗장관절'], "answer" : 3}]