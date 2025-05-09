"use client";

import React, { useState } from 'react';
import { Upload, FileText, Trash2 } from 'lucide-react';

const UploadPage = () => {
    // const [activeTab, setActiveTab] = useState<'문제' | '해설'>('문제');
    const [activeTab, setActiveTab] = useState("문제");


    const files = [
        {
            name: '해부학_문제_01.docx',
            type: '작업치료학과',
            size: '2.4MB',
            status: '완료',
        },
        {
            name: '해부학_시험문제_1학기.xlsx',
            type: '작업치료학과',
            size: '1.8MB',
            status: '완료',
        },
        {
            name: '2학기_중간고사_문제_데이터.csv',
            type: '물리치료학과',
            size: '756KB',
            status: '처리중',
        },
    ];

    return (
        <div className="bg-gray-100 min-h-screen text-sm text-gray-800">
            {/* Breadcrumb */}
            <div className="text-gray-500 px-5 py-3 flex items-center space-x-2 text-sm">
                <a href="#">홈</a>
                <span>{'>'}</span>
                <a href="#">지식베이스 관리</a>
                <span>{'>'}</span>
                <span>{activeTab} 업로드</span>
            </div>

            {/* Content */}
            <main className="container mx-auto px-5 py-8">
                <h2 className="text-2xl font-bold text-gray-700 mb-6">문제 RAG 지식베이스 업로드</h2>

                {/* Tabs */}
                <div className="flex border-b border-gray-300 mb-6">
                    <div
                        className={`px-5 py-3 cursor-pointer font-bold ${activeTab === '문제'
                            ? 'text-indigo-700 border-b-2 border-indigo-700'
                            : 'text-gray-500'
                            }`}
                        onClick={() => setActiveTab('문제')}
                    >
                        문제 업로드
                    </div>
                    {/* <div
                        className={`px-5 py-3 cursor-pointer font-bold ${activeTab === '해설'
                            ? 'text-indigo-700 border-b-2 border-indigo-700'
                            : 'text-gray-500'
                            }`}
                        onClick={() => setActiveTab('해설')}
                    >
                        해설 업로드
                    </div> */}
                </div>

                {activeTab === '문제' ? (
                    <>
                        {/* Upload Box */}
                        <div className="border border-dashed border-gray-300 bg-white rounded-lg p-10 text-center mb-8">
                            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center border-2 border-gray-400 text-gray-400 rounded">
                                <Upload size={24} />
                            </div>
                            <p className="text-lg text-gray-700 mb-2">문제 파일을 여기에 끌어다 놓거나 선택하세요</p>
                            <p className="text-sm text-gray-500 mb-5">Excel(.xlsx), CSV(.csv) 또는 Word(.docx) 파일을 업로드할 수 있습니다.</p>
                            <button className="bg-indigo-700 text-white px-6 py-2 rounded font-semibold">파일 선택</button>
                            <p className="text-sm text-gray-400 mt-4">권장 형식: 번호, 문제, 선택지, 정답, 해설, 난이도, 유형</p>
                        </div>

                        {/* File List */}
                        <div className="bg-white shadow rounded">
                            <div className="flex px-5 py-3 border-b bg-gray-50 font-bold text-gray-700">
                                <div className="flex-1">파일명</div>
                                <div className="flex-1">관련학과</div>
                                <div className="flex-1">크기</div>
                                <div className="flex-1">상태</div>
                                <div className="w-50 text-center">작업</div>
                            </div>
                            {files.map((file, index) => (
                                <div key={index} className="flex px-5 py-3 border-b last:border-b-0 items-center">
                                    <div className="flex-1 flex items-center gap-2">
                                        <FileText className="text-indigo-600" size={18} />
                                        {file.name}
                                    </div>
                                    <div className="flex-1 text-gray-600">{file.type}</div>
                                    <div className="flex-1 text-gray-600">{file.size}</div>
                                    <div className="flex-1">
                                        <span
                                            className={`inline-block px-2 py-1 rounded text-xs font-bold ${file.status === '완료'
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-yellow-100 text-yellow-600'
                                                }`}
                                        >
                                            {file.status}
                                        </span>
                                    </div>
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
                    </>
                ) : (
                    // 해설 업로드 폼
                    <div className="border border-dashed border-gray-300 bg-white rounded-lg p-10 text-center">
                        <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center border-2 border-gray-400 text-gray-400 rounded">
                            <Upload size={24} />
                        </div>
                        <p className="text-lg text-gray-700 mb-2">해설 파일을 여기에 끌어다 놓거나 선택하세요</p>
                        <p className="text-sm text-gray-500 mb-5">Excel(.xlsx), CSV(.csv) 또는 Word(.docx) 형식의 해설 파일을 업로드할 수 있습니다.</p>
                        <button className="bg-indigo-700 text-white px-6 py-2 rounded font-semibold">해설 파일 선택</button>
                        <p className="text-sm text-gray-400 mt-4">권장 형식: 번호, 해설 내용, 관련 문제 번호</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default UploadPage;
