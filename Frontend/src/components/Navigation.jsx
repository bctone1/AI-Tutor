import React from 'react';

const Navigation = ({ setView }) => {


  return (
    <header className="bg-[#3f51b5] text-white p-5 flex justify-between items-center">
      <div className="text-2xl font-bold">AI Tutor KyungBok</div>
      <nav>
        <ul className="flex space-x-5">
          <li><a onClick={() => setView('leveltest')} className="text-white cursor-pointer">레벨 테스트</a></li>
          <li><a onClick={() => setView('dashboard')} className="text-white cursor-pointer">대시보드</a></li>
          <li><a onClick={() => setView('active')} className="text-white cursor-pointer">문제 풀이</a></li>
          <li><a onClick={() => setView('')} className="text-white cursor-pointer">학습 하기</a></li>
          <li><a onClick={() => setView('')} className="text-white cursor-pointer">프로필 설정</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Navigation;