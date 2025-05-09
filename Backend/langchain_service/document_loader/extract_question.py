import re
from typing import List


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
