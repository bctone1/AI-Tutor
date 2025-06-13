import React, { useRef, useState, useEffect } from 'react';
import { Upload, FileText } from 'lucide-react';

const UploadData = ({ userdata }) => {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getReferenceData`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userData: userdata })
        });
        const data = await response.json();
        if (response.ok) setFiles(data);
      } catch (err) {
        // Handle error
      }
    };
    fetchFiles();
  }, [userdata]);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('userData', JSON.stringify(userdata));
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploadReferenceData`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setFiles(prev => [...prev, data]);
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
          <p className="text-sm text-gray-500 mb-5">Excel(.xlsx), CSV(.csv) 또는 Word(.docx) 파일을 업로드할 수 있습니다.</p>
          <button
            onClick={() => fileInputRef.current.click()}
            className="bg-indigo-700 text-white px-6 py-2 rounded font-semibold cursor-pointer"
            disabled={uploading}
          >
            {uploading ? '업로드 중...' : '파일 선택'}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".docx,.xlsx,.csv,.pdf"
          />
        </div>

        {/* File List */}
        <div className="bg-white shadow rounded">
          <div className="flex px-5 py-3 border-b bg-gray-50 font-bold text-gray-700">
            <div className="flex-1">파일명</div>
            <div className="flex-1">업로더</div>
            <div className="flex-1">업로드 날짜</div>
            <div className="flex-1 text-center">작업</div>
          </div>
          {files.length === 0 ? (
            <div className="flex px-5 py-3 border-b last:border-b-0 items-center">
              <div className="flex-1 text-gray-600 text-center">업로드된 파일이 없습니다.</div>
            </div>
          ) : (
            files.map((file, idx) => (
              <div key={idx} className="flex px-5 py-3 border-b last:border-b-0 items-center">
                <div className="flex-1 flex items-center gap-2">
                  <FileText className="text-indigo-600" size={18} />
                  <span>{file.file_name || file.name}</span>
                </div>
                <div className="flex-1 text-gray-600">{file.uploader || (file.user && file.user.name)}</div>
                <div className="flex-1 text-gray-600">{file.uploaded_at ? new Date(file.uploaded_at).toLocaleString() : '-'}</div>
                <div className="flex-1 text-center">
                  <a
                    href={`${process.env.NEXT_PUBLIC_API_URL}/files/reference/${file.file_name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    다운로드
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default UploadData; 