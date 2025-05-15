import React from 'react';

const dashboard = ({userdata}) => {
console.log(userdata);

    return (
        <main className="max-w-6xl mx-auto px-5">


            <div className="p-6 space-y-6">
                {/* 사용자 정보 및 카운트다운 */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/3 bg-white rounded shadow p-6">
                        <h2 className="text-lg font-bold">{userdata.user.name}님, 안녕하세요!</h2>
                        <p className="text-sm text-gray-600">의과대학 {userdata.user.grade}학년 | 종합 레벨: 중</p>
                    </div>
                    <div className="w-full md:w-2/3 bg-white rounded shadow p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h3 className="text-base font-bold">국가고시 D-120</h3>
                            <p className="text-sm text-gray-600">오늘의 학습: 3/5 완료 | 주간 목표: 65% 달성</p>
                        </div>
                        <button className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold">
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

                {/* 일정 및 주간 통계 */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-2/3 bg-white rounded shadow">
                        <div className="border-b px-6 py-4 font-bold text-lg">오늘의 학습 일정</div>
                        <div className="p-6 space-y-3">
                            {[
                                {
                                    title: '골격계 응용 문제 (15문항)',
                                    status: '완료',
                                    action: '복습',
                                    color: 'bg-gray-300',
                                    text: 'text-gray-800',
                                },
                                {
                                    title: '내장기관 기초 문제 (20문항)',
                                    status: '완료',
                                    action: '복습',
                                    color: 'bg-gray-300',
                                    text: 'text-gray-800',
                                },
                                {
                                    title: '신경계 취약점 집중 (25문항)',
                                    status: '진행중',
                                    action: '계속',
                                    color: 'bg-green-500',
                                    text: 'text-white',
                                    highlight: true,
                                },
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`flex justify-between items-center p-3 rounded relative ${item.highlight ? 'bg-yellow-100' : 'bg-gray-100'
                                        }`}
                                >
                                    <div
                                        className="w-1 absolute left-0 top-0 bottom-0 rounded-l"
                                        style={{ backgroundColor: item.highlight ? '#f59e0b' : '#4caf50' }}
                                    ></div>
                                    <div className="pl-4">
                                        <div className="text-sm font-medium text-gray-800">{item.title}</div>
                                        <div className="text-xs text-gray-600">{item.status}</div>
                                    </div>
                                    <button className={`ml-4 px-3 py-1 rounded-full text-sm font-bold ${item.color} ${item.text}`}>
                                        {item.action}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-full md:w-1/3 bg-white rounded shadow">
                        <div className="border-b px-6 py-4 font-bold text-lg">주간 학습 현황</div>
                        <div className="p-6">
                            <div className="flex justify-around items-end h-24">
                                {[20, 40, 60, 30, 70, 50, 80].map((height, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-4 rounded-t ${idx === 6 ? 'bg-indigo-600' : 'bg-blue-200'}`}
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