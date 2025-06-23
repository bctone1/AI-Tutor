import React, { useState, useEffect, useMemo } from 'react';

const Analysis = ({ userdata }) => {
    const [selectedPeriod, setSelectedPeriod] = useState('week');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [students, setStudents] = useState([]);
    // console.log(selectedStudent);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedFeedback, setSelectedFeedback] = useState('');
    const [feedbackList, setFeedbackList] = useState([]);

    const [caseProgress, setCaseProgress] = useState(null);
    const [caseScoreProgress, setCaseScoreProgress] = useState(null);
    const [dailyRecord, setDailyRecord] = useState(null);
    const [dailyProgress, setDailyProgress] = useState({
        attendance: 0,
        correct_rate: 0,
        total_questions: 0,
        total_time: 0
    });

    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('anatomy2');


    const [currentDate, setCurrentDate] = useState(new Date());
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

    const weeklyData = useMemo(() => {
        if (!dailyRecord) return Array(7).fill(0);

        const today = new Date();
        const dayOfWeek = today.getDay();
        const monday = new Date(today);
        monday.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
        monday.setHours(0, 0, 0, 0);

        const weekData = Array(7).fill(0);

        if (dailyRecord) {
            dailyRecord.forEach(record => {
                // YYYY-MM-DD 형식의 날짜를 로컬 시간대로 파싱
                const [year, month, day] = record.date.split('-').map(Number);
                const recordDate = new Date(year, month - 1, day);
                recordDate.setHours(0, 0, 0, 0);

                const diffDays = Math.floor((recordDate - monday) / (1000 * 60 * 60 * 24));

                if (diffDays >= 0 && diffDays < 7) {
                    weekData[diffDays]++;
                }
            });
        }

        return weekData;
    }, [dailyRecord]);

    const sampleData = useMemo(() => {
        const data = {};
        if (dailyRecord) {
            dailyRecord.forEach(record => {
                const date = record.date;
                if (data[date]) {
                    data[date] += 1;
                } else {
                    data[date] = 1;
                }
            });
        }
        // data['2025-06-06'] = "현충일";

        return data;
    }, [dailyRecord]);

    const maxCount = Math.max(...weeklyData, 1); // 0으로 나누는 것 방지
    const maxBarHeight = 300; // px, 원하는 최대 막대 높이


    const handleTabClick = (tab) => {
        setActiveTab(tab);
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




    useEffect(() => {
        const getStudentData = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getStudentData`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            if (response.ok) {
                console.log(data);
                setStudents(data);
            } else {
                console.error("지식베이스 오류");
            }
        };
        getStudentData();
    }, []);

    useEffect(() => {
        if (!selectedStudent) return;

        const getFeedbackList = async () => {
            // setFeedbackList([
            //     { date: '2025-05-01', feedback: '~~유형의 학습이 부족하니 집중적으로 학습이 요망됩니다.', professor: 'A교수' },
            //     { date: '2025-06-01', feedback: '저번달 대비 ~~유형의 학습이 부족함으로 학습이 필요합니다.', professor: 'B교수' }
            // ]);
            // return;
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getFeedbackList`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: selectedStudent.id })
            });
            const data = await response.json();
            if (response.ok) {
                console.log(data);
                setFeedbackList(data);
            } else {
                console.error("피드백 목록 조회 오류");
            }
        }

        const getUserCaseProgress = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getUserCaseProgress`, {//레벨테스트 결과
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: selectedStudent.id })
                });
                const data = await response.json();
                if (data.success) {
                    console.log(data);
                    setDailyProgress({
                        attendance: data.attendance,
                        correct_rate: data.correct_rate,
                        total_questions: data.total_question,
                        total_score: data.total_score
                    });
                    setCaseProgress(data.progress);
                }
            } catch (error) {
                // console.error('유형별 학습 현황 조회 오류:', error);
            }
        };

        const getUserCaseScore = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getUserCaseScore`, {//학습결과
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: selectedStudent.id })
                });
                const data = await response.json();
                if (data.success) {
                    console.log(data);
                    setCaseScoreProgress(data.progress);
                }
            } catch (error) {
                console.error('유형별 학습 현황 조회 오류:', error);
            }
        };

        const getDailyRecord = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getDailyRecord`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: selectedStudent.id })
                });
                const data = await response.json();
                if (data) {
                    console.log(data);
                    setDailyRecord(data);
                }
            } catch (error) {
                console.error('일일 학습 기록 조회 오류:', error);
            }
        };

        const fetchAllData = async () => {
            setIsLoading(true); // 로딩 시작
            await getUserCaseProgress();
            await getUserCaseScore();
            await getDailyRecord();
            await getFeedbackList();
            setTimeout(() => {
                setIsLoading(false); // 로딩 끝    
                // console.log(dailyRecord);
            }, 2000);
        };

        fetchAllData();
    }, [selectedStudent]);



    const handleSave = async (date, feedback) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sendFeedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date, feedback, professor: userdata.user.name, user_id: selectedStudent.id })
        });
        const data = await res.json();
        if (res.ok) {
            console.log(data);
            setFeedbackList(prev => [...prev, { date, feedback, professor: userdata.user.name }]);
            setIsFeedbackModalOpen(false);
        } else {
            console.error("피드백 보내기 오류발생");
        }

    };

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
                        </div>
                    </div>

                    {/* 학생 목록 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {students.map((student) => (
                            <div
                                key={student.id}
                                onClick={() => {
                                    setSelectedStudent(student);
                                    setActiveTab(student.department === "작업치료학과" ? 'anatomy2' : 'anatomy');
                                }}
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
                                        ${student.score === null ? 'bg-gray-100 text-gray-700' :
                                            student.score >= 80 ? 'bg-green-100 text-green-700' :
                                                student.score >= 50 ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'}`}>
                                        {student.score ? student.score + "점" : 'NULL'}
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

                {isLoading ? (
                    <div className="text-center py-10 text-lg font-bold">데이터를 가져오고 있습니다...</div>
                ) : (
                    selectedStudent && (
                        <>
                            {dailyRecord && (
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="bg-white rounded-lg shadow p-6">
                                        <h3 className="text-gray-500">총 풀이 기출문제</h3>
                                        <p className="text-2xl font-bold">{dailyProgress.total_questions}문제</p>
                                        <p className={`text-sm ${selectedStudent.studyTimeChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {selectedStudent.studyTimeChange >= 0 ? '▲' : '▼'} 전주 대비 {Math.abs(selectedStudent.studyTimeChange)}% {selectedStudent.studyTimeChange >= 0 ? '증가' : '감소'}
                                        </p>
                                    </div>
                                    <div className="bg-white rounded-lg shadow p-6">
                                        <h3 className="text-gray-500">평균 정답률</h3>
                                        <p className="text-2xl font-bold">{dailyProgress.correct_rate.toFixed(1)}%</p>
                                        <p className={`text-sm ${selectedStudent.solvedProblemsChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {selectedStudent.solvedProblemsChange >= 0 ? '▲' : '▼'} 전주 대비 {Math.abs(selectedStudent.solvedProblemsChange)}% {selectedStudent.solvedProblemsChange >= 0 ? '증가' : '감소'}
                                        </p>
                                    </div>
                                    <div className="bg-white rounded-lg shadow p-6">
                                        <h3 className="text-gray-500">연속 학습</h3>
                                        <p className="text-2xl font-bold">{dailyProgress.attendance}일</p>
                                        <p className={`text-sm ${selectedStudent.accuracyChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {selectedStudent.accuracyChange >= 0 ? '▲' : '▼'} 전주 대비 {Math.abs(selectedStudent.accuracyChange)}% {selectedStudent.accuracyChange >= 0 ? '증가' : '감소'}
                                        </p>
                                    </div>
                                    <div className="bg-white rounded-lg shadow p-6">
                                        <h3 className="text-gray-500">점수</h3>
                                        <p className="text-2xl font-bold">{dailyProgress.total_score}점</p>
                                        <p className={`text-sm ${selectedStudent.achievementChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {selectedStudent.achievementChange >= 0 ? '▲' : '▼'} 목표 대비 {Math.abs(selectedStudent.achievementChange)}% {selectedStudent.achievementChange >= 0 ? '초과' : '미달'}
                                        </p>
                                    </div>
                                </div>
                            )}

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
                                    <button
                                        className="text-blue-500 hover:text-blue-700 cursor-pointer"
                                        onClick={() => setIsFeedbackModalOpen(true)}
                                    >
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


                                <div className="space-y-4 mt-4">
                                    {feedbackList.map((feedback, index) => (
                                        <div
                                            key={index}
                                            className="border rounded-lg p-4 bg-gray-50 shadow-sm space-y-2"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                <span className="text-base text-blue-600 font-semibold">
                                                    {feedback.date}
                                                </span>
                                                <span className="text-base text-gray-700 font-semibold">
                                                    {feedback.professor}
                                                </span>
                                            </div>
                                            <p className="text-gray-800">{feedback.content}</p>

                                            {/* 삭제 버튼 추가 */}
                                            <div className="text-right">
                                                <button
                                                    // onClick={() => handleDelete(index)}
                                                    className="text-sm text-red-600 hover:underline"
                                                >
                                                    삭제
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>

                            {selectedStudent.score && (
                                <div className="bg-white shadow-md rounded-lg p-6 mt-6 mb-6">
                                    <h3 className="text-xl font-bold mb-4">레벨테스트 결과</h3>

                                    <div className="flex mb-4 gap-2">
                                        {selectedStudent.department == "작업치료학과" ? (
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
                                            {caseProgress && Object.entries(caseProgress).map(([case_name, data]) => (
                                                <LevelItem
                                                    key={case_name}
                                                    label={case_name}
                                                    score={`${data.level} (${data.correct_answers}/${data.total_questions})`}
                                                    width={`${data.accuracy * 100}%`}
                                                    level={data.level === '상' ? 'high' : data.level === '중' ? 'mid' : 'low'}
                                                />
                                            ))}

                                            <Legend />
                                            <FocusArea
                                                title="집중 학습 필요 영역:"
                                                areas={
                                                    caseProgress ?
                                                        Object.entries(caseProgress)
                                                            .filter(([_, data]) => data.level === '하')
                                                            .map(([case_name]) => case_name)
                                                            .join(', ')
                                                        : ''
                                                }
                                            />
                                        </div>
                                    )}

                                    {activeTab === 'anatomy2' && (
                                        <div>
                                            {caseProgress &&
                                                Object.entries(caseProgress)
                                                    .filter(([case_name]) => targetCases.includes(case_name)) // ✅ 필터 추가
                                                    .map(([case_name, data]) => (
                                                        <LevelItem
                                                            key={case_name}
                                                            label={case_name}
                                                            score={`${data.level} (${data.correct_answers}/${data.total_questions})`}
                                                            width={`${data.accuracy * 100}%`}
                                                            level={data.level === '상' ? 'high' : data.level === '중' ? 'mid' : 'low'}
                                                        />
                                                    ))}

                                            <Legend />
                                            <FocusArea
                                                title="집중 학습 필요 영역:"
                                                areas={
                                                    caseProgress
                                                        ? Object.entries(caseProgress)
                                                            .filter(
                                                                ([case_name, data]) =>
                                                                    data.level === '하' && targetCases.includes(case_name) // ✅ 여기에도 필터 추가
                                                            )
                                                            .map(([case_name]) => case_name)
                                                            .join(', ')
                                                        : ''
                                                }
                                            />
                                        </div>
                                    )}

                                    {activeTab === 'anatomy3' && (
                                        <div>
                                            {caseProgress &&
                                                Object.entries(caseProgress)
                                                    .filter(([case_name]) => targetCases2.includes(case_name)) // ✅ 필터 추가
                                                    .map(([case_name, data]) => (
                                                        <LevelItem
                                                            key={case_name}
                                                            label={case_name}
                                                            score={`${data.level} (${data.correct_answers}/${data.total_questions})`}
                                                            width={`${data.accuracy * 100}%`}
                                                            level={data.level === '상' ? 'high' : data.level === '중' ? 'mid' : 'low'}
                                                        />
                                                    ))}

                                            <Legend />
                                            <FocusArea
                                                title="집중 학습 필요 영역:"
                                                areas={
                                                    caseProgress
                                                        ? Object.entries(caseProgress)
                                                            .filter(
                                                                ([case_name, data]) =>
                                                                    data.level === '하' && targetCases2.includes(case_name) // ✅ 여기에도 필터 추가
                                                            )
                                                            .map(([case_name]) => case_name)
                                                            .join(', ')
                                                        : ''
                                                }
                                            />
                                        </div>
                                    )}
                                </div>

                            )}

                            {/* 학습 패턴 분석 */}
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

                                            {weeklyData.map((count, idx) => {
                                                const height = count === 0 ? 0 : (count / maxCount) * maxBarHeight;
                                                return (
                                                    <div
                                                        key={idx}
                                                        className={`w-8 rounded-t ${idx === new Date().getDay() - 1 ? 'bg-blue-300' : 'bg-blue-200'}`}
                                                        style={{ height: `${height}px` }}
                                                    >
                                                        {count > 0 && <div className="text-xs text-center mt-2">{count}문제</div>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="flex justify-around text-xs text-gray-500 mt-2">
                                            {['월', '화', '수', '목', '금', '토', '일'].map((d, i) => (
                                                <span key={i} className={i === new Date().getDay() - 1 ? 'font-bold text-indigo-600' : ''}>
                                                    {d}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="text-center text-xs text-gray-500 mt-2">
                                            이번 주 총 {weeklyData.reduce((a, b) => a + b, 0)}문제 학습
                                        </div>
                                    </div>
                                </div>



                            </div>








                        </>
                    )
                )}
            </div>
            {isFeedbackModalOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">피드백 보내기</h2>
                        </div>
                        <div className="px-6 py-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">날짜</label>
                                <input
                                    type="date"
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    // value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">피드백</label>
                                <textarea
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    // value={selectedFeedback}
                                    onChange={(e) => setSelectedFeedback(e.target.value)}
                                    placeholder="피드백을 작성해주세요."
                                    rows={4}
                                />
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
                            <button
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                onClick={() => setIsFeedbackModalOpen(false)}
                            >
                                취소
                            </button>
                            <button
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                onClick={() => handleSave(selectedDate, selectedFeedback)}
                            >
                                보내기
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </main>
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

    </div>
);
export default Analysis; 