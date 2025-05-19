import React, { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';

const Profile = ({ userdata }) => {
    const { data: session } = useSession();
    console.log(session.user);

    const [activeTab, setActiveTab] = useState('anatomy');
    const [department, setDepartment] = useState('');
    const [grade, setGrade] = useState('');

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
            email: session.user.email,
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


                    {userdata.user.major !="소속 없음" ? (
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
                                                <option value="직업치료학과">직업치료학과</option>
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
                        <StatCard label="총 풀이 문제" value="-" />
                        <StatCard label="평균 정답률" value="-" />
                        <StatCard label="연속 학습" value="-" />
                        <StatCard label="총 학습 시간" value="-" />

                        {/* <StatCard label="총 풀이 문제" value="427" />
                        <StatCard label="평균 정답률" value="72%" />
                        <StatCard label="연속 학습" value="5일" />
                        <StatCard label="총 학습 시간" value="64:05" /> */}
                    </div>
                </div>

                {userdata.user.major && (
                    <div className="bg-white shadow-md rounded-lg p-6 mt-6 mb-6">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800">레벨테스트 결과</h2>

                        <div className="flex mb-4 gap-2">
                            <button
                                className={`py-2 rounded-[5px] border px-4 font-medium cursor-pointer ${activeTab === 'anatomy' ? 'text-[#3f51b5] border-[#3f51b5] bg-[#e8eaf6]' : 'text-gray-500'
                                    }`}
                                onClick={() => handleTabClick('anatomy')}
                            >
                                해부학 (9개 유형)
                            </button>
                            <button
                                className={`py-2 rounded-[5px] border px-4 font-medium cursor-pointer ${activeTab === 'physiology' ? 'text-[#3f51b5] border-[#3f51b5] bg-[#e8eaf6]' : 'text-gray-500'
                                    }`}
                                onClick={() => handleTabClick('physiology')}
                            >
                                생리학 (7개 유형)
                            </button>
                        </div>

                        {activeTab === 'anatomy' && (
                            <div>
                                <LevelItem label="인체의 체계" score="상 (3/3)" width="85%" level="high" />
                                <LevelItem label="뼈대와 관절계" score="상 (4/4)" width="88%" level="high" />
                                <LevelItem label="근육계" score="중 (2/3)" width="75%" level="mid" />
                                <LevelItem label="심혈관계, 면역계" score="하 (0/2)" width="65%" level="low" />
                                <LevelItem label="호흡계, 음성/발성기 관련 기관" score="중 (1/2)" width="72%" level="mid" />
                                <LevelItem label="소화계, 섭취 관련 기관" score="중 (1/3)" width="72%" level="mid" />
                                <LevelItem label="신경계" score="하 (0/3)" width="65%" level="low" />
                                <LevelItem label="피부, 눈, 귀 등 감각계" score="중 (1/2)" width="72%" level="mid" />
                                <LevelItem label="내분비계, 비뇨계, 생식계" score="하 (0/2)" width="65%" level="low" />
                                <Legend />
                                <FocusArea
                                    title="집중 학습 필요 영역:"
                                    areas="심혈관계, 신경계, 내분비계/비뇨계/생식계"
                                />
                            </div>
                        )}

                        {activeTab === 'physiology' && (
                            <div>
                                <LevelItem label="혈액순환, 면역 기능" score="하 (0/2)" width="60%" level="low" />
                                <LevelItem label="호흡, 음성, 말하기 기능" score="중 (1/2)" width="70%" level="mid" />
                                <LevelItem label="삼킴, 소화, 대사 기능" score="중 (2/3)" width="75%" level="mid" />
                                <LevelItem label="내분비, 배설, 생식 기능" score="하 (0/2)" width="55%" level="low" />
                                <LevelItem label="감각기능" score="상 (3/3)" width="85%" level="high" />
                                <LevelItem label="신경계(통)의 기능" score="하 (0/3)" width="58%" level="low" />
                                <LevelItem label="근육계(통)의 기능" score="중 (1/2)" width="68%" level="mid" />
                                <Legend />
                                <FocusArea
                                    title="집중 학습 필요 영역:"
                                    areas="혈액순환/면역 기능, 내분비/배설/생식 기능, 신경계(통)의 기능"
                                />
                            </div>
                        )}
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
            해당 영역에 대한 맞춤형 학습 자료를 '학습 자료' 메뉴에서 확인하세요.
        </div>
    </div>
);


const StatCard = ({ label, value }) => {
    return (
        <div className="bg-white-100 p-4 rounded-md text-center border border-gray-300">
            <div className="text-xl font-bold text-[#3f51b5]">{value}</div>
            <div className="text-sm text-gray-500 mt-1">{label}</div>
        </div>
    );
};

export default Profile;
