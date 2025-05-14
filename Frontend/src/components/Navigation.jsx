import React from 'react';

const Navigation = ({ view, setView }) => {
  const getLinkClass = (viewName) =>
    view === viewName
      ? "bg-[#5c6bc0] rounded-[10px] font-bold "
      : "text-white hover:underline";


  return (
    <header className="bg-[#3f51b5] text-white  p-5 flex justify-between items-center">
      <div className="text-2xl font-bold">AI Tutor KyungBok</div>
      <nav>
        <ul className="flex space-x-5">
          <li><a onClick={() => setView('dashboard')} className={`${getLinkClass('dashboard')} cursor-pointer p-5`}>대시보드</a></li>
          <li><a onClick={() => setView('leveltest')} className={`${getLinkClass('leveltest')} cursor-pointer p-5`}>레벨 테스트</a></li>
          <li><a onClick={() => setView('active')} className={`${getLinkClass('active')} cursor-pointer p-5`}>학습하기</a></li>
          {/* <li><a onClick={() => setView('study')} className={`${getLinkClass('study')} cursor-pointer`}>학습 하기</a></li> */}
          <li><a onClick={() => setView('profile')} className={`${getLinkClass('profile')} cursor-pointer p-5`}>프로필 설정</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Navigation;