"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

import Navigation from '@/components/Navigation';
import LevelTest from '@/components/levelTest';
import Dashboard from '@/components/dashboard';
import Active from '@/components/active';
import Profile from '@/components/profile';

export default function AnatomyTestPage() {
  const [view, setView] = useState(undefined);
  const { data: session, status } = useSession();

  // localStorage에서 view 불러오기
  useEffect(() => {
    const savedView = localStorage.getItem("anatomy_view");
    if (savedView) {
      setView(savedView);
    }
  }, []);

  // view 상태가 바뀔 때 localStorage에 저장
  useEffect(() => {
    if (view) {
      localStorage.setItem("anatomy_view", view);
    }
  }, [view]);

  // 세션 상태에 따라 초기 view 설정
  useEffect(() => {
    if (status !== "loading" && session && !view) {
      if (!session?.user?.grade) {
        setView("profile");
      } else if (session?.user?.grade && !session?.user?.testscore) {
        setView('leveltest');
      } else {
        setView("dashboard");
      }
    }
  }, [session, status, view]);


  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation
        view={view}
        setView={setView}
        userdata={session}
      />

      {view === 'leveltest' && (
        <LevelTest
          setView={setView}
          userdata={session}
        />
      )}

      {view === 'dashboard' && (
        <Dashboard
          userdata={session}
          setView={setView}
        />
      )}

      {view === 'active' && (
        <Active
          userdata={session}
        />
      )}

      {view === 'profile' && (
        <Profile
          userdata={session}
          setView={setView}
        />
      )}
    </div>
  );
}
