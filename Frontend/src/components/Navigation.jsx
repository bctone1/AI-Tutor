import React from 'react';

const Navigation = ({ view, setView, userdata }) => {
  const getLinkClass = (viewName) =>
    view === viewName
      ? "bg-[#5c6bc0] rounded-[10px] font-bold "
      : "text-white hover:underline";

  const handleActiveClick = () => {
    if (!userdata?.user?.testscore) {
      alert("레벨테스트를 먼저 실행해주세요.");
    } else {
      setView('active');
    }
  };
  const handleLeveltestClick = () => {
    if (!userdata?.user?.major) {
      alert("프로필을 완성해주세요.");
    } else if (userdata?.user?.testscore) {
      alert("레벨테스트를 이미 완료했습니다.");

    } else {
      setView('leveltest');
    }
  }

  return (
    <header className="bg-[#3f51b5] text-white  p-5 flex justify-between items-center">
      <div className="text-2xl font-bold">AI Tutor KyungBok</div>
      <nav>
        <ul className="flex space-x-5">
          <li>
            <a
              // onClick={() => setView('leveltest')}
              onClick={handleLeveltestClick}
              className={`${getLinkClass('leveltest')} cursor-pointer p-5`}
            >
              레벨 테스트
            </a>
          </li>
          <li>
            <a
              onClick={() => setView('dashboard')}
              className={`${getLinkClass('dashboard')} cursor-pointer p-5`}
            >
              대시보드
            </a>
          </li>

          <li>
            <a
              onClick={handleActiveClick}
              className={`${getLinkClass('active')} cursor-pointer p-5`}
            >
              학습하기
            </a>
          </li>
          <li>
            <a
              onClick={() => setView('profile')}
              className={`${getLinkClass('profile')} cursor-pointer p-5`}
            >
              프로필
            </a>
          </li>
          <li>
            <a
              onClick={() => setView('setting')}
              className={`${getLinkClass('setting')} cursor-pointer p-5`}
            >
              설정
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navigation;
