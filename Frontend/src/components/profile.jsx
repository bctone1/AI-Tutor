import React, { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';

const Profile = ({ userdata, setView }) => {

    const [department, setDepartment] = useState('');
    const [grade, setGrade] = useState('');
    const [dailyProgress, setDailyProgress] = useState({
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
                    console.log(data);
                    setDailyProgress({
                        attendance: data.attendance,
                        correct_rate: data.correct_rate,
                        total_questions: data.total_question,
                        total_score: data.total_score
                    });
                }
            } catch (error) {
                // console.error('유형별 학습 현황 조회 오류:', error);
            }
        };


        if (userdata?.user?.id) {
            fetchCaseProgress();
        }
    }, [userdata?.user?.id]);


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

                                    {userdata.user.level && (
                                        <span
                                            className={`ml-3 px-4 py-1.5 rounded-[12px] text-[16px] font-bold border-2 animate-pulse 
                                                ${userdata.user.level == "상"
                                                    ? 'text-green-500 border-green-500 bg-[#e6fff3]'
                                                    : userdata.user.level == "중"
                                                        ? 'text-orange-500 border-orange-500 bg-[#fff3e6]'
                                                        : 'text-red-500 border-red-500 bg-[#ffe6e6]'
                                                }`}
                                        >
                                            Level - {userdata.user.level}
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
                        <StatCard label="총 풀이 문제" value={dailyProgress.total_questions + "문제"} />
                        <StatCard label="평균 정답률" value={(dailyProgress.correct_rate * 1).toFixed(1) + "%"} />
                        <StatCard label="연속 학습" value={dailyProgress.attendance + "일"} />
                        <StatCard label="내 점수" value={dailyProgress.total_score + "점"} />

                        {/* <StatCard label="총 풀이 문제" value="427" />
                        <StatCard label="평균 정답률" value="72%" />
                        <StatCard label="연속 학습" value="5일" />
                        <StatCard label="내 점수" value="64:05" /> */}
                    </div>
                </div>


            </div>
        </main>
    );
};



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
