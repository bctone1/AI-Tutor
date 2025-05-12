import React, { useState } from 'react';

const LevelTestResult = () => {
    const [activeTab, setActiveTab] = useState('anatomy');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (


        <main className="max-w-5xl mx-auto mt-6 px-5">
            <div className="p-6 space-y-6">

                <div className="bg-white shadow-md rounded-lg p-6  mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">프로필</h2>

                    <div className="flex items-center mb-6">
                        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold text-white mr-4">
                            김
                        </div>
                        <div>
                            <div className="text-lg font-medium text-gray-800">김인대</div>
                            <div className="text-sm text-gray-500">직업치료학과 3학년</div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="text-sm text-gray-500">이메일</div>
                        <div className="text-sm text-gray-700 flex items-center gap-2 mt-1">
                            otstudent@university.ac.kr
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">레벨테스트</span>
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">중</span>
                        </div>
                    </div>

                    {/* <ProgressBar label="해부학 영역" percent={70} />
                    <ProgressBar label="생리학 영역" percent={58} /> */}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                        <StatCard label="총 풀이 문제" value="427" />
                        <StatCard label="평균 정답률" value="72%" />
                        <StatCard label="연속 학습" value="5일" />
                        <StatCard label="총 학습 시간" value="64:05" />
                    </div>
                </div>


                <div className="bg-white shadow-md rounded-lg p-6 mt-6 mb-6">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">레벨테스트 결과</h2>

                    <div className="flex border-b mb-4">
                        <button
                            className={`py-2 px-4 font-medium ${activeTab === 'anatomy' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                                }`}
                            onClick={() => handleTabClick('anatomy')}
                        >
                            해부학 (9개 유형)
                        </button>
                        <button
                            className={`py-2 px-4 font-medium ml-4 ${activeTab === 'physiology' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
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
    <div className="mt-6">
        <div className="text-sm font-semibold text-gray-800">{title}</div>
        <div className="text-sm text-gray-700">{areas}</div>
        <div className="text-sm text-blue-600 mt-1">
            해당 영역에 대한 맞춤형 학습 자료를 '학습 자료' 메뉴에서 확인하세요.
        </div>
    </div>
);


const ProgressBar = ({ label, percent }) => {
    return (
        <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-700 mb-1">
                <span>{label}</span>
                <span>{percent}%</span>
            </div>
            <div className="w-full bg-gray-200 h-3 rounded-full">
                <div
                    className="h-3 bg-blue-500 rounded-full"
                    style={{ width: `${percent}%` }}
                ></div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value }) => {
    return (
        <div className="bg-gray-100 p-4 rounded-md text-center">
            <div className="text-xl font-bold text-gray-800">{value}</div>
            <div className="text-sm text-gray-500 mt-1">{label}</div>
        </div>
    );
};

export default LevelTestResult;
