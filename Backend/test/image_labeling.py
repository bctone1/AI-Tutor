from pdf2image import convert_from_path
import pytesseract
from PIL import Image

# Tesseract 실행 경로 설정 (Windows의 경우만 필요)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# 1. PDF를 이미지로 변환
images = convert_from_path('test2.pdf', dpi=300)

# 2. OCR로 각 이미지에서 텍스트 추출
all_text = ""
for i, img in enumerate(images):
    text = pytesseract.image_to_string(img, lang='kor')  # 필요시 'kor' 등으로 변경
    all_text += f"\n--- Page {i+1} ---\n{text}"

# 3. 결과 출력 또는 저장
print(all_text)