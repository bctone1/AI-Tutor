import React from 'react';
import { signOut } from "next-auth/react";

const Header = ({ setView }) => {


    return (
        <header className="bg-[#3f51b5] text-white p-5 flex justify-between items-center">
            <div className="text-2xl font-bold">AI Tutor - 교수자 모드</div>
            <nav className="flex items-center">
                <ul className="flex space-x-5">
                    <li><a onClick={() => setView('dashboard')} className="cursor-pointer">전체 현황</a></li>
                    <li><a onClick={() => setView('upload')} className="cursor-pointer">데이터 추가</a></li>
                    <li><a onClick={() => setView('analysis')} className="cursor-pointer">개인별 분석</a></li>
                    {/* <li><a onClick={() => setView('')} className="cursor-pointer">리포트</a></li> */}
                    <li><a onClick={() => setView('')} className="cursor-pointer">설정</a></li>
                </ul>
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded ml-6 cursor-pointer"
                >
                    로그아웃
                </button>

            </nav>

        </header>
    );
};

export default Header;