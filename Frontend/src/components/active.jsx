import React from 'react';

const active = () => {




    return (
        <main className="max-w-5xl mx-auto mt-6 px-5">
            {/* 세션 정보 카드 */}
            <section className="bg-white rounded-md shadow mb-6 p-5 border-b">
                <h2 className="text-lg font-bold text-gray-800 mb-1">신경계: 중추신경계 학습</h2>
                <p className="text-sm text-gray-600">국가고시 기출문제 | 난이도: 중 | 문항: 10/20</p>
            </section>

            {/* 채팅 카드 */}
            <section className="relative bg-white rounded-md shadow p-5">
                <div className="flex flex-col gap-5 h-[70vh] overflow-y-auto">
                    {/* AI 질문 */}
                    <div className="flex flex-col max-w-[80%]">
                        <div className="bg-indigo-100 rounded-tl-sm rounded-tr-xl rounded-bl-xl p-4 shadow">
                            <div className="font-semibold text-indigo-600 mb-1">AI 튜터</div>
                            <div className="text-sm text-gray-800">
                                다음은 대뇌의 주요 부위에 대한 설명입니다. 틀린 것을 고르세요:
                                <br /><br />
                                이 문제는 2020년 의사국가고시에 출제되었으며, 평균 정답률은 68%입니다.
                            </div>
                            <div className="bg-gray-50 rounded mt-4 text-center text-gray-500 p-5 text-sm border">
                                [대뇌피질 영역 구분도]
                            </div>
                            <div className="mt-3 text-sm text-gray-800">
                                1. 전두엽(frontal lobe)은 수의적 운동을 관장한다.<br />
                                2. 두정엽(parietal lobe)은 체성감각을 처리한다.<br />
                                3. 브로카 영역(Broca's area)은 측두엽에 위치한다.<br />
                                4. 후두엽(occipital lobe)은 시각 정보를 처리한다.<br />
                                5. 베르니케 영역(Wernicke's area)은 언어 이해와 관련이 있다.
                            </div>
                        </div>
                    </div>

                    {/* 사용자 응답 */}
                    <div className="flex flex-col items-end max-w-[80%] self-end">
                        <div className="bg-teal-100 rounded-tr-sm rounded-tl-xl rounded-br-xl p-4 shadow">
                            <div className="font-semibold text-teal-600 text-right mb-1">나</div>
                            <div className="text-sm text-gray-800">3번: 브로카 영역은 측두엽에 위치한다.</div>
                        </div>
                    </div>

                    {/* AI 피드백 */}
                    <div className="flex flex-col max-w-[80%]">
                        <div className="bg-indigo-100 rounded-tl-sm rounded-tr-xl rounded-bl-xl p-4 shadow">
                            <div className="font-semibold text-indigo-600 mb-1">AI 튜터</div>
                            <div className="text-sm text-gray-800">
                                정확합니다! 브로카 영역(Broca's area)은 측두엽이 아닌 전두엽(frontal lobe)의 하부에 위치합니다.
                                구체적으로는 전두엽의 아래쪽 이랑(inferior frontal gyrus)에 있으며, 언어의 산출과 관련이 있습니다.
                                언어 이해를 담당하는 베르니케 영역(Wernicke's area)은 측두엽에 위치합니다.
                            </div>
                        </div>
                    </div>
                </div>

                {/* 사이드 기능 버튼 */}
                <div className="absolute top-5 right-5 flex flex-col space-y-2">
                    {["힌트", "관련 자료", "저장", "건너뛰기"].map((btn, i) => (
                        <button key={i} className="px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
                            {btn}
                        </button>
                    ))}
                    <button className="px-3 py-1 text-xs rounded-full bg-green-500 text-white hover:bg-green-600">
                        다음 문제
                    </button>
                </div>

                {/* 입력창 */}
                <div className="flex mt-6 pt-5 border-t">
                    <input
                        type="text"
                        className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                        placeholder="추가 질문이 있으시면 입력하세요..."
                    />
                </div>
            </section>
        </main>
    );
};

export default active;