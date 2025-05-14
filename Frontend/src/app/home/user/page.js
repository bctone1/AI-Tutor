"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

import Navigation from '@/components/Navigation';
import LevelTest from '@/components/levelTest';
import Dashboard from '@/components/dashboard';
import Active from '@/components/active';
import Profile from '@/components/profile';



export default function AnatomyTestPage() {
  const [view, setView] = useState('leveltest');
  const { data: session } = useSession();
  // console.log(session);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* 헤더 */}
      <Navigation
        view={view}
        setView={setView}
      />

      {/* 메인 컨텐츠 */}
      {view === 'leveltest' && (
        <LevelTest
          setView={setView}
          userdata={session}
        />
      )}

      {view === 'dashboard' && (
        <Dashboard />
      )}

      {view === 'active' && (
        <Active />
      )}

      {view === 'profile' && (
        <Profile />
      )}

    </div>
  );
}