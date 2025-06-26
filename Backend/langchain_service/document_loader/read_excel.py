import pandas as pd

def extract_questions_from_excel(file_location):
    try:
        df = pd.read_excel(file_location)

        # 필요한 컬럼이 존재하는지 확인
        if '문제 번호' not in df.columns or '문제 내용' not in df.columns:
            raise ValueError("엑셀 파일에 '문제 번호' 또는 '문제 내용' 컬럼이 없습니다.")

        # 딕셔너리 생성
        question_dict = dict(zip(df['문제 번호'], df['문제 내용']))

        return question_dict

    except Exception as e:
        print(f"오류 발생: {e}")
        return {}

