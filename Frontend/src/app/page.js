"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';

export default function LoginPage({ className }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();



  const handleLogin = async () => {
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    // console.log(result);
    if (result?.error) {
      alert("회원정보가 없습니다.");
    } else {
      const res = await fetch("/api/auth/session");
      const session = await res.json();
      if (session?.user?.role === "admin") {
        router.push("/home/admin");
      } else if (session?.user?.role === "user") {
        router.push("/home/user");
      }
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", {
      callbackUrl: "/home/user",
    });
  };

  const handleKakaoLogin = () => {
    signIn("kakao", {
      callbackUrl: "/home/user",
    });
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">

        <div className={cn("flex flex-col gap-6", className)}>
          <Card>
            <CardHeader className="text-center mt-10">
              <CardTitle className="text-3xl text-blue-500">AI Tutor</CardTitle>
              <CardDescription className="text-black"> AI 기반 학습 플랫폼</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid gap-6">


                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="email">이메일</Label>
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="이메일 주소를 입력하세요"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleLogin();
                        }
                      }}
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">비밀번호</Label>
                    </div>
                    <Input
                      type="password"
                      placeholder="비밀번호를 입력하세요"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleLogin();
                        }
                      }}
                    />

                  </div>

                  <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                      <input type="checkbox" id="auto-login" />
                      <label htmlFor="auto-login" className="text-sm">자동 로그인</label>
                    </div>
                    <span className="text-sm text-blue-500 cursor-pointer">비밀번호 찾기</span>
                  </div>


                  <Button type="submit" className="w-full bg-blue-500 cursor-pointer" onClick={handleLogin}>
                    로그인
                  </Button>
                </div>

                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:border-t after:border-gray-300">
                  <span className="relative z-10 bg-white px-2 text-gray-500">또는</span>
                </div>

                <div className="flex flex-col gap-4">

                  <Button variant="outline" className="bg-[#ffca28] text-white cursor-pointer" onClick={handleKakaoLogin}>
                    카카오 계정으로 로그인
                  </Button>


                  <Button variant="outline" className="bg-gray-300 text-white cursor-pointer" onClick={handleGoogleLogin}>
                    구글 계정으로 로그인
                  </Button>
                </div>

                <div className="text-center text-sm mb-10">
                  계정이 없으신가요?{" "}
                  <a
                    className="text-sm text-blue-500 cursor-pointer"
                    onClick={() => window.location = "/register"}
                  >
                    회원가입
                  </a>

                </div>
              </div>

            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}