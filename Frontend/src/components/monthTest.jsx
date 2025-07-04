"use client";
import React, { useState, useEffect } from 'react';
const MonthTest = ({ setView, userdata, setRound }) => {

    const [activeTab, setActiveTab] = useState(
        userdata?.user?.major === '작업치료학과' ? 'anatomy2' :
            userdata?.user?.major === '물리치료학과' ? 'anatomy' : ''
    );

    const [caseProgress, setCaseProgress] = useState(null);


    useEffect(() => {
        const getMonthTestResult = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getMonthTestResult`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: userdata.user.id
                    })
                });
                const data = await response.json();
                if (response.ok) {
                    console.log(data.progress);

                    const rawData = data.progress;

                    const transformedData = {};

                    // 1~12월 초기화
                    for (let i = 1; i <= 12; i++) {
                        transformedData[i] = {
                            completed: false,
                            score: null,
                            questions: 0,
                            correct: 0,
                        };
                    }

                    // 각 항목 처리
                    rawData.forEach(item => {
                        if (!item.last_updated) return;

                        const month = new Date(item.last_updated).getMonth() + 1; // JS의 getMonth()는 0~11 반환

                        // 누적 계산
                        transformedData[month].questions += item.total_questions || 0;
                        transformedData[month].correct += item.correct_answers || 0;
                        transformedData[month].score = (transformedData[month].score || 0) + (item.total_score || 0);
                    });

                    // completed 및 score null 처리
                    for (let i = 1; i <= 12; i++) {
                        if (transformedData[i].questions > 0) {
                            transformedData[i].completed = true;
                        } else {
                            transformedData[i].score = null;
                        }
                    }

                    // 결과 적용
                    setMonthData(transformedData);

                    setCaseProgress(data.progress);
                } else {
                    throw new Error('유형별 학습 현황을 가져오는데 실패했습니다.');
                }
            } catch (error) {
                // console.error('유형별 학습 현황 조회 오류:', error);
            }
        };


        if (userdata?.user?.id) {
            getMonthTestResult();
        }
    }, [userdata?.user?.id]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleLevelTestClick = () => {
        setView('leveltest');
    };

    const targetCases = [
        "인체의 체계",
        "뼈대와 관절계",
        "근육계",
        "심혈관계, 면역계",
        "호흡계, 음성, 말하기 관련 기관",
        "소화계, 삼킴관련 기관",
        "신경계",
        "피부, 눈, 귀 등 감각계",
        "내분비계, 비뇨계, 생식계"
    ];

    const targetCases2 = [
        "혈액순환, 면역기능",
        "호흡, 음성, 말하기 기능",
        "삼킴, 소화, 대사 기능",
        "내분비, 배설, 생식기능",
        "감각기능",
        "신경계의 기능",
        "근육계의 기능"
    ]

    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [monthData, setMonthData] = useState({});

    const months = [
        { id: 1, name: '1월', korean: '일월' },
        { id: 2, name: '2월', korean: '이월' },
        { id: 3, name: '3월', korean: '삼월' },
        { id: 4, name: '4월', korean: '사월' },
        { id: 5, name: '5월', korean: '오월' },
        { id: 6, name: '6월', korean: '유월' },
        { id: 7, name: '7월', korean: '칠월' },
        { id: 8, name: '8월', korean: '팔월' },
        { id: 9, name: '9월', korean: '구월' },
        { id: 10, name: '10월', korean: '시월' },
        { id: 11, name: '11월', korean: '십일월' },
        { id: 12, name: '12월', korean: '십이월' }
    ];

    // 월별 상태 확인
    const getMonthStatus = (monthId) => {

        // if (monthId < currentMonth) {
        //     return 'completed'; // 완료된 달
        // } else 
        if (monthId === currentMonth) {
            if (monthData[monthId]?.completed) {
                return 'doneCurrent';
            }
            return 'current'; // 현재 달
        }

        if (monthData[monthId]?.completed) {
            return 'completed';
        } else if (monthId > currentMonth) {
            return 'disabled';
        } else {
            return 'disabled';
        }
    };

    const handleMonthClick = (monthId) => {
        console.log(monthId);
        console.log(caseProgress);

        const status = getMonthStatus(monthId);
        setSelectedMonth(monthId);

        if (status === 'disabled' || status === 'doneCurrent') {
            return; // 미래 달 또는 이번 달 이미 응시한 경우 클릭 불가
        }

        if (status === 'current') {
            // 여기서 해당 월의 테스트 페이지로 이동하거나 모달을 열 수 있음
        } else if (status === 'completed') {
            // 완료된 달의 결과 보기
        }

        const filtered = caseProgress
            ? caseProgress.filter(item => {
                if (!item.last_updated) return false;
                const itemMonth = new Date(item.last_updated).getMonth() + 1;
                return itemMonth === monthId;
            })
            : [];

        console.log('선택한 달의 데이터:', filtered);
    };

    const getMonthCardClass = (monthId) => {
        const status = getMonthStatus(monthId);
        const baseClass = "relative p-6 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-lg";

        switch (status) {
            case 'completed':
                return `${baseClass} bg-green-50 border-green-200 hover:bg-green-100`;
            case 'current':
                return `${baseClass} bg-blue-50 border-blue-300 hover:bg-blue-100`;
            case 'doneCurrent':
                return `${baseClass} bg-yellow-50 border-yellow-200 opacity-70 cursor-not-allowed`;
            case 'disabled':
                return `${baseClass} bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed`;
            default:
                return baseClass;
        }
    };

    const getMonthContent = (monthId) => {
        const status = getMonthStatus(monthId);
        const data = monthData[monthId];

        switch (status) {
            case 'completed':
                return (
                    <div className="text-center">
                        <div className="text-lg font-semibold text-green-700 mb-2">
                            {months[monthId - 1].name}
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                            완료
                        </div>
                        <div className="text-2xl font-bold text-green-600 mb-1">
                            {data?.score || 0}점
                        </div>
                        <div className="text-xs text-gray-500">
                            {data?.correct || 0}/{data?.questions || 0} 정답
                        </div>
                    </div>
                );
            case 'current':
                return (
                    <div
                        className="text-center cursor-pointer"
                    // onClick={() => setView('leveltest')}
                    >
                        <div className="text-lg font-semibold text-blue-700 mb-2">
                            {months[monthId - 1].name}
                        </div>
                        <div className="text-sm text-blue-600 mb-2">
                            이번 달
                        </div>
                        <div className="text-lg font-bold text-blue-600">
                            테스트 시작
                        </div>
                    </div>
                );
            case 'doneCurrent':
                return (
                    <div className="text-center">
                        <div className="text-lg font-semibold text-yellow-700 mb-2">
                            {months[monthId - 1].name}
                        </div>
                        <div className="text-sm text-yellow-600 mb-2">
                            이미 응시함
                        </div>
                        <div className="text-2xl font-bold text-yellow-600 mb-1">
                            {data?.score || 0}점
                        </div>
                        <div className="text-xs text-gray-500">
                            {data?.correct || 0}/{data?.questions || 0} 정답
                        </div>
                    </div>
                );
            case 'disabled':
                return (
                    <div className="text-center">
                        <div className="text-lg font-semibold text-gray-400 mb-2">
                            {months[monthId - 1].name}
                        </div>
                        <div className="text-sm text-gray-400">
                            미응시
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    // 선택한 달의 데이터 필터링
    const filteredMonthData = caseProgress
        ? caseProgress.filter(item => {
            if (!item.last_updated) return false;
            const itemMonth = new Date(item.last_updated).getMonth() + 1;
            return itemMonth === selectedMonth && item.round === 1;
        })
        : [];

    const filteredMonthDataRound2 = caseProgress
        ? caseProgress.filter(item => {
            if (!item.last_updated) return false;
            const itemMonth = new Date(item.last_updated).getMonth() + 1;
            return itemMonth === selectedMonth && item.round === 2;
        })
        : [];




    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* 헤더 */}
                {/* <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        {currentYear}년
                    </h1>
                    <p className="text-gray-600">
                        매월 진행되는 월별 테스트를 확인하고 참여하세요
                    </p>
                </div> */}

                {/* 통계 정보 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        {currentYear}년 테스트 통계
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-gray-800">
                                {Object.values(monthData).filter(data => data.completed).length}
                            </div>
                            <div className="text-sm text-gray-600">완료된 테스트</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-gray-800">
                                {Object.values(monthData)
                                    .filter(data => data.completed)
                                    .reduce((sum, data) => sum + (data.score || 0), 0) /
                                    Math.max(Object.values(monthData).filter(data => data.completed).length, 1)
                                        .toFixed(1)}
                            </div>
                            <div className="text-sm text-gray-600">평균 점수</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-gray-800">
                                {Object.values(monthData)
                                    .filter(data => data.completed)
                                    .reduce((sum, data) => sum + (data.correct || 0), 0)}
                            </div>
                            <div className="text-sm text-gray-600">총 정답 수</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-gray-800">
                                {Object.values(monthData)
                                    .filter(data => data.completed)
                                    .reduce((sum, data) => sum + (data.questions || 0), 0)}
                            </div>
                            <div className="text-sm text-gray-600">총 문제 수</div>
                        </div>
                    </div>
                </div>




                {/* 월별 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 mt-10">
                    {months.map((month) => (
                        <div
                            key={month.id}
                            className={getMonthCardClass(month.id)}
                            onClick={() => handleMonthClick(month.id)}
                        >
                            {getMonthContent(month.id)}

                            {/* 완료된 달에 체크 표시 */}
                            {getMonthStatus(month.id) === 'completed' && (
                                <div className="absolute top-2 right-2">
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            )}

                            {/* 이번 달 이미 응시한 경우 표시 */}
                            {getMonthStatus(month.id) === 'doneCurrent' && (
                                <div className="absolute top-2 right-2">
                                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V7h2v2z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-between gap-4 mt-6 mb-6">

                    {filteredMonthData.length > 0 ? (
                        <div className="bg-white shadow-md rounded-lg p-6 w-1/2">
                            <h2 className="text-2xl font-semibold mb-6 text-gray-800">{selectedMonth}월 1회차 진단테스트 결과</h2>
                            <div className="flex mb-4 gap-2">
                                {userdata.user.major == "작업치료학과" ? (
                                    <div>
                                        <button
                                            className={`py-2 rounded-[5px] border px-4 font-medium cursor-pointer mr-3 ${activeTab === 'anatomy2' ? 'text-[#3f51b5] border-[#3f51b5] bg-[#e8eaf6]' : 'text-gray-500'
                                                }`}
                                            onClick={() => handleTabClick('anatomy2')}
                                        >
                                            해부학 (9개 유형)
                                        </button>
                                        <button
                                            className={`py-2 rounded-[5px] border px-4 font-medium cursor-pointer ${activeTab === 'anatomy3' ? 'text-[#3f51b5] border-[#3f51b5] bg-[#e8eaf6]' : 'text-gray-500'
                                                }`}
                                            onClick={() => handleTabClick('anatomy3')}
                                        >
                                            생리학 (7개 유형)
                                        </button>
                                    </div>

                                ) : (
                                    <button
                                        className={`py-2 rounded-[5px] border px-4 font-medium cursor-pointer ${activeTab === 'anatomy' ? 'text-[#3f51b5] border-[#3f51b5] bg-[#e8eaf6]' : 'text-gray-500'
                                            }`}
                                        onClick={() => handleTabClick('anatomy')}
                                    >
                                        해부생리 (10개 유형)
                                    </button>

                                )}
                            </div>

                            {activeTab === 'anatomy' && (
                                <div>
                                    {filteredMonthData.length > 0 && (
                                        filteredMonthData.map((item, index) => (
                                            <LevelItem
                                                key={index}
                                                label={item.case}
                                                score={`${item.level} (${item.correct_answers}/${item.total_questions})`}
                                                width={`${item.accuracy * 100}%`}
                                                level={item.level === '상' ? 'high' : item.level === '중' ? 'mid' : 'low'}
                                            />
                                        ))
                                    )}
                                    <Legend />
                                    <FocusArea
                                        title="집중 학습 필요 영역:"
                                        areas={
                                            filteredMonthData.length > 0
                                                ? filteredMonthData
                                                    .filter(item => item.level === '하')
                                                    .map(item => item.case)
                                                    .join(', ')
                                                : ''
                                        }
                                    />
                                </div>
                            )}

                            {activeTab === 'anatomy2' && (
                                <div>
                                    {filteredMonthData.filter(item => targetCases.includes(item.case)).length > 0 && (
                                        filteredMonthData
                                            .filter(item => targetCases.includes(item.case))
                                            .map((item, index) => (
                                                <LevelItem
                                                    key={index}
                                                    label={item.case}
                                                    score={`${item.level} (${item.correct_answers}/${item.total_questions})`}
                                                    width={`${item.accuracy * 100}%`}
                                                    level={item.level === '상' ? 'high' : item.level === '중' ? 'mid' : 'low'}
                                                />
                                            ))
                                    )}
                                    <Legend />
                                    <FocusArea
                                        title="집중 학습 필요 영역:"
                                        areas={
                                            filteredMonthData.length > 0
                                                ? filteredMonthData
                                                    .filter(item => item.level === '하' && targetCases.includes(item.case))
                                                    .map(item => item.case)
                                                    .join(', ')
                                                : ''
                                        }
                                    />
                                </div>
                            )}

                            {activeTab === 'anatomy3' && (
                                <div>
                                    {filteredMonthData.filter(item => targetCases2.includes(item.case)).length > 0 && (
                                        filteredMonthData
                                            .filter(item => targetCases2.includes(item.case))
                                            .map((item, index) => (
                                                <LevelItem
                                                    key={index}
                                                    label={item.case}
                                                    score={`${item.level} (${item.correct_answers}/${item.total_questions})`}
                                                    width={`${item.accuracy * 100}%`}
                                                    level={item.level === '상' ? 'high' : item.level === '중' ? 'mid' : 'low'}
                                                />
                                            ))
                                    )}
                                    <Legend />
                                    <FocusArea
                                        title="집중 학습 필요 영역:"
                                        areas={
                                            filteredMonthData.length > 0
                                                ? filteredMonthData
                                                    .filter(item => item.level === '하' && targetCases2.includes(item.case))
                                                    .map(item => item.case)
                                                    .join(', ')
                                                : ''
                                        }
                                    />
                                </div>
                            )}
                        </div>

                    ) : getMonthStatus(selectedMonth) === 'current' ? (
                        <div className="bg-gradient-to-br from-blue-100 to-white shadow-xl rounded-2xl p-10 md:w-1/2 w-full text-center border border-blue-200">
                            <p className="mb-6 text-gray-700 text-xl font-semibold">
                                아직 결과가 없습니다.
                            </p>
                            <button
                                onClick={() => {
                                    setView('leveltest');
                                    setRound(1);
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-base font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out"
                            >
                                1회차테스트 시작하기
                            </button>
                        </div>
                    ) : (
                        <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-6 text-center md:w-1/2 w-full shadow-sm">
                            <p className="text-base font-medium">지금은 응시할 수 없습니다.</p>
                        </div>
                    )}



                    {/* 2회차 */}
                    {filteredMonthDataRound2.length > 0 ? (
                        <div className="bg-white shadow-md rounded-lg p-6 w-1/2">
                            <h2 className="text-2xl font-semibold mb-6 text-gray-800">{selectedMonth}월 2회차 진단테스트 결과</h2>
                            <div className="flex mb-4 gap-2">
                                {userdata.user.major == "작업치료학과" ? (
                                    <div>
                                        <button
                                            className={`py-2 rounded-[5px] border px-4 font-medium cursor-pointer mr-3 ${activeTab === 'anatomy2' ? 'text-[#3f51b5] border-[#3f51b5] bg-[#e8eaf6]' : 'text-gray-500'
                                                }`}
                                            onClick={() => handleTabClick('anatomy2')}
                                        >
                                            해부학 (9개 유형)
                                        </button>
                                        <button
                                            className={`py-2 rounded-[5px] border px-4 font-medium cursor-pointer ${activeTab === 'anatomy3' ? 'text-[#3f51b5] border-[#3f51b5] bg-[#e8eaf6]' : 'text-gray-500'
                                                }`}
                                            onClick={() => handleTabClick('anatomy3')}
                                        >
                                            생리학 (7개 유형)
                                        </button>
                                    </div>

                                ) : (
                                    <button
                                        className={`py-2 rounded-[5px] border px-4 font-medium cursor-pointer ${activeTab === 'anatomy' ? 'text-[#3f51b5] border-[#3f51b5] bg-[#e8eaf6]' : 'text-gray-500'
                                            }`}
                                        onClick={() => handleTabClick('anatomy')}
                                    >
                                        해부생리 (10개 유형)
                                    </button>

                                )}
                            </div>

                            {activeTab === 'anatomy' && (
                                <div>
                                    {filteredMonthDataRound2.length > 0 && (
                                        filteredMonthDataRound2.map((item, index) => (
                                            <LevelItem
                                                key={index}
                                                label={item.case}
                                                score={`${item.level} (${item.correct_answers}/${item.total_questions})`}
                                                width={`${item.accuracy * 100}%`}
                                                level={item.level === '상' ? 'high' : item.level === '중' ? 'mid' : 'low'}
                                            />
                                        ))
                                    )}
                                    <Legend />
                                    <FocusArea
                                        title="집중 학습 필요 영역:"
                                        areas={
                                            filteredMonthDataRound2.length > 0
                                                ? filteredMonthDataRound2
                                                    .filter(item => item.level === '하')
                                                    .map(item => item.case)
                                                    .join(', ')
                                                : ''
                                        }
                                    />
                                </div>
                            )}

                            {activeTab === 'anatomy2' && (
                                <div>
                                    {filteredMonthDataRound2.filter(item => targetCases.includes(item.case)).length > 0 && (
                                        filteredMonthDataRound2
                                            .filter(item => targetCases.includes(item.case))
                                            .map((item, index) => (
                                                <LevelItem
                                                    key={index}
                                                    label={item.case}
                                                    score={`${item.level} (${item.correct_answers}/${item.total_questions})`}
                                                    width={`${item.accuracy * 100}%`}
                                                    level={item.level === '상' ? 'high' : item.level === '중' ? 'mid' : 'low'}
                                                />
                                            ))
                                    )}
                                    <Legend />
                                    <FocusArea
                                        title="집중 학습 필요 영역:"
                                        areas={
                                            filteredMonthDataRound2.length > 0
                                                ? filteredMonthDataRound2
                                                    .filter(item => item.level === '하' && targetCases.includes(item.case))
                                                    .map(item => item.case)
                                                    .join(', ')
                                                : ''
                                        }
                                    />
                                </div>
                            )}

                            {activeTab === 'anatomy3' && (
                                <div>
                                    {filteredMonthDataRound2.filter(item => targetCases2.includes(item.case)).length > 0 && (
                                        filteredMonthDataRound2
                                            .filter(item => targetCases2.includes(item.case))
                                            .map((item, index) => (
                                                <LevelItem
                                                    key={index}
                                                    label={item.case}
                                                    score={`${item.level} (${item.correct_answers}/${item.total_questions})`}
                                                    width={`${item.accuracy * 100}%`}
                                                    level={item.level === '상' ? 'high' : item.level === '중' ? 'mid' : 'low'}
                                                />
                                            ))
                                    )}
                                    <Legend />
                                    <FocusArea
                                        title="집중 학습 필요 영역:"
                                        areas={
                                            filteredMonthDataRound2.length > 0
                                                ? filteredMonthDataRound2
                                                    .filter(item => item.level === '하' && targetCases2.includes(item.case))
                                                    .map(item => item.case)
                                                    .join(', ')
                                                : ''
                                        }
                                    />
                                </div>
                            )}
                        </div>

                    ) : getMonthStatus(selectedMonth) === 'doneCurrent' ? (
                        <div className="bg-gradient-to-br from-blue-100 to-white shadow-xl rounded-2xl p-10 md:w-1/2 w-full text-center border border-blue-200">
                            <p className="mb-6 text-gray-700 text-xl font-semibold">
                                아직 결과가 없습니다.
                            </p>
                            <button
                                onClick={() => {
                                    setView('leveltest');
                                    setRound(2);
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-base font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out"
                            >
                                2회차테스트 시작하기
                            </button>
                        </div>
                    ) : (
                        <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-6 text-center md:w-1/2 w-full shadow-sm">
                            <p className="text-base font-medium">지금은 응시할 수 없습니다.</p>
                        </div>
                    )}






                </div>





            </div>
        </div>
    );
};



const LevelItem = ({ label, score, width, level }) => {
    const levelColor =
        level === 'high' ? 'bg-green-400' : level === 'mid' ? 'bg-yellow-400' : 'bg-red-400';

    return (
        <div className="flex items-center mb-4">
            <div className="w-1/4 text-sm text-gray-700">{label}</div>
            <div className="w-2/4 bg-gray-200 h-4 rounded-md overflow-hidden mx-4">
                <div className={`${levelColor} h-full`} style={{ width }}></div>
            </div>
            <div className="w-1/4 text-right text-sm text-gray-600">{score}</div>
        </div>
    );
};

const Legend = () => (
    <div className="mt-6 flex gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 rounded"></div>
            <span>상</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <span>중</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-400 rounded"></div>
            <span>하</span>
        </div>
    </div>
);

const FocusArea = ({ title, areas }) => (
    <div className="mt-6 bg-red-50 p-5 rounded-[5px] border border-red-200">
        <div className="text-sm font-semibold text-red-500">{title}</div>
        <div className="text-m">{areas}</div>
        <div className="text-sm text-gray-700 mt-1">
            해당 영역에 대한 맞춤형 학습 자료를 '학습하기' 메뉴에서 확인하세요.
        </div>
    </div>
);






export default MonthTest; 