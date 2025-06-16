import React, { useState } from 'react';

const Analysis = ({ userdata }) => {
    const [selectedPeriod, setSelectedPeriod] = useState('week');
    const [selectedStudent, setSelectedStudent] = useState(null);

    // 임시 학생 데이터
    const students = [
        {
            id: 1,
            name: "김학생",
            major: "물리치료학과",
            grade: 3,
            testscore: 85,
            studyTime: 32.5,
            studyTimeChange: 15,
            solvedProblems: 248,
            solvedProblemsChange: 8,
            accuracy: 76.5,
            accuracyChange: -2,
            achievement: 82,
            achievementChange: 7,
            subjects: [
                { subject: '중추신경계', score: 85, improvement: 5 },
                { subject: '말초신경계', score: 72, improvement: -2 },
                { subject: '자율신경계', score: 68, improvement: 3 },
            ],
            weakPoints: [
                {
                    topic: '말초신경계 - 척수신경',
                    problems: 15,
                    accuracy: 45,
                    recommendation: '기본 개념 복습 필요'
                },
                {
                    topic: '자율신경계 - 교감신경',
                    problems: 12,
                    accuracy: 52,
                    recommendation: '문제 풀이 연습 필요'
                },
            ],
            studyPattern: {
                timeDistribution: [20, 35, 60, 80, 45, 30],
                weeklyDistribution: [65, 75, 45, 80, 70, 55, 85]
            }
        },
        {
            id: 2,
            name: "이학생",
            major: "물리치료학과",
            grade: 3,
            testscore: 72,
            studyTime: 28.5,
            studyTimeChange: 10,
            solvedProblems: 215,
            solvedProblemsChange: 5,
            accuracy: 72.5,
            accuracyChange: 3,
            achievement: 75,
            achievementChange: 5,
            subjects: [
                { subject: '중추신경계', score: 75, improvement: 3 },
                { subject: '말초신경계', score: 68, improvement: 2 },
                { subject: '자율신경계', score: 73, improvement: 4 },
            ],
            weakPoints: [
                {
                    topic: '중추신경계 - 뇌신경',
                    problems: 18,
                    accuracy: 48,
                    recommendation: '심화 개념 학습 필요'
                },
                {
                    topic: '말초신경계 - 운동신경',
                    problems: 14,
                    accuracy: 55,
                    recommendation: '실전 문제 풀이 필요'
                },
            ],
            studyPattern: {
                timeDistribution: [30, 45, 50, 70, 55, 25],
                weeklyDistribution: [60, 70, 55, 75, 65, 50, 80]
            }
        },
        {
            id: 3,
            name: "박학생",
            major: "물리치료학과",
            grade: 3,
            testscore: 68,
            studyTime: 25.5,
            studyTimeChange: -5,
            solvedProblems: 180,
            solvedProblemsChange: -3,
            accuracy: 68.5,
            accuracyChange: -1,
            achievement: 70,
            achievementChange: -2,
            subjects: [
                { subject: '중추신경계', score: 65, improvement: -2 },
                { subject: '말초신경계', score: 70, improvement: 1 },
                { subject: '자율신경계', score: 69, improvement: -1 },
            ],
            weakPoints: [
                {
                    topic: '중추신경계 - 대뇌피질',
                    problems: 20,
                    accuracy: 42,
                    recommendation: '기초 개념부터 복습 필요'
                },
                {
                    topic: '자율신경계 - 부교감신경',
                    problems: 16,
                    accuracy: 50,
                    recommendation: '문제 유형 분석 필요'
                },
            ],
            studyPattern: {
                timeDistribution: [25, 30, 45, 65, 40, 20],
                weeklyDistribution: [55, 65, 50, 70, 60, 45, 75]
            }
        }
    ];

    return (
        <main className="max-w-6xl mx-auto px-5">
            <div className="p-6 space-y-6">
                {/* 학생 선택 섹션 */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">학생별 학습 현황 분석</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSelectedPeriod('week')}
                                className={`px-4 py-2 rounded ${selectedPeriod === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                            >
                                주간
                            </button>
                            <button
                                onClick={() => setSelectedPeriod('month')}
                                className={`px-4 py-2 rounded ${selectedPeriod === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                            >
                                월간
                            </button>
                            <button
                                onClick={() => setSelectedPeriod('total')}
                                className={`px-4 py-2 rounded ${selectedPeriod === 'total' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                            >
                                전체
                            </button>
                        </div>
                    </div>

                    {/* 학생 목록 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {students.map((student) => (
                            <div
                                key={student.id}
                                onClick={() => setSelectedStudent(student)}
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all
                                    ${selectedStudent?.id === student.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-blue-300'}`}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-lg">{student.name}</h3>
                                        <p className="text-sm text-gray-600">{student.major} {student.grade}학년</p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-sm font-bold
                                        ${student.testscore >= 80 ? 'bg-green-100 text-green-700' :
                                            student.testscore >= 50 ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'}`}>
                                        {student.testscore}점
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* <select
                            className="w-full p-3 border rounded-md mb-4"
                            onChange={(e) => {
                                const selectedId = e.target.value;
                                const selected = students.find((student) => student.id.toString() === selectedId);
                                setSelectedStudent(selected);
                            }}
                            value={selectedStudent?.id || ""}
                        >
                            <option value="" disabled>학생을 선택하세요</option>
                            {students.map((student) => (
                                <option key={student.id} value={student.id}>
                                    {student.name} ({student.major} {student.grade}학년) - {student.testscore}점
                                </option>
                            ))}
                        </select> */}

                    </div>
                </div>

                {selectedStudent && (
                    <>
                        {/* 주요 통계 */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-gray-500">총 학습 시간</h3>
                                <p className="text-2xl font-bold">{selectedStudent.studyTime} 시간</p>
                                <p className={`text-sm ${selectedStudent.studyTimeChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {selectedStudent.studyTimeChange >= 0 ? '▲' : '▼'} 전주 대비 {Math.abs(selectedStudent.studyTimeChange)}% {selectedStudent.studyTimeChange >= 0 ? '증가' : '감소'}
                                </p>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-gray-500">문제 풀이 수</h3>
                                <p className="text-2xl font-bold">{selectedStudent.solvedProblems} 문제</p>
                                <p className={`text-sm ${selectedStudent.solvedProblemsChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {selectedStudent.solvedProblemsChange >= 0 ? '▲' : '▼'} 전주 대비 {Math.abs(selectedStudent.solvedProblemsChange)}% {selectedStudent.solvedProblemsChange >= 0 ? '증가' : '감소'}
                                </p>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-gray-500">평균 정답률</h3>
                                <p className="text-2xl font-bold">{selectedStudent.accuracy}%</p>
                                <p className={`text-sm ${selectedStudent.accuracyChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {selectedStudent.accuracyChange >= 0 ? '▲' : '▼'} 전주 대비 {Math.abs(selectedStudent.accuracyChange)}% {selectedStudent.accuracyChange >= 0 ? '증가' : '감소'}
                                </p>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-gray-500">학습 달성률</h3>
                                <p className="text-2xl font-bold">{selectedStudent.achievement}%</p>
                                <p className={`text-sm ${selectedStudent.achievementChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {selectedStudent.achievementChange >= 0 ? '▲' : '▼'} 목표 대비 {Math.abs(selectedStudent.achievementChange)}% {selectedStudent.achievementChange >= 0 ? '초과' : '미달'}
                                </p>
                            </div>
                        </div>

                        {/* 과목별 성취도 */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-xl font-bold mb-4">과목별 성취도</h3>
                            <div className="space-y-4">
                                {[
                                    { subject: '중추신경계', score: 85, improvement: 5 },
                                    { subject: '말초신경계', score: 72, improvement: -2 },
                                    { subject: '자율신경계', score: 68, improvement: 3 },
                                ].map((item, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="font-medium">{item.subject}</span>
                                            <span className={item.improvement > 0 ? 'text-green-500' : 'text-red-500'}>
                                                {item.improvement > 0 ? '▲' : '▼'} {Math.abs(item.improvement)}%
                                            </span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full">
                                            <div
                                                className="h-full bg-blue-500 rounded-full"
                                                style={{ width: `${item.score}%` }}
                                            ></div>
                                        </div>
                                        <div className="text-sm text-gray-500 text-right">{item.score}%</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 취약 부분 분석 */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold">취약 부분 분석</h3>
                                <button className="text-blue-500 hover:text-blue-700">
                                    피드백 보내기
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    {
                                        topic: '말초신경계 - 척수신경',
                                        problems: 15,
                                        accuracy: 45,
                                        recommendation: '기본 개념 복습 필요'
                                    },
                                    {
                                        topic: '자율신경계 - 교감신경',
                                        problems: 12,
                                        accuracy: 52,
                                        recommendation: '문제 풀이 연습 필요'
                                    },
                                ].map((item, index) => (
                                    <div key={index} className="border rounded-lg p-4">
                                        <h4 className="font-bold text-red-500">{item.topic}</h4>
                                        <p className="text-sm text-gray-600 mt-2">
                                            풀이 문제 수: {item.problems}문제<br />
                                            정답률: {item.accuracy}%<br />
                                            추천: {item.recommendation}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 학습 패턴 분석 */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-xl font-bold mb-4">학습 패턴 분석</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-medium mb-2">시간대별 학습 분포</h4>
                                    <div className="h-40 flex items-end justify-between">
                                        {[20, 35, 60, 80, 45, 30].map((height, idx) => (
                                            <div key={idx} className="w-1/6 px-1">
                                                <div
                                                    className="bg-blue-400 rounded-t"
                                                    style={{ height: `${height}%` }}
                                                ></div>
                                                <p className="text-xs text-center mt-1">{`${idx * 4}시`}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-2">요일별 학습량</h4>
                                    <div className="space-y-2">
                                        {['월', '화', '수', '목', '금', '토', '일'].map((day, idx) => (
                                            <div key={idx} className="flex items-center">
                                                <span className="w-8">{day}</span>
                                                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-green-400"
                                                        style={{ width: `${Math.random() * 60 + 40}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
};

export default Analysis; 