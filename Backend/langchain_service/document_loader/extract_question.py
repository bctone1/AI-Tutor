import re
from typing import List, Dict


def extract_questions_from_pages(page_texts: List[str]) -> List[str]:
    """
    PDF에서 추출한 page_texts 리스트를 받아서,
    숫자. 패턴을 기준으로 문제 단위로 분리한 리스트를 반환합니다.
    """
    full_text = "\n".join(page_texts)

    # 숫자 + '.' + 공백 위치 찾기
    split_matches = list(re.finditer(r'(\d+\.)\s+', full_text))
    if not split_matches:
        return []

    # 시작 인덱스 리스트
    starts = [m.start() for m in split_matches]
    starts.append(len(full_text))  # 마지막까지 자르기 위해

    # 문제 덩어리 추출
    questions = [
        full_text[starts[i]:starts[i + 1]].strip()
        for i in range(len(starts) - 1)
    ]

    return questions


def parse_question_block(question_block: str) -> Dict:
    """
    하나의 문항 블록에서 질문과 보기를 분리하여 반환합니다.
    """
    # 질문 부분 추출 (①, ② 등의 첫 등장 이전까지)
    match = re.search(r'(?P<question>.*?)(?=[①-⑩])', question_block, re.DOTALL)
    if not match:
        return {
            "question": question_block.strip(),
            "choices": []
        }

    question_text = match.group("question").strip()

    # 보기들 추출 (① ~ ⑩)
    choices = re.findall(r'[①②③④⑤⑥⑦⑧⑨⑩]\s*(.*)', question_block)

    return {
        "question": question_text,
        "choices": choices
    }

def extract_all_structured_questions(page_texts: List[str]) -> List[Dict]:
    raw_blocks = extract_questions_from_pages(page_texts)
    return [parse_question_block(block) for block in raw_blocks]



# 출력 예시 : [{'question': '1. 다음 중 경첩관절은 ?', 'choices': ['어깨관절', '팔꿉관절', '손목관절', '엉덩관절', '복장빗장관절']}]