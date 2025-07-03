"use client"
import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

import Navigation from '@/components/Navigation';
import LevelTest from '@/components/levelTest';
import Dashboard from '@/components/dashboard';
import Active from '@/components/active';
import Profile from '@/components/profile';
import MonthTest from '@/components/monthTest';

export default function Userpage() {
  const [view, setView] = useState();
  const { data: session, status } = useSession();
  
  useEffect(() => {
    if (status !== "loading" && !view) {
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
      <Navigation view={view} setView={setView} userdata={session} />

      {view === 'monthtest' && (
        <MonthTest setView={setView} userdata={session} />
      )}

      {view === 'leveltest' && (
        <LevelTest setView={setView} userdata={session} />
      )}
      {view === 'dashboard' && (
        <Dashboard setView={setView} userdata={session} />
      )}
      {view === 'active' && (
        <Active userdata={session} />
      )}
      {view === 'profile' && (
        <Profile setView={setView} userdata={session} />
      )}
    </div>
  );
}
