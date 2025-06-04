import React, { useState, useMemo, useEffect } from 'react';

const dashboard = ({ userdata, setView }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [caseProgress, setCaseProgress] = useState(null);

    useEffect(() => {
        const fetchCaseProgress = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getUserCaseProgress`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: userdata.user.id
                    })
                });

                if (!response.ok) {
                    throw new Error('유형별 학습 현황을 가져오는데 실패했습니다.');
                }

                const data = await response.json();
                if (data.success) {
                    console.log(data);
                    setCaseProgress(data.progress);
                }
            } catch (error) {
                console.error('유형별 학습 현황 조회 오류:', error);
            }
        };


        const fetchDailyRecord = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getDailyRecord`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: 39
                    })
                });

                if (!response.ok) {
                    throw new Error('일일 학습 기록을 가져오는데 실패했습니다.');
                }

                const data = await response.json();
                if (data.success) {
                    console.log("일일 학습 기록");
                    console.log(data);
                }
            } catch (error) {
                console.error('일일 학습 기록 조회 오류:', error);
            }
        };

        if (userdata?.user?.id) {
            fetchDailyRecord();
            fetchCaseProgress();
        }
    }, [userdata?.user?.id]);

    // 임시 예시 데이터 생성
    const sampleData = useMemo(() => {
        const data = {};

        // 2025년 6월 1일, 2일, 3일에 대해 고정된 데이터 설정
        data['2025-06-01'] = 1;  // 1문제
        data['2025-06-02'] = 2;  // 2문제
        data['2025-06-03'] = 3;  // 3문제
        data['2025-05-04'] = 18;  // 4문제

        return data;
    }, [currentDate]);

    const calendarDays = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // 해당 월의 첫 날
        const firstDay = new Date(year, month, 1);
        // 해당 월의 마지막 날
        const lastDay = new Date(year, month + 1, 0);

        // 달력에 표시할 날짜들 계산
        const days = [];

        // 첫 주의 이전 달 날짜들
        for (let i = firstDay.getDay(); i > 0; i--) {
            days.push(new Date(year, month, 1 - i));
        }

        // 현재 달의 날짜들
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i));
        }

        // 마지막 주의 다음 달 날짜들
        const remainingDays = 42 - days.length; // 6주 x 7일 = 42
        for (let i = 1; i <= remainingDays; i++) {
            days.push(new Date(year, month + 1, i));
        }

        return days;
    }, [currentDate]);

    return (
        <main className="max-w-6xl mx-auto px-5">
            <div className="p-6 space-y-6">
                {/* 사용자 정보 및 카운트다운 */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/3 bg-white rounded shadow p-6">
                        <h2 className="text-lg font-bold">{userdata.user.name}님, 안녕하세요!</h2>
                        <p className="text-sm text-gray-600">
                            {userdata.user.major
                                ? `${userdata.user.major} ${userdata.user.grade}학년`
                                : "프로필을 완성해주세요"
                            }
                        </p>
                    </div>
                    <div className="w-full md:w-2/3 bg-white rounded shadow p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h3 className="text-base font-bold">
                                {userdata.user.grade
                                    ? `종합 레벨: ${userdata.user.testscore >= 80
                                        ? '상'
                                        : userdata.user.testscore >= 50
                                            ? '중'
                                            : '하'
                                    }`
                                    : "프로필을 완성해주세요"
                                }</h3>
                            {/* <p className="text-sm text-gray-600">오늘의 학습: 3/5 완료 | 주간 목표: 65% 달성</p> */}
                        </div>
                        <button className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold cursor-pointer" onClick={() => setView('active')}>
                            오늘의 학습 계속하기
                        </button>
                    </div>
                </div>

                {/* 학습 현황 및 추천 */}
                <div className="flex flex-col md:flex-row gap-4">


                    <div className="w-full md:w-2/3 bg-white rounded shadow">
                        <div className="border-b px-6 py-4 font-bold text-lg">유형별 학습 현황</div>
                        <div className="p-6 space-y-4">
                            {caseProgress && Object.entries(caseProgress).map(([case_name, data]) => (
                                <div key={case_name}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span>{case_name}</span>
                                        <span>{data.level}</span>
                                    </div>
                                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`${data.level === '상' ? 'bg-green-500' : data.level === '중' ? 'bg-yellow-500' : 'bg-red-500'} h-full rounded-full`}
                                            style={{ width: `${data.accuracy * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                            <div className="text-xs text-gray-400 flex justify-between mt-2">
                                <span>0%</span><span>50%</span><span>100%</span>
                            </div>
                        </div>
                    </div>


                    <div className="w-full md:w-1/3 bg-white rounded shadow">
                        <div className="border-b px-6 py-4 font-bold text-lg">집중 학습 추천</div>
                        <div className="p-6 space-y-2 text-sm text-indigo-800">
                            {caseProgress && Object.entries(caseProgress)
                                .filter(([_, data]) => data.level === '하')
                                .map(([case_name]) => (
                                    <div key={case_name} className="bg-indigo-100 p-3 rounded">{case_name}</div>
                                ))
                            }
                            {(!caseProgress || Object.entries(caseProgress).filter(([_, data]) => data.level === '하').length === 0) && (
                                <div className="text-gray-500 text-center p-3">
                                    현재 집중 학습이 필요한 유형이 없습니다.
                                </div>
                            )}
                        </div>
                    </div>


                </div>

                {/* 월간 및 주간 통계 */}
                <div className="flex flex-col md:flex-row gap-4">


                    <div className="w-full md:w-2/3 bg-white rounded shadow">
                        <div className="border-b px-6 py-4 font-bold text-lg">월간 학습 현황</div>
                        <div className="p-6">
                            {/* 캘린더 섹션 */}
                            <div className="mb-6">
                                {/* 월 선택기 */}
                                <div className="flex justify-between items-center mb-4">
                                    <button
                                        className="text-gray-600 hover:text-gray-800"
                                        onClick={() => setCurrentDate(prev => {
                                            const newDate = new Date(prev);
                                            newDate.setMonth(prev.getMonth() - 1);
                                            return newDate;
                                        })}
                                    >
                                        ◀
                                    </button>
                                    <div className="text-lg font-medium">
                                        {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
                                    </div>
                                    <button
                                        className="text-gray-600 hover:text-gray-800"
                                        onClick={() => setCurrentDate(prev => {
                                            const newDate = new Date(prev);
                                            newDate.setMonth(prev.getMonth() + 1);
                                            return newDate;
                                        })}
                                    >
                                        ▶
                                    </button>
                                </div>

                                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                                    {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                                        <div key={day} className="text-sm font-medium text-gray-600">
                                            {day}
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-1">
                                    {calendarDays.map((day, idx) => {
                                        const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                                        const isToday = day.toDateString() === new Date().toDateString();
                                        const dateKey = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
                                        const problemCount = sampleData[dateKey];

                                        return (
                                            <div
                                                key={idx}
                                                className={`aspect-square p-1 rounded ${isToday
                                                    ? 'bg-blue-100 hover:bg-blue-200'
                                                    : isCurrentMonth
                                                        ? 'bg-gray-100 hover:bg-gray-200 cursor-pointer'
                                                        : 'bg-gray-50'
                                                    }`}
                                                title={problemCount ? `${problemCount}문제 학습` : '학습 기록 없음'}
                                            >
                                                <div className={`text-xs ${isToday
                                                    ? 'text-blue-600 font-bold'
                                                    : 'text-gray-600'
                                                    }`}>
                                                    {day.getDate()}
                                                </div>
                                                {isCurrentMonth && problemCount && (
                                                    <div className="text-xs font-medium text-green-600">
                                                        {problemCount}문제
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-2/3 bg-white rounded shadow">
                        <div className="border-b px-6 py-4 font-bold text-lg">주간 학습 현황</div>
                        <div className="p-6">
                            <div className="flex justify-around items-end h-[450px]">
                                {[40, 80, 120, 60, 140, 100, 160].map((height, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-8 rounded-t ${idx === 6 ? 'bg-indigo-600' : 'bg-blue-200'}`}
                                        style={{ height: `${height}px` }}
                                    ></div>
                                ))}
                            </div>
                            <div className="flex justify-around text-xs text-gray-500 mt-2">
                                {['월', '화', '수', '목', '금', '토', '일'].map((d, i) => (
                                    <span key={i}>{d}</span>
                                ))}
                            </div>
                            <div className="text-center text-xs text-gray-500 mt-2">평균: 45문항/일</div>
                        </div>
                    </div>



                </div>
            </div>
        </main>
    );
};

export default dashboard;