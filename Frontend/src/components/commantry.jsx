'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const Commantry = () => {
    const [problems, setProblems] = useState([]);
    const [filteredProblems, setFilteredProblems] = useState([]);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const getCommantry = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getCommentary`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            if (response.ok) {
                setProblems(data);
                setFilteredProblems(data);
            } else {
                console.error("지식베이스 오류");
            }
        };
        getCommantry();
    }, []);

    const handleSearch = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setSearchTerm(searchValue);

        const filtered = problems.filter(problem =>
            problem.subject.toLowerCase().includes(searchValue) ||
            problem.problem.toLowerCase().includes(searchValue)
        );
        setFilteredProblems(filtered);
    };

    const handleEdit = (problem) => {
        setSelectedProblem(problem);
        setIsEditDialogOpen(true);
    };

    const handleSave = async (updatedProblem) => {
        console.log(updatedProblem);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/saveCommentary`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: updatedProblem.id, answer: updatedProblem.answer, explanation: updatedProblem.explanation })
            });

            if (res.ok) {
                const updatedProblems = problems.map(p =>
                    p.id === updatedProblem.id ? updatedProblem : p
                );
                setProblems(updatedProblems);
                setFilteredProblems(updatedProblems.filter(problem =>
                    problem.subject.toLowerCase().includes(searchTerm) ||
                    problem.problem.toLowerCase().includes(searchTerm)
                ));
                setIsEditDialogOpen(false);

            } else {
                alert("해설 저장 중 오류가 발생했습니다.");
            }


        } catch (error) {
            console.error('문제 업데이트 중 오류 발생:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className=" mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">문제 관리</h1>
                        <div className="relative w-96">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="과목 또는 문제 검색..."
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">과목</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">주제</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">난이도</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">정답</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[600px]">문제</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[700px]">해설</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredProblems.map((problem) => (
                                    <tr key={problem.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{problem.subject}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900  whitespace-nowrap">{problem.topic}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{problem.difficulty}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{problem.answer}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900" dangerouslySetInnerHTML={{ __html: problem.problem.replace(/\n/g, '<br />') }} />
                                        <td className="px-6 py-4 text-sm text-gray-900">{problem.explanation || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                                            <button
                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                onClick={() => handleEdit(problem)}
                                            >
                                                수정
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {isEditDialogOpen && selectedProblem && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">문제 수정</h2>
                        </div>
                        <div className="px-6 py-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">정답</label>
                                <input
                                    type="number"
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={selectedProblem.answer}
                                    onChange={(e) => setSelectedProblem({
                                        ...selectedProblem,
                                        answer: parseInt(e.target.value)
                                    })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">해설</label>
                                <textarea
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={selectedProblem.explanation || ''}
                                    onChange={(e) => setSelectedProblem({
                                        ...selectedProblem,
                                        explanation: e.target.value
                                    })}
                                    placeholder="해설을 작성해주세요."
                                    rows={4}
                                />
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
                            <button
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                onClick={() => setIsEditDialogOpen(false)}
                            >
                                취소
                            </button>
                            <button
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                onClick={() => handleSave(selectedProblem)}
                            >
                                저장
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Commantry; 