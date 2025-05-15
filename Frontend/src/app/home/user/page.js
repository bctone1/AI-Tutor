"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

import Navigation from '@/components/Navigation';
import LevelTest from '@/components/levelTest';
import Dashboard from '@/components/dashboard';
import Active from '@/components/active';
import Profile from '@/components/profile';



export default function AnatomyTestPage() {
  const [view, setView] = useState();
  const { data: session, status } = useSession();
  // const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // if (status === "authenticated") {
    //   setUserInfo(session);
    // }

    if (status !== "loading") {
      if (session?.user?.testscore === "") {
        setView("profile");
      } else {
        setView("dashboard");
      }
    }
  }, [session, status]);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* 헤더 */}
      <Navigation
        view={view}
        setView={setView}
        userdata={session}
      />

      {/* 메인 컨텐츠 */}
      {view === 'leveltest' && (
        <LevelTest
          setView={setView}
          userdata={session}
        />
      )}

      {view === 'dashboard' && (
        <Dashboard
          userdata={session}
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
          // setUserInfo={setUserInfo}
        />
      )}

    </div>
  );
}