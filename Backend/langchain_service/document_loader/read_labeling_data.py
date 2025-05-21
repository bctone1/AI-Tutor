import pandas as pd

def excel_to_list(file_path):
    # 엑셀 파일에서 첫 번째 시트 이름 가져오기
    xls = pd.ExcelFile(file_path)
    first_sheet_name = xls.sheet_names[0]

    # 첫 번째 시트 데이터 읽기 (첫 두 행은 헤더로 사용하지 않음)
    df = pd.read_excel(file_path, sheet_name=first_sheet_name, header=None, skiprows=2)

    # 열 이름 지정
    df.columns = ['교시', '과목', '문제번호', '가답안', '난이도', '유형']

    # NaN 값 제거
    df = df.dropna()

    # 데이터프레임을 리스트로 변환
    data_list = df.values.tolist()

    # 딕셔너리에 첫 시트 이름을 키로 추가
    return {first_sheet_name: data_list}

'''
# 사용 예시
file_path = 'C:\\Users\\leegy\\Desktop\\AI_Tutor\\AI-Tutor\\Backend\\files\\label\\물리치료 라벨링 결과.xlsx'
data_dict = excel_to_list(file_path)

# 결과 출력 (예시: 첫 번째 시트의 첫 5개 항목 출력)
for sheet_name, data_list in data_dict.items():
    print(f"시트 이름: {sheet_name}")
    print("데이터 샘플:")
    for item in data_list[:]:
        print(item)
    print("\n")'''