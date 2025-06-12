import React, { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';

const Profile = ({ userdata, setView }) => {
    const { data: session } = useSession();

    // const [activeTab, setActiveTab] = useState('');
    const [activeTab, setActiveTab] = useState(
        userdata?.user?.major === '작업치료학과' ? 'anatomy2' :
            userdata?.user?.major === '물리치료학과' ? 'anatomy' : ''
    );


    const [department, setDepartment] = useState('');
    const [grade, setGrade] = useState('');
    const [caseProgress, setCaseProgress] = useState(null);
    const [test, settest] = useState({
        attendance: 0,
        correct_rate: 0,
        total_questions: 0,
        total_time: 0
    });


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
                    // console.log(userdata.user.id);
                    console.log(data);
                    settest({
                        attendance: data.attendance,
                        correct_rate: data.correct_rate,
                        total_questions: data.total_question,
                        total_time: data.total_time
                    });
                    setCaseProgress(data.progress);
                }
            } catch (error) {
                // console.error('유형별 학습 현황 조회 오류:', error);
            }
        };


        if (userdata?.user?.id) {
            fetchCaseProgress();
        }
    }, [userdata?.user?.id]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!department || !grade) {
            alert('학과와 학년을 모두 선택해주세요.');
            return;
        }
        await signIn("credentials2", {
            redirect: false,
            email: userdata.user.email,
            major: department,
            grade: grade,
            // password: 123456789111,
        });
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



    return (
        <main className="max-w-6xl mx-auto px-5">
            <div className="p-6 space-y-6">

                <div className="bg-white shadow-md rounded-lg p-6  mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">프로필</h2>


                    {userdata.user.major != "소속 없음" ? (
                        <div className="flex items-center mb-6">
                            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold text-white mr-4">
                                {userdata.user.image && (
                                    <img src={userdata.user.image} alt="User" className="w-full h-full object-cover rounded-full" />
                                )}
                            </div>
                            <div>
                                <div className="text-lg font-medium text-gray-800">
                                    {userdata.user.name}

                                    {userdata.user.testscore > 0 && (
                                        <span
                                            className={`ml-3 px-4 py-1.5 rounded-[12px] text-[16px] font-bold border-2 animate-pulse 
                                                ${userdata.user.testscore >= 80
                                                    ? 'text-green-500 border-green-500 bg-[#e6fff3]'
                                                    : userdata.user.testscore >= 50
                                                        ? 'text-orange-500 border-orange-500 bg-[#fff3e6]'
                                                        : 'text-red-500 border-red-500 bg-[#ffe6e6]'
                                                }`}
                                        >
                                            Level -{' '}
                                            {userdata.user.testscore >= 80
                                                ? '상'
                                                : userdata.user.testscore >= 50
                                                    ? '중'
                                                    : '하'}
                                        </span>
                                    )}

                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                    {userdata.user.major} {userdata.user.grade}학년
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center mb-6">
                            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold text-white mr-4">
                                {userdata.user.image && (
                                    <img src={userdata.user.image} alt="User" className="w-full h-full object-cover rounded-full" />
                                )}
                            </div>
                            <div>
                                <div className="text-lg font-medium text-gray-800">
                                    {userdata.user.name}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                    학과 및 학년 정보를 입력해주세요
                                </div>
                            </div>

                        </div>
                    )}


                    <div className="mb-4">
                        <div className="text-sm text-gray-500">이메일</div>
                        <div className="text-sm text-gray-700 flex items-center gap-2 mt-1">
                            {userdata.user.email}
                        </div>
                    </div>
                    {userdata.user.major == "소속 없음" && (
                        <div>
                            <div className="flex items-center mb-5 p-3 rounded bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800">
                                <span className="mr-2 text-lg">ⓘ</span>
                                학과와 학년 정보를 입력하면 맞춤형 레벨테스트를 받을 수 있습니다.
                            </div>
                            <div className="bg-[#e8eaf6] border-2 border-dashed border-[#3f51b5] rounded-lg p-5 my-5">
                                <div className="text-[18px] font-bold text-[#3f51b5] mb-4 flex items-center">
                                    <span className="mr-2 text-[20px]">✏️</span>
                                    학과 및 학년 정보 입력
                                </div>

                                <div className="text-gray-600 mb-4 leading-relaxed text-sm">
                                    학과와 학년 정보를 입력하시면 해당 전공에 맞는 레벨테스트와 학습 자료를 제공해드립니다.
                                    학과별 맞춤형 문제와 학습 콘텐츠로 더욱 효율적인 학습을 경험하세요!
                                </div>

                                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label htmlFor="department" className="block text-sm text-gray-600 mb-2 font-medium">학과<span className="text-red-500 ml-1">*</span></label>
                                            <select
                                                id="department"
                                                className="w-full h-[45px] border border-gray-300 rounded-lg px-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#3f51b5]/30 focus:border-[#3f51b5]"
                                                value={department}
                                                onChange={(e) => setDepartment(e.target.value)}
                                                required
                                            >
                                                <option value="" disabled>학과를 선택하세요</option>
                                                <option value="작업치료학과">작업치료학과</option>
                                                <option value="물리치료학과">물리치료학과</option>
                                            </select>
                                        </div>

                                        <div className="flex-1">
                                            <label htmlFor="grade" className="block text-sm text-gray-600 mb-2 font-medium">학년<span className="text-red-500 ml-1">*</span></label>
                                            <select
                                                id="grade"
                                                className="w-full h-[45px] border border-gray-300 rounded-lg px-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#3f51b5]/30 focus:border-[#3f51b5]"
                                                value={grade}
                                                onChange={(e) => setGrade(e.target.value)}
                                                required
                                            >
                                                <option value="" disabled>학년을 선택하세요</option>
                                                <option value="1">1학년</option>
                                                <option value="2">2학년</option>
                                                <option value="3">3학년</option>
                                                <option value="4">4학년</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex justify-end mt-2">
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-[#3f51b5] text-white rounded-lg text-base font-bold hover:bg-[#303f9f] transition"
                                        >
                                            정보 저장 및 레벨테스트 시작
                                        </button>
                                    </div>
                                </form>
                            </div>

                        </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                        <StatCard label="총 풀이 문제" value={test.total_questions + "문제"} />
                        <StatCard label="평균 정답률" value={test.correct_rate + "%"} />
                        <StatCard label="연속 학습" value={test.attendance + "일"} />
                        <StatCard label="총 학습 시간" value={test.total_time + "시간"} />

                        {/* <StatCard label="총 풀이 문제" value="427" />
                        <StatCard label="평균 정답률" value="72%" />
                        <StatCard label="연속 학습" value="5일" />
                        <StatCard label="총 학습 시간" value="64:05" /> */}
                    </div>
                </div>

                {userdata.user.testscore ? (
                    <div className="bg-white shadow-md rounded-lg p-6 mt-6 mb-6">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800">레벨테스트 결과</h2>

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

                ) : (
                    <div className="bg-white shadow-md rounded-lg p-6 mt-6 mb-6">
                        <div className="text-gray-600 text-lg mb-6">
                            ⚠️ 먼저 <span className="font-bold text-[#3f51b5]">레벨테스트</span>를 완료해주세요.
                        </div>

                        <div className="flex">
                            <button
                                onClick={handleLevelTestClick}
                                className="bg-[#3f51b5] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#303f9f] transition cusor-pointer"
                            >
                                레벨테스트 바로가기
                            </button>
                        </div>
                    </div>

                )}
            </div>
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
            <span>상 (모든 문제 정답)</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <span>중 (일부 문제 정답)</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-400 rounded"></div>
            <span>하 (모든 문제 오답)</span>
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


const StatCard = ({ label, value }) => {
    // console.log(value);
    return (
        <div className="bg-white-100 p-4 rounded-md text-center border border-gray-300">
            <div className="text-xl font-bold text-[#3f51b5]">{value}</div>
            <div className="text-sm text-gray-500 mt-1">{label}</div>
        </div>
    );
};

export default Profile;
