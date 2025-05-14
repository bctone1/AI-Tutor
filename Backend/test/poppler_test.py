import subprocess

pdfinfo_path = r"C:\Program Files\poppler-24.08.0\Library\bin\pdfinfo.exe"
result = subprocess.run([pdfinfo_path, "test2.pdf"], capture_output=True, text=True)
print(result.stdout)