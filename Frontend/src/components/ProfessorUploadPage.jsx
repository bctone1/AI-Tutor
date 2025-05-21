"use client";

import React, { useRef, useState } from 'react';
import { Upload, FileText } from 'lucide-react';

const UploadPage = ({userdata}) => {
    const fileInputRef = useRef(null);
    const [files, setFiles] = useState([
        {
            name: '해부학_문제_01.docx',
            type: '작업치료학과',
            size: '2.4MB',
            uploader: '임00',
        },
        {
            name: '해부학_시험문제_1학기.xlsx',
            type: '작업치료학과',
            size: '1.8MB',
            uploader: '김00',
        },
        {
            name: '2학기_중간고사_문제_데이터.csv',
            type: '물리치료학과',
            size: '756KB',
            uploader: '박00',
        },
    ]);

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("userData", userdata);

        try {
            const res = await fetch("/uploadquestion", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                alert("파일이 성공적으로 업로드되었습니다.");
            } else {
                alert("업로드 실패: 서버 오류");
            }
        } catch (error) {
            console.error("업로드 오류:", error);
            alert("업로드 중 오류가 발생했습니다.");
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
                <span>문제 업로드</span>
            </div>

            {/* Content */}
            <main className="container mx-auto px-5 py-8">
                <h2 className="text-2xl font-bold text-gray-700 mb-6">문제 RAG 지식베이스 업로드</h2>

                {/* Tabs */}
                <div className="flex border-b border-gray-300 mb-6">
                    <div
                        className='px-5 py-3 cursor-pointer font-bold text-indigo-700 border-b-2 border-indigo-700'
                    >
                        문제 업로드
                    </div>
                </div>



                {/* Upload Box */}
                <div className="border border-dashed border-gray-300 bg-white rounded-lg p-10 text-center mb-8">
                    <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center border-2 border-gray-400 text-gray-400 rounded">
                        <Upload size={24} />
                    </div>
                    <p className="text-lg text-gray-700 mb-2">문제 파일을 여기에 끌어다 놓거나 선택하세요</p>
                    <p className="text-sm text-gray-500 mb-5">Excel(.xlsx), CSV(.csv) 또는 Word(.docx) 파일을 업로드할 수 있습니다.</p>
                    <button
                        onClick={handleFileClick}
                        className="bg-indigo-700 text-white px-6 py-2 rounded font-semibold cursor-pointer"
                    >
                        파일 선택
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".docx,.xlsx,.csv,.pdf"
                    />
                    <p className="text-sm text-gray-400 mt-4">권장 형식: 번호, 문제, 선택지, 정답, 해설, 난이도, 유형</p>
                </div>

                {/* File List */}
                <div className="bg-white shadow rounded">
                    <div className="flex px-5 py-3 border-b bg-gray-50 font-bold text-gray-700">
                        <div className="flex-1">파일명</div>
                        <div className="flex-1">관련학과</div>
                        <div className="flex-1">교수</div>
                        <div className="flex-1">크기</div>
                        <div className="w-50 text-center">작업</div>
                    </div>
                    {files.map((file, index) => (
                        <div key={index} className="flex px-5 py-3 border-b last:border-b-0 items-center">
                            <div className="flex-1 flex items-center gap-2">
                                <FileText className="text-indigo-600" size={18} />
                                {file.name}
                            </div>
                            <div className="flex-1 text-gray-600">{file.type}</div>
                            <div className="flex-1 text-gray-600">{file.uploader}</div>
                            <div className="flex-1 text-gray-600">{file.size}</div>
                            
                            <div className="w-50 flex justify-center gap-2">
                                <button className="text-red-600 border border-red-500 px-3 py-1 rounded text-xs hover:bg-red-500 hover:text-white transition">
                                    삭제
                                </button>
                                <button className="text-blue-600 border border-blue-500 px-3 py-1 rounded text-xs hover:bg-blue-500 hover:text-white transition">
                                    해설 업로드
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default UploadPage;
