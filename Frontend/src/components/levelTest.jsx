"use client";

import React, { useState, useEffect, useRef } from 'react';

const LevelTest = ({ setView }) => {
    const [testQuestions, setTestQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answers, setAnswers] = useState({});

    const [remainingTime, setRemainingTime] = useState(20); // 30분 = 1800초
    const fiveMinuteWarnedRef = useRef(false); // ref를 사용하여 상태 유지
    const submittedRef = useRef(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setRemainingTime((prev) => {
                if (prev <= 1 && !submittedRef.current) {
                    submittedRef.current = true; // 중복 방지
                    clearInterval(timer);
                    alert("시간이 종료되었습니다. 답안을 제출합니다.");
                    console.log("모든 답변:", answers);
                    setTimeout(() => {
                        setView('dashboard'); // ✅ React가 렌더링을 마친 후 실행됨
                    }, 0);
                    return 0;
                }

                if (prev === 300 && !fiveMinuteWarnedRef.current) {
                    alert("5분 남았습니다.");
                    fiveMinuteWarnedRef.current = true;
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [answers]);

    const formatTime = (seconds) => {
        const min = String(Math.floor(seconds / 60)).padStart(2, '0');
        const sec = String(seconds % 60).padStart(2, '0');
        return `${min}:${sec}`;
    };

    useEffect(() => {
        // 현재 인덱스의 답변 있으면 불러오기
        setSelectedAnswer(answers[currentQuestionIndex] ?? null);
    }, [currentQuestionIndex]);

    useEffect(() => {
        const getQuestion = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getTestQuestion`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            if (response.ok) {
                setTestQuestions(data);
                console.log(data);
            } else {
                console.error("공급자 오류발생");
            }
        };
        getQuestion();
    }, []);

    const handleNext = () => {
        if (selectedAnswer === null) {
            alert("답변을 선택해주세요.");
            return;
        }

        setAnswers((prev) => ({
            ...prev,
            [currentQuestionIndex]: selectedAnswer,
        }));

        if (currentQuestionIndex < testQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // 마지막 문제일 경우 제출 처리 등 추가 가능
            console.log("모든 답변:", answers);
            setTimeout(() => {
                setView('dashboard'); // ✅ React가 렌더링을 마친 후 실행됨
            }, 0);
        }
    };

    const handlePrev = () => {
        setAnswers((prev) => ({
            ...prev,
            [currentQuestionIndex]: selectedAnswer,
        }));

        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const currentQuestion = testQuestions[currentQuestionIndex];

    const parseQuestion = (rawText) => {
        try {
            const parsed = JSON.parse(rawText);
            const questionText = parsed.question;
            const options = parsed.choices;
            return { questionText, options };
        } catch (e) {
            console.error("질문 파싱 오류:", e);
            return { questionText: "질문 형식 오류", options: [] };
        }
    };

    return (
        <main className="max-w-5xl mx-auto mt-6 px-5">

            {/* 테스트 제목 */}
            <div className="bg-white rounded shadow p-5 mb-5">
                <h1 className="text-2xl font-bold text-gray-800">진단 테스트</h1>
            </div>

            {/* 진행 상황 및 타이머 */}
            <div className="flex shadow mb-5">
                <div className="flex-1 h-12 bg-blue-100 flex justify-center items-center text-gray-700 text-base">
                    {currentQuestionIndex + 1} / {testQuestions.length} 문항
                </div>
                <div className="w-52 h-12 bg-indigo-100 flex justify-center items-center text-indigo-700 text-base">
                    남은 시간: {formatTime(remainingTime)}
                </div>
            </div>

            {/* 문제 영역 */}
            {currentQuestion && (
                <>
                    {(() => {
                        const { questionText, options } = parseQuestion(currentQuestion.question);

                        return (
                            <>
                                {/* 유형/과목 정보 */}
                                <div className="bg-purple-100 text-purple-700 p-4 rounded mb-5 text-base">
                                    현재 과목: {currentQuestion.subject} / 전공: {currentQuestion.major}
                                </div>

                                <div className="bg-white rounded shadow p-5 mb-5">
                                    <div className="text-lg font-bold mb-2">문항 {currentQuestionIndex + 1}.</div>
                                    <p className="text-base leading-relaxed mb-4">{questionText}</p>
                                    {/* <div className="w-full h-44 border border-gray-300 flex justify-center items-center text-gray-400 mb-5">
                                        [이미지 또는 해부도 등]
                                    </div> */}
                                </div>

                                {/* 보기 영역 */}
                                <div className="bg-white rounded shadow p-5 mb-5 relative">

                                    {options.map((option, index) => (
                                        <div className="flex items-start mb-4" key={index}>
                                            <input
                                                type="radio"
                                                id={`option${index}`}
                                                name="answer"
                                                className="mt-1 mr-2"
                                                checked={selectedAnswer === index}
                                                onChange={() => setSelectedAnswer(index)}
                                            />
                                            <label htmlFor={`option${index}`} className="text-base leading-relaxed">
                                                {option}
                                            </label>
                                        </div>
                                    ))}


                                    <div className="absolute top-5 right-5 bg-green-100 text-green-600 py-1 px-3 rounded-full text-sm">
                                        난이도: {currentQuestion.level}
                                    </div>
                                </div>
                            </>
                        );
                    })()}
                </>
            )}

            {/* 네비게이션 버튼 */}
            <div className="flex justify-between">
                <button onClick={handlePrev} className="bg-gray-300 text-gray-800 font-bold px-6 py-3 rounded">
                    이전
                </button>
                {/* <button className="text-gray-600 px-6 py-3">일시정지</button> */}
                <button onClick={handleNext} className="bg-indigo-600 text-white font-bold px-6 py-3 rounded">
                    다음
                </button>
            </div>

        </main>
    );
};

export default LevelTest;