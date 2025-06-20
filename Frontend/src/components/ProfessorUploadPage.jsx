"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Upload, FileText } from 'lucide-react';

const UploadPage = ({ userdata }) => {
    const fileInputRef = useRef(null);
    const AnswerfileInputRef = useRef(null);
    const [dragActive, setDragActive] = useState(false);

    const [uploadStatus, setuploadStatus] = useState(true);
    const [files, setFiles] = useState([]);
    const [answerID, setanswerID] = useState();

    useEffect(() => {
        const getQuestion = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getQuestionData`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            if (response.ok) {
                console.log(data);
                setFiles(data);
            } else {
                console.error("지식베이스 오류");
            }
        };
        if (uploadStatus) {
            getQuestion();
            setuploadStatus(false)
        }
    }, []);

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };
    const handleAnswerUpload = (fileID) => {
        setanswerID(fileID);
        AnswerfileInputRef.current?.click();
    }

    const handleUploadAnswer = async (event) => {
        const selectedFile = event.target.files[0];
        if (!selectedFile) return;
        const formData = new FormData();
        // alert(answerID);
        formData.append("file", selectedFile);
        formData.append("userData", userdata);
        formData.append("ExamID", answerID);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploadAnswer`, {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                console.log(data);
                setFiles(data);
                alert("파일이 성공적으로 업로드되었습니다.");
                setanswerID();

            } else {
                alert("업로드 실패: 서버 오류");
            }
        } catch (error) {
            console.error("업로드 오류:", error);
            alert("업로드 중 오류가 발생했습니다.");
        }

    }


    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];
        if (!selectedFile) return;
        // console.log(selectedFile);
        // console.log(userdata);
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("userData", JSON.stringify(userdata));

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploadquestion`, {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                console.log(data);
                alert("파일이 성공적으로 업로드되었습니다.");
                setFiles(prevFiles => [...prevFiles, data]); // 단일 객체일 때
            } else {
                alert("업로드 실패: 서버 오류");
            }
        } catch (error) {
            console.error("업로드 오류:", error);
            alert("업로드 중 오류가 발생했습니다.");
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

    const handleDelete = async (id) => {
        if (!confirm("정말 삭제하시겠습니까?")) {
            return;
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/DeleteExamData`, {
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
                <h2 className="text-2xl font-bold text-gray-700 mb-6">기출문제 업로드</h2>

                {/* Tabs */}
                {/* <div className="flex border-b border-gray-300 mb-6">
                    <div
                        className='px-5 py-3 cursor-pointer font-bold text-indigo-700 border-b-2 border-indigo-700'
                    >
                        문제 업로드
                    </div>
                </div> */}



                {/* Upload Box */}
                <div
                    className={`border border-dashed border-gray-300 bg-white rounded-lg p-10 text-center mb-8 transition ${dragActive ? 'border-indigo-500 bg-indigo-50' : ''
                        }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
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
                        <div className="flex-1">ID</div>
                        <div className="flex-[2]">파일명</div>
                        <div className="flex-1">관련학과</div>
                        <div className="flex-1">교수</div>
                        {/* <div className="flex-1">크기</div> */}
                        <div className="w-50 text-center">작업</div>
                    </div>
                    {files.map((file, index) => (
                        <div key={index} className="flex px-5 py-3 border-b last:border-b-0 items-center">
                            <div className="flex-1 text-gray-600">{file.id}</div>
                            <div className="flex-[2] flex items-center gap-2">
                                <FileText className="text-indigo-600" size={18} />
                                <a target="_blank" href={`${process.env.NEXT_PUBLIC_API_URL}/files/test/${file.file_name}`}>{file.file_name}</a>
                            </div>
                            <div className="flex-1 text-gray-600">{file.department}</div>
                            <div className="flex-1 text-gray-600">{file.uploader}</div>
                            {/* <div className="flex-1 text-gray-600">{file.size}</div> */}

                            <div className="w-50 flex justify-center gap-2">
                                {!file.status ? (
                                    <button
                                        className="text-blue-600 border border-blue-500 px-3 py-1 rounded text-xs hover:bg-blue-500 hover:text-white transition"
                                        onClick={() => handleAnswerUpload(file.id)}
                                    >
                                        해설 업로드
                                    </button>

                                ) : (
                                    <a
                                        target="_blank"
                                        className="text-green-600 border border-green-500 px-3 py-1 rounded text-xs hover:bg-green-500 hover:text-white transition"
                                        href={`${process.env.NEXT_PUBLIC_API_URL}/files/label/${file.file_location}`}
                                    >
                                        해설 다운로드
                                    </a>
                                )}

                                <button
                                    className="text-red-600 border border-red-500 px-3 py-1 rounded text-xs hover:bg-red-500 hover:text-white transition cursor-pointer"
                                    onClick={() => handleDelete(file.id)}
                                >
                                    삭제
                                </button>
                            </div>

                        </div>
                    ))}

                    <input
                        type="file"
                        ref={AnswerfileInputRef}
                        onChange={handleUploadAnswer}
                        className="hidden"
                        accept=".docx,.xlsx,.csv,.pdf"
                    />
                </div>
            </main>
        </div>
    );
};

export default UploadPage;
