import pandas as pd

def excel_to_list(file_path, sheet_number):
    xls = pd.ExcelFile(file_path)
    first_sheet_name = xls.sheet_names[sheet_number]

    # 첫 번째 시트 데이터 읽기 (첫 두 행은 헤더로 사용하지 않음)
    df = pd.read_excel(file_path, sheet_name=first_sheet_name, header=None, skiprows=1)

    df.columns = ['교시', '과목', '문제번호', '답안', '분야번호', '분야이름', '영역번호', '영역이름', '난이도']

    df = df.dropna()

    data_list = df.values.tolist()

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