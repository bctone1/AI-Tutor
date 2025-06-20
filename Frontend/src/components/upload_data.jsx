import React, { useRef, useState, useEffect } from 'react';
import { Upload, FileText } from 'lucide-react';

const UploadData = ({ userdata }) => {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  // const [isLoading, setIsLoading] = useState(true);

  const fetchFiles = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getReferenceData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (response.ok) {
        // 선택된 학과에 따라 파일 필터링
        const filteredFiles = selectedDepartment
          ? data.filter(file => file.subject === selectedDepartment)
          : [];
        setFiles(filteredFiles);
      }
      console.log(data);
    } catch (err) {
      // Handle error
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [selectedDepartment]); // selectedDepartment가 변경될 때마다 실행

  const handleDelete = async (id) => {
    if (!confirm("정말 삭제하시겠습니까?")) {
      return;
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/DeleteReferenceData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ exam_id: id }),
    });
    const data = await res.json();
    console.log(data);
    if (res.ok) {
      alert("파일이 삭제되었습니다.");
      setFiles(prevFiles => prevFiles.filter(file => file.id !== id));
    } else {
      alert("삭제 실패: 서버 오류");
    }
  }





  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    console.log(selectedFile);
    if (!selectedFile) return;
    if (!selectedDepartment) {
      alert('학과를 선택해주세요.');
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    // formData.append('userData', JSON.stringify(userdata));
    formData.append('department', selectedDepartment);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploadReferenceData`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        alert("파일이 업로드 되었습니다!");
        // 파일 업로드 성공 후 파일 목록 업데이트
        await fetchFiles();
      } else {
        alert('업로드 실패: 서버 오류');
      }
    } catch (error) {
      alert('업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange({ target: { files: e.dataTransfer.files } });
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen text-sm text-gray-800">
      {/* Breadcrumb */}
      <div className="text-gray-500 px-5 py-3 flex items-center space-x-2 text-sm">
        <a href="#">홈</a>
        <span>{'>'}</span>
        <a href="#">지식베이스 관리</a>
        <span>{'>'}</span>
        <span>참고 데이터 업로드</span>
      </div>

      {/* Content */}
      <main className="container mx-auto px-5 py-8">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">참고 데이터 업로드 (교과서, 학습지 등)</h2>

        {/* Department Selection */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            학과 선택
          </label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">학과를 선택하세요</option>
            <option value="물리치료학기초_해부생리학">물리치료학과</option>
            <option value="작업치료학기초_해부생리학">작업치료학과</option>
          </select>
        </div>

        {/* Upload Box */}
        <div
          className={`border border-dashed border-gray-300 bg-white rounded-lg p-10 text-center mb-8 transition ${dragActive ? 'border-indigo-500 bg-indigo-50' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center border-2 border-gray-400 text-gray-400 rounded">
            <Upload size={24} />
          </div>
          <p className="text-lg text-gray-700 mb-2">파일을 여기에 끌어다 놓거나 선택하세요</p>
          <p className="text-sm text-gray-500 mb-5">PDF(.pdf) 또는 TXT(.txt) 파일을 업로드할 수 있습니다.</p>
          {!selectedDepartment && (
            <p className="text-sm text-red-500 mb-3">* 파일 업로드를 위해 학과를 선택해주세요</p>
          )}
          <button
            onClick={() => fileInputRef.current.click()}
            className={`px-6 py-2 rounded font-semibold cursor-pointer ${selectedDepartment
              ? 'bg-indigo-700 text-white hover:bg-indigo-800'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            disabled={uploading || !selectedDepartment}
          >
            {uploading ? '업로드 중...' : '파일 선택'}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".txt,.pdf"
          />
        </div>

        {/* File List */}
        <div className="bg-white shadow rounded">
          <div className="flex px-5 py-3 border-b bg-gray-50 font-bold text-gray-700">
            <div className="flex-1">id</div>
            <div className="flex-1">파일명</div>
            <div className="flex-1">학과</div>
            <div className="flex-1">파일 크기</div>
            {/* <div className="flex-1">업로드 날짜</div> */}
            <div className="flex-1 text-center">작업</div>
          </div>
          {files.length === 0 ? (
            <div className="flex px-5 py-3 border-b last:border-b-0 items-center">
              <div className="flex-1 text-gray-600 text-center">업로드된 파일이 없습니다.</div>
            </div>
          ) : (
            files.map((file, idx) => (
              <div key={idx} className="flex px-5 py-3 border-b last:border-b-0 items-center">
                <div className="flex-1">{file.id}</div>
                <div className="flex-1 flex items-center gap-2">
                  <FileText className="text-indigo-600" size={18} />
                  <span>{file.file_name || file.name}</span>
                </div>
                <div className="flex-1 text-gray-600">
                  {file.subject === '물리치료학기초_해부생리학' || file.subject === '물리치료학과' ? '물리치료학과' :
                    file.subject === '작업치료학기초_해부생리학' || file.subject === '작업치료학과' ? '작업치료학과' : '-'}
                </div>
                <div className="flex-1 text-gray-600">
                  {formatFileSize(file.file_size)}
                </div>
                {/* <div className="flex-1 text-gray-600">{file.uploaded_at ? new Date(file.uploaded_at).toLocaleString() : '-'}</div> */}
                <div className="flex-1 text-center">

                  <a
                    href={`${process.env.NEXT_PUBLIC_API_URL}/files/reference/${file.file_name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 border border-blue-500 px-3 py-1 rounded text-xs hover:bg-blue-500 hover:text-white transition mr-2"
                  >
                    다운로드
                  </a>
                  <button
                    className="text-red-600 border border-red-500 px-3 py-1 rounded text-xs hover:bg-red-500 hover:text-white transition"
                    onClick={() => handleDelete(file.id)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );

  function formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    if (mb < 1024) return `${mb.toFixed(1)} MB`;
    const gb = mb / 1024;
    return `${gb.toFixed(1)} GB`;
  }
};

export default UploadData; 