// app/layout.js
"use client";  // 이 줄을 추가하여 해당 파일을 클라이언트 컴포넌트로 처리

import { SessionProvider } from "next-auth/react";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <SessionProvider>
      <html lang="ko">
        <body>
          {/* 레이아웃의 다른 공통 부분들 */}
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


