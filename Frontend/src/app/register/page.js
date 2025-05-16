'use client';

import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";

export default function Register() {

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


    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        emailCode: '',
        phone: '',
        phoneCode: '',
        grade: '',
        major: '',

    });

    const [emailVerified, setEmailVerified] = useState(false);
    const [secretCode, setSecretCode] = useState('');
    const [checkinfo, setCheckinfo] = useState(false);
    const handleCheckboxChange = (e) => {
        setCheckinfo(e.target.checked);
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const checkemailcode = async () => {
        const { emailCode, } = formData;

        if (!emailVerified) {
            alert('Please verify your email.');
            return;
        }
        if (emailCode !== secretCode) {
            alert('Invalid email verification code.');
            return;
        }
        alert('확인되었습니다!');
        setEmailVerified(false);


    }

    const handleEmailVerification = async () => {
        const email = formData.email;
        if (!email) {
            alert("Please verify your email.");
            return;
        }

        try {
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            setSecretCode(code);
            console.log(code);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/sendEmail`, {
                email: formData.email,
                secretCode: code,
            });
            if (response.status === 200) {
                alert(response.data.message);
                setEmailVerified(true);
            }
        } catch (error) {
            console.error('Error sending email:', error);
            alert('An error occurred while sending the verification email.');
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, confirmPassword, emailCode, phone, phoneCode, grade, major } = formData;
        if (!name || !email || !password || !emailCode || !emailVerified) {
            alert('All fields are required.');
            return;
        }
        // if (password !== confirmPassword) {
        //     alert('Passwords do not match.');
        //     return;
        // }
        // if (!emailVerified) {
        //     alert('Please verify your email.');
        //     return;
        // }
        if (emailCode !== secretCode) {
            alert('Invalid email verification code.');
            return;
        }
        if(!checkinfo){
            alert("개인정보 처림방침 동의해주세요.");
            return;
        }




        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/register`, formData);
            if (response.status === 200) {
                alert('Registration successful!');
                router.push("/login");
            }
        } catch (error) {
            console.error('Error registering:', error);
            alert('An error occurred during registration.');
        }
    };

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center text-3xl text-blue-500">AI Tutor</CardTitle>
                        <CardDescription className="text-center">AI 기반 학습 플랫폼</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label>이름</Label>
                                <Input type="text" name="name" placeholder="이름을 입력하세요" value={formData.name} onChange={handleChange} required />
                            </div>

                            <Label>이메일</Label>
                            <div className='flex w-full items-center gap-2'>
                                <Input
                                    type="email"
                                    placeholder="이메일을 입력하세요"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="h-10"
                                />
                                <Button
                                    type="button"
                                    onClick={handleEmailVerification}
                                    disabled={emailVerified}
                                    className="bg-gray-300 text-black px-4 hover:text-white"
                                >
                                    인증번호 발송
                                </Button>
                            </div>

                            <Label>이메일 인증번호</Label>
                            <div className='flex w-full items-center gap-2'>
                                <Input type="text" name="emailCode" value={formData.emailCode} onChange={handleChange} placeholder="인증번호를 입력하세요" />
                                <Button
                                    type="button"
                                    onClick={checkemailcode}
                                    disabled={!emailVerified}
                                    className="bg-gray-300 text-black px-4 hover:text-white"
                                >
                                    확인
                                </Button>
                            </div>

                            <div>
                                <Label>비밀번호</Label>
                                <Input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="비밀번호를 입력하세요" required />
                            </div>



                            <div>
                                <Label htmlFor="grade">학년</Label>
                                <select id="grade" name="grade" className="border rounded px-3 py-2 w-full border-gray-200">
                                    <option>학년을 선택하세요</option>
                                    <option value="1">1학년</option>
                                    <option value="2">2학년</option>
                                    <option value="3">3학년</option>
                                </select>
                            </div>

                            <div>
                                <Label htmlFor="major">학과</Label>
                                <select id="major" name="major" className="border rounded px-3 py-2 w-full border-gray-200">
                                    <option>학과을 선택하세요</option>
                                    <option value="물리치료학과">물리치료학과</option>
                                    <option value="직업치료학과">직업치료학과</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-1">
                                <input
                                    type="checkbox"
                                    id="auto-login"
                                    checked={checkinfo}
                                    onChange={handleCheckboxChange}
                                />
                                <label htmlFor="auto-login" className="text-sm">이용약관 및 개인정보 처리방침에 동의합니다</label>
                            </div>

                            <Button type="submit" className="w-full bg-blue-500">회원가입</Button>

                            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:border-t after:border-gray-300">
                                <span className="relative z-10 bg-white px-2 text-gray-500">또는</span>
                            </div>

                            <div className="flex flex-col gap-4">

                                <Button variant="outline" className="bg-[#ffca28] text-black" onClick={handleKakaoLogin}>
                                    카카오 계정으로 로그인
                                </Button>


                                <Button variant="outline" className="bg-gray-300 text-black" onClick={handleGoogleLogin}>
                                    구글 계정으로 로그인
                                </Button>
                            </div>

                            <div className="text-center text-sm">
                                이미 계정이 있으신가요?{" "}
                                <a
                                    className="text-sm text-blue-500 cursor-pointer"
                                    onClick={() => window.location = "/register"}
                                >
                                    로그인
                                </a>

                            </div>

                        </form>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
