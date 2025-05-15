'use client';

import React, { useState, useEffect } from 'react';

const Active = ({ userdata }) => {
    const [selectedSubject, setSelectedSubject] = useState("");
    const [chatLog, setChatLog] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFetchQuestion = () => {
        if (!selectedSubject) {
            alert("과목을 선택해주세요.");
            return;
        }

        fetchInitialQuestion();
    };

    useEffect(() => {
        // 페이지 진입 시 안내 메시지를 먼저 표시
        setChatLog([
            {
                sender: 'AI 튜터',
                content: (
                    <div className="text-sm text-gray-800">
                        안녕하세요! 저는 여러분의 AI 튜터입니다. 😊<br /><br />
                        지금부터 기출문제를 함께 풀어보며 학습할 거예요.
                        각 문항에 대해 정답을 선택하면, 해설과 함께 피드백을 드릴게요.<br /><br />
                        궁금한 내용이 있다면 언제든 채팅창에 입력해 주세요. 또한 오른쪽 하단의 <strong>힌트</strong> 버튼을 통해 도움을 받을 수 있습니다.<br /><br />
                        준비되셨다면, 오른쪽 하단의 <strong>기출문제</strong> 버튼을 눌러 첫 문제를 시작해볼까요?
                    </div>
                )
            }
        ]);
    }, []);

    const fetchInitialQuestion = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getQuestion`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userdata: userdata, selectedSubject: selectedSubject })
            });

            const data = await res.json();
            if (res.ok) {
                const { question, choices, id } = data;

                setChatLog(prev => [
                    ...prev,
                    {
                        sender: 'AI 튜터',
                        content: (
                            <>
                                <div className="mb-2">{question}</div>
                                {choices.map((choice, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSubmitAnswer(idx + 1,id)}
                                        className="block w-full text-left bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded mb-1"
                                    >
                                        {idx + 1}. {choice}
                                    </button>
                                ))}
                            </>
                        )
                    }
                ]);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmitAnswer = async (choiceNumber, id) => {
        // let isCorrect = false;
        // if (choiceNumber === answer) {
        //     isCorrect = true;
        // }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getExplanation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answer: choiceNumber, question_id : id })
            });

            const data = await res.json();

            setChatLog(prev => [
                ...prev,
                { sender: '나', content: `답: ${choiceNumber}번` },
                {
                    sender: 'AI 튜터',
                    content: (
                        <div>
                            {data.isCorrect ? "정답입니다! 🎉" : "오답입니다. ❌"}
                            <br />
                            <div className="mt-2 text-gray-700">{data.explanation}</div>
                        </div>
                    )
                }
            ]);
        } catch (e) {
            console.error(e);
        }
    };

    const handleHint = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getHint`);
            const data = await res.json();

            setChatLog(prev => [
                ...prev,
                { sender: 'AI 튜터', content: `힌트: ${data.hint}` }
            ]);
        } catch (e) {
            console.error(e);
        }
    };

    const handleLLMChat = async () => {
        if (!selectedSubject) {
            setChatLog((prev) => [
                ...prev,
                {
                    sender: "AI 튜터",
                    content: "과목을 선택해주세요. 학습할 과목이 정해져야 질문에 답변드릴 수 있어요.",
                },
            ]);
            return;
        }
        if (!input.trim()) return;
        const userMessage = input;
        setChatLog(prev => [...prev, { sender: '나', content: userMessage }]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chatAgent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage, userdata: userdata, selectedSubject: selectedSubject })
            });
            const data = await res.json();
            if (data.method) {
                const { question, choices, id } = data;
                setChatLog(prev => [
                    ...prev,
                    {
                        sender: 'AI 튜터',
                        content: (
                            <>
                                <div className="mb-2">{question}</div>
                                {choices.map((choice, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSubmitAnswer(idx + 1,id)}
                                        className="block w-full text-left bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded mb-1"
                                    >
                                        {idx + 1}. {choice}
                                    </button>
                                ))}
                            </>
                        )
                    }
                ]);
            } else {
                setChatLog(prev => [...prev, { sender: 'AI 튜터', content: data.message }]);
            }

        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="max-w-6xl mx-auto mt-6 px-5 relative">
            <div className="flex gap-6">
                {/* 사이드바: 과목 선택 */}
                <aside className="w-64 bg-white rounded-md shadow-md p-6 border border-gray-200 h-fit sticky top-6 flex flex-col justify-between min-h-[300px]">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">과목 선택</h2>
                        <select
                            id="subjectSelect"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                        >
                            <option value="">과목을 선택하세요</option>
                            <option value="중추신경계">중추신경계</option>
                            <option value="말초신경계">말초신경계</option>
                            <option value="자율신경계">자율신경계</option>
                        </select>

                        <p className="text-sm text-gray-600 mt-4">
                            {userdata.user.major} | {userdata.user.grade}학년
                        </p>
                    </div>

                    {/* 사이드바 하단 버튼 */}
                    <div className="mt-6 flex flex-col space-y-2">
                        <button
                            onClick={handleHint}
                            className="px-3 py-2 text-sm rounded-md bg-indigo-100 text-indigo-800 hover:bg-indigo-200 shadow text-center"
                        >
                            힌트
                        </button>
                        <button
                            onClick={handleFetchQuestion}
                            className="px-3 py-2 text-sm rounded-md bg-indigo-100 text-indigo-800 hover:bg-indigo-200 shadow text-center"
                        >
                            기출문제
                        </button>
                    </div>
                </aside>

                {/* 본문 영역: 채팅 UI 또는 문제 풀이 영역 */}
                <section className="flex-1 bg-white rounded-md shadow-md p-6 border border-gray-200">
                    <div className="flex flex-col gap-5 h-[70vh] overflow-y-auto">
                        {chatLog.map((chat, idx) => (
                            <div key={idx} className={`flex flex-col max-w-[80%] ${chat.sender === '나' ? 'self-end items-end' : ''}`}>
                                <div className={`${chat.sender === '나' ? 'bg-teal-100 rounded-tr-sm rounded-tl-xl rounded-br-xl' : 'bg-indigo-100 rounded-tl-sm rounded-tr-xl rounded-bl-xl'} p-4 shadow`}>
                                    <div className={`font-semibold ${chat.sender === '나' ? 'text-teal-600' : 'text-indigo-600'} mb-1`}>
                                        {chat.sender}
                                    </div>
                                    <div className="text-sm text-gray-800">{chat.content}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 입력창 */}
                    <div className="flex mt-6 pt-5 border-t">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleLLMChat()}
                            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                            placeholder="메세지를 입력하세요..."
                        />
                    </div>
                </section>
            </div>


        </main>
    );
};

export default Active;
