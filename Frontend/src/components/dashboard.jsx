import React, { useState, useMemo } from 'react';

const dashboard = ({ userdata, setView }) => {
    // console.log(userdata);

    const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 4)); // 2025년 6월 4일

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
                            {[
                                { label: '근육계', level: '중', percent: 70, color: 'bg-green-500' },
                                { label: '골격계', level: '상', percent: 80, color: 'bg-green-500' },
                                { label: '신경계', level: '하', percent: 50, color: 'bg-red-500' },
                                { label: '순환계', level: '중', percent: 60, color: 'bg-yellow-500' },
                                { label: '내장기관', level: '중', percent: 65, color: 'bg-green-500' },
                            ].map((item, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span>{item.label}</span>
                                        <span>{item.level}</span>
                                    </div>
                                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`${item.color} h-full rounded-full`}
                                            style={{ width: `${item.percent}%` }}
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
                            {['신경계 - 중추신경계', '순환계 - 심장구조', '신경계 - 말초신경'].map((text, idx) => (
                                <div key={idx} className="bg-indigo-100 p-3 rounded">{text}</div>
                            ))}
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
                                                className={`aspect-square p-1 rounded ${
                                                    isToday 
                                                        ? 'bg-blue-100 hover:bg-blue-200'
                                                        : isCurrentMonth
                                                            ? 'bg-gray-100 hover:bg-gray-200 cursor-pointer'
                                                            : 'bg-gray-50'
                                                }`}
                                                title={problemCount ? `${problemCount}문제 학습` : '학습 기록 없음'}
                                            >
                                                <div className={`text-xs ${
                                                    isToday 
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
                                        style={{ height: `${(height / 160) * 100}%` }}
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