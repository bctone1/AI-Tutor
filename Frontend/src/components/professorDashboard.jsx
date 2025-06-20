import React from 'react';

const dashboard = ({ userdata }) => {


    return (
        <main className="max-w-5xl mx-auto mt-6 px-5">


            {/* 컨테이너 */}
            <div className="max-w-6xl mx-auto mt-6 px-4">
                <div className="bg-white rounded shadow mb-5">
                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-lg font-bold text-gray-800">{userdata.user.major} 모니터링</h2>
                        <div className="bg-gray-300 text-sm rounded-full px-3 py-1 flex items-center">
                            2025년 2학기 
                        </div>
                    </div>
                </div>

                {/* 콘텐츠 영역 */}
                <div className="flex flex-wrap -mx-2">
                    {/* 왼쪽 - 히트맵 */}
                    <div className="w-full lg:w-2/3 px-2">
                        <div className="bg-white rounded shadow mb-5">
                            <div className="p-4 border-b">
                                <h2 className="text-lg font-bold text-gray-800">학급 진도 히트맵</h2>
                            </div>
                            <div className="p-5 bg-gray-50 rounded-b">
                                <div className="grid grid-cols-8 gap-2 text-center text-xs font-semibold text-gray-600 mb-2">
                                    <div></div>
                                    <div>근육계</div>
                                    <div>골격계</div>
                                    <div>신경계</div>
                                    <div>순환계</div>
                                    <div>내장기관</div>
                                    <div>감각기</div>
                                    <div>임상해부</div>
                                </div>

                                <div className="grid grid-cols-8 gap-2 text-center text-xs font-semibold text-gray-600 mb-2">
                                    {[
                                        { name: "김의대", data: [90, 85, 50, 60, 80, 55, 30] },
                                        { name: "이간호", data: [95, 90, 85, 75, 70, 65, 40] },
                                        { name: "박치과", data: [20, 25, 15, 30, 45, 10, 5] },
                                        { name: "최물리", data: [80, 75, 70, 55, 60, 50, 35] },
                                        { name: "정작업", data: [85, 80, 65, 60, 55, 45, 25] }
                                    ].map((student, i) => (

                                        <div className="contents" key={i}>
                                            <div className="text-xs flex items-center">{student.name}</div>
                                            {student.data.map((val, j) => (
                                                <div
                                                    key={j}
                                                    className={`text-white text-xs font-bold flex items-center justify-center h-8 rounded ${val >= 70 ? 'bg-green-500' : val >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                >
                                                    {val}%
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>




                                {/* 범례 */}
                                <div className="flex mt-4 text-xs text-gray-600">
                                    <div className="flex items-center mr-6">
                                        <div className="w-5 h-2 bg-green-500 rounded mr-1"></div> 70-100% 완료
                                    </div>
                                    <div className="flex items-center mr-6">
                                        <div className="w-5 h-2 bg-yellow-500 rounded mr-1"></div> 40-69% 완료
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-5 h-2 bg-red-500 rounded mr-1"></div> 0-39% 완료
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 오른쪽 - 사이드바 */}
                    <div className="w-full lg:w-1/3 px-2 space-y-5">
                        {/* 학습 위기 경고 */}
                        <div className="bg-white rounded shadow">
                            <div className="p-4 border-b">
                                <h2 className="text-lg font-bold text-gray-800">학습 위기 경고</h2>
                            </div>
                            <div className="p-4 bg-red-50 text-red-700 text-sm space-y-2">
                                <div className="bg-red-200 p-2 rounded">박치과: 3회 연속 오답 (신경계) - 72h 내 개입 권장</div>
                                <div className="bg-red-200 p-2 rounded">박치과: 학습 시간 30% 감소 - 위험 수준</div>
                            </div>
                        </div>

                        {/* 개인-집단 비교 */}
                        <div className="bg-white rounded shadow">
                            <div className="p-4 border-b">
                                <h2 className="text-lg font-bold text-gray-800">학급 평균 대비 개인 성적</h2>
                            </div>

                            <div className="p-4 bg-gray-50 relative h-32">
                                <div className="absolute top-1/2 w-[90%] border-t-2 border-dashed border-gray-500 z-0"></div>
                                <div className="absolute top-2 left-1/2 text-xs text-gray-500 transform -translate-x-1/2 z-10">학급 평균</div>
                                <div className="flex justify-around items-end h-full pt-5">
                                    {[45, 35, 50, 10, 40].map((val, idx) => (
                                        <div key={idx} className="flex flex-col items-center">
                                            <div
                                                className={`w-6 rounded-t ${val < 20 ? 'bg-red-500' : 'bg-indigo-200'}`}
                                                style={{ height: `${val}px` }}
                                            ></div>
                                            <div className="text-[10px] mt-1 text-gray-600">
                                                {["김의대", "이간호", "최물리", "박치과", "정작업"][idx]}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>



                        </div>
                    </div>
                </div>

                {/* 하단 - 리포트 및 과제 */}
                <div className="flex flex-wrap -mx-2 mt-5">
                    {/* 리포트 */}
                    <div className="w-full lg:w-2/3 px-2">
                        <div className="bg-white rounded shadow">
                            <div className="p-4 border-b">
                                <h2 className="text-lg font-bold text-gray-800">주간 요약 리포트</h2>
                            </div>
                            <div className="p-4 grid grid-cols-[1fr_1px_1fr] gap-5">
                                <div>
                                    <div className="text-sm font-bold mb-2 text-gray-700">상위 3개 취약 유형:</div>
                                    <ul className="list-disc ml-5 text-xs text-gray-600 space-y-1">
                                        <li>신경계 (학급 평균 정답률 58%)</li>
                                        <li>임상해부학 (학급 평균 정답률 62%)</li>
                                        <li>순환계 (학급 평균 정답률 65%)</li>
                                    </ul>
                                </div>
                                <div className="bg-gray-300 w-px"></div>
                                <div>
                                    <div className="text-sm font-bold mb-2 text-gray-700">권장 교수법:</div>
                                    <ul className="list-disc ml-5 text-xs text-gray-600 space-y-1">
                                        <li>신경계 핵심 개념 소그룹 토론</li>
                                        <li>임상 사례 중심 학습 활동 강화</li>
                                        <li>해부 실습과 연계한 순환계 복습</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 과제 생성 */}
                    <div className="w-full lg:w-1/3 px-2">
                        <div className="bg-white rounded shadow">
                            <div className="p-4 border-b">
                                <h2 className="text-lg font-bold text-gray-800">맞춤형 과제 생성</h2>
                            </div>
                            <div className="p-4 space-y-2">
                                <div className="bg-indigo-100 text-indigo-800 p-2 rounded text-xs">신경계 취약점 보충 문제 (25문항)</div>
                                <div className="bg-indigo-100 text-indigo-800 p-2 rounded text-xs">임상해부학 사례 분석 과제 (10문항)</div>
                                <div className="flex justify-between mt-3">
                                    <button className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded">과제 생성</button>
                                    <button className="bg-gray-300 text-gray-800 text-xs font-bold px-4 py-2 rounded">맞춤 설정</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </main>
    );
};

export default dashboard;