"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const MonthTest = ({ setView, userdata }) => {
  const [selectedMonth, setSelectedMonth] = useState(null);
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
    if (monthId < currentMonth) {
      return 'completed'; // 완료된 달
    } else if (monthId === currentMonth) {
      // 이번 달에 이미 풀었으면 doneCurrent 반환
      if (monthData[monthId]?.completed) {
        return 'doneCurrent';
      }
      return 'current'; // 현재 달
    } else {
      return 'disabled'; // 미래 달
    }
  };

  // 월별 데이터 가져오기 (실제로는 API 호출)
  useEffect(() => {
    // 임시 데이터 - 실제로는 API에서 가져와야 함
    const mockData = {
      1: { completed: true, score: 85, questions: 20, correct: 17 },
      2: { completed: true, score: 78, questions: 20, correct: 15 },
      3: { completed: true, score: 92, questions: 20, correct: 18 },
      4: { completed: true, score: 88, questions: 20, correct: 17 },
      5: { completed: true, score: 95, questions: 20, correct: 19 },
      6: { completed: true, score: 50, questions: 20, correct: 10 },
      7: { completed: false, score: null, questions: 0, correct: 0 },
      8: { completed: false, score: null, questions: 0, correct: 0 },
      9: { completed: false, score: null, questions: 0, correct: 0 },
      10: { completed: false, score: null, questions: 0, correct: 0 },
      11: { completed: false, score: null, questions: 0, correct: 0 },
      12: { completed: false, score: null, questions: 0, correct: 0 }
    };
    setMonthData(mockData);
  }, []);

  const handleMonthClick = (monthId) => {
    const status = getMonthStatus(monthId);
    
    if (status === 'disabled' || status === 'doneCurrent') {
      return; // 미래 달 또는 이번 달 이미 응시한 경우 클릭 불가
    }
    
    if (status === 'current') {
      setSelectedMonth(monthId);
      // 여기서 해당 월의 테스트 페이지로 이동하거나 모달을 열 수 있음
      console.log(`${monthId}월 테스트 시작`);
    } else if (status === 'completed') {
      // 완료된 달의 결과 보기
      console.log(`${monthId}월 결과 보기`);
    }
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
          <div className="text-center">
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
              아직 오지 않은 달
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {currentYear}년 월별 테스트
          </h1>
          <p className="text-gray-600">
            매월 진행되는 월별 테스트를 확인하고 참여하세요
          </p>
        </div>

        {/* 월별 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
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

        {/* 선택된 월 정보 */}
        {selectedMonth && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {selectedMonth}월 테스트 정보
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">30</div>
                <div className="text-sm text-gray-600">총 문제 수</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">30</div>
                <div className="text-sm text-gray-600">제한 시간(분)</div>
              </div>
              
            </div>
            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={() => {
                  // 여기서 실제 테스트 시작 로직 구현
                  console.log(`${selectedMonth}월 테스트 시작`);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                테스트 시작
              </button>
              <button
                onClick={() => setSelectedMonth(null)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        )}

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

        {/* 뒤로가기 버튼 */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setView('dashboard')}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            대시보드로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default MonthTest; 