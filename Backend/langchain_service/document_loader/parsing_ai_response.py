import re


def parse_ai_question(text: str):
    # 정답 번호 추출
    answer_match = re.search(r'정답\s*[:：]?\s*(\d+)', text)
    answer = int(answer_match.group(1)) if answer_match else None

    # 선택지 추출
    choices = re.findall(r'[①②③④⑤]\s*(.+)', text)

    # 문제 지문 추출 (선택지 앞까지만)
    question_match = re.split(r'[①②③④⑤]', text)[0]
    question = question_match.strip().replace('\n', ' ').strip()

    return [{
        "question": question,
        "choices": choices,
        "answer": answer
    }]
