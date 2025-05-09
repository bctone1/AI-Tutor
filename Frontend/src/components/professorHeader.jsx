import React from 'react';

const Header = ({ setView }) => {


    return (
        <header className="bg-[#3f51b5] text-white p-5 flex justify-between items-center">
            <div className="text-2xl font-bold">AI Tutor - 교수자 모드</div>
            <nav>
                <ul className="flex space-x-5 text-sm">
                    <li><a onClick={() => setView('dashboard')} className="cursor-pointer">전체 현황</a></li>
                    <li><a onClick={() => setView('upload')} className="cursor-pointer">데이터 추가</a></li>
                    <li><a onClick={() => setView('')} className="cursor-pointer">개인별 분석</a></li>
                    <li><a onClick={() => setView('')} className="cursor-pointer">리포트</a></li>
                    <li><a onClick={() => setView('')} className="cursor-pointer">설정</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;