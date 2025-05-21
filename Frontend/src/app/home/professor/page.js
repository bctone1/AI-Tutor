"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Hearder from '@/components/professorHeader';
import ProfessorDashboard from '@/components/professorDashboard';
import Upload from '@/components/ProfessorUploadPage';




export default function Main() {
    const [view, setView] = useState('dashboard');
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            if (session?.user?.role !== "professor") {
                alert("접근권한이 없습니다!");
                router.replace("/");
            }
        }
    }, [status, session, router]);


    return (
        <div className="bg-gray-100 min-h-screen font-sans">

            {/* 헤더 */}
            <Hearder
                setView={setView}
            />

            {/* 메인 컨텐츠 */}
            {view === 'dashboard' && (
                <ProfessorDashboard />
            )}

            {view === 'upload' && (
                <Upload
                    userdata={session}
                />
            )}

        </div>
    );
};


