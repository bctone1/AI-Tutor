"use client";

import React, { useState, useEffect } from 'react';

import Hearder from '@/components/professorHeader';
import ProfessorDashboard from '@/components/professorDashboard';
import Upload from '@/components/ProfessorUploadPage';



export default function Main() {
    const [view, setView] = useState('dashboard');


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
                <Upload />
            )}

        </div>
    );
};


