"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Hearder from '@/components/professorHeader';
import ProfessorDashboard from '@/components/professorDashboard';
import Upload from '@/components/ProfessorUploadPage';
import Analysis from '@/components/analysis';

export default function Main() {
    const [view, setView] = useState('dashboard');
    const { data: session, status } = useSession();
    const router = useRouter();

    // 로딩 상태 처리
    if (status === "loading") {
        return <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>;
    }

    // 인증되지 않은 상태 처리
    if (status === "unauthenticated") {
        router.replace("/");
        return null;
    }

    // 교수 권한 체크
    if (status === "authenticated" && session?.user?.role !== "professor") {
        router.replace("/");
        return null;
    }

    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            {/* 헤더 */}
            <Hearder
                setView={setView}
            />

            {/* 메인 컨텐츠 */}
            {view === 'dashboard' && session && (
                <ProfessorDashboard
                    userdata={session}
                />
            )}

            {view === 'upload' && session && (
                <Upload
                    userdata={session}
                />
            )}

            {view === 'analysis' && session && (
                <Analysis
                    userdata={session}
                />
            )}
        </div>
    );
};


