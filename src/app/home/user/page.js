"use client";

import React from "react";

export default function AnatomyTestPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <header className="bg-[#3f51b5] text-white p-5 flex justify-between items-center">
        <div className="text-2xl font-bold">AI Tutor KyungBok</div>
        <nav>
          <ul className="flex space-x-5">
            <li><a href="#" className="text-white">대시보드</a></li>
            <li><a href="#" className="text-white">문제 풀이</a></li>
            <li><a href="#" className="text-white">학습 자료</a></li>
            <li><a href="#" className="text-white">설정</a></li>
          </ul>
        </nav>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-5xl mx-auto mt-6 px-5">
        {/* 테스트 제목 */}
        <div className="bg-white rounded shadow p-5 mb-5">
          <h1 className="text-2xl font-bold text-gray-800">해부학 진단 테스트</h1>
        </div>

        {/* 진행 상황 및 타이머 */}
        <div className="flex shadow mb-5">
          <div className="flex-1 h-12 bg-blue-100 flex justify-center items-center text-gray-700 text-base">
            25/50 문항
          </div>
          <div className="w-52 h-12 bg-indigo-100 flex justify-center items-center text-indigo-700 text-base">
            남은 시간: 28:15
          </div>
        </div>

        {/* 유형 배너 */}
        <div className="bg-purple-100 text-purple-700 p-4 rounded mb-5 text-base">
          현재 유형: 신경계 (문항 25-30)
        </div>

        {/* 문제 영역 */}
        <div className="bg-white rounded shadow p-5 mb-5">
          <div className="text-lg font-bold mb-2">문항 25.</div>
          <p className="text-base leading-relaxed mb-4">
            다음 중 제3뇌신경(동안신경, oculomotor nerve)의 기능으로 옳지 않은 것은?
          </p>
          <div className="w-full h-44 border border-gray-300 flex justify-center items-center text-gray-400 mb-5">
            [뇌신경 해부도]
          </div>
        </div>

        {/* 보기 영역 */}
        <div className="bg-white rounded shadow p-5 mb-5 relative">
          {[
            "상사근(superior oblique muscle)의 수축",
            "하직근(inferior rectus muscle)의 수축",
            "내직근(medial rectus muscle)의 수축",
            "동공 수축(pupillary constriction)",
            "상안검거근(levator palpebrae superioris)의 수축"
          ].map((option, index) => (
            <div className="flex items-start mb-4" key={index}>
              <input type="radio" id={`option${index + 1}`} name="answer" className="mt-1 mr-2" />
              <label htmlFor={`option${index + 1}`} className="text-base leading-relaxed">
                {option}
              </label>
            </div>
          ))}

          <div className="absolute top-5 right-5 bg-green-100 text-green-600 py-1 px-3 rounded-full text-sm">
            난이도: 중
          </div>
        </div>

        {/* 네비게이션 버튼 */}
        <div className="flex justify-between">
          <button className="bg-gray-300 text-gray-800 font-bold px-6 py-3 rounded">이전</button>
          <button className="text-gray-600 px-6 py-3">일시정지</button>
          <button className="bg-indigo-600 text-white font-bold px-6 py-3 rounded">다음</button>
        </div>
      </main>
    </div>
  );
}