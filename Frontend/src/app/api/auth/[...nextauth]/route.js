import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import GoogleProvider from "next-auth/providers/google";
import NaverProvider from 'next-auth/providers/naver';
import KakaoProvider from "next-auth/providers/kakao";
import axios from "axios";

export const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET || "",
    }),

    // 최초 로그인
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          if (res.status === 200) {
            console.log(res.data);
            return {
              id: res.data.id,
              name: res.data.name,
              email: res.data.email,
              message: res.data.message,
              role: res.data.role,
              major: res.data.major,
              grade: res.data.grade,
              testscore: res.data.testscore,
            };
          }
          return null;
        } catch (error) {
          console.error("에러 발생:", error);
          throw new Error("Invalid credentials");
        }
      },
    }),

    // 두 번째 credentials2 프로필 업데이트
    CredentialsProvider({
      id: "credentials2",
      name: "Credentials2",
      credentials: {
        email: { label: "Email", type: "text" },
        major: { label: "major", type: "text" },
        grade: { label: "major", type: "number" },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/updateProfile`, {
            email: credentials.email,
            major: credentials.major,
            grade: credentials.grade,
          });

          if (res.status === 200) {
            return {
              id: res.data.id,
              name: res.data.name,
              email: res.data.email,
              message: res.data.message,
              role: res.data.role,
              major: res.data.major,
              grade: res.data.grade,
              testscore: res.data.testscore,
            };
          }
          return null;
        } catch (error) {
          console.error("에러 발생:", error);
          throw new Error("Invalid credentials2");
        }
      },
    }),

    // 두 번째 credentials3 테스트 점수 업데이트
    CredentialsProvider({
      id: "credentials3",
      name: "Credentials3",
      credentials: {
        email: { label: "Email", type: "text" },
        testscore: { label: "testscore", type: "number" },

      },
      async authorize(credentials) {
        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/updateScore`, {
            email: credentials.email,
            testscore: credentials.testscore,

          });

          if (res.status === 200) {
            return {
              id: res.data.id,
              name: res.data.name,
              email: res.data.email,
              message: res.data.message,
              role: res.data.role,
              major: res.data.major,
              grade: res.data.grade,
              testscore: res.data.testscore,
            };
          }
          return null;
        } catch (error) {
          console.error("에러 발생:", error);
          throw new Error("Invalid credentials3");
        }
      },
    }),

  ],


  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },


  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/googlelogin`, {
            email: user.email,
            name: user.name,
            image: user.image,
          });
          if (res.status === 200) {
            user.id = res.data.id;
            user.message = res.data.message;
            user.role = res.data.role;
            user.major = res.data.major;
            user.grade = res.data.grade;
            user.testscore = res.data.testscore;
          }
        } catch (error) {
          console.error("Google 로그인 후 백엔드 전송 실패:", error);
          return false; // 로그인 중단
        }
      }
      if (account.provider === "kakao") {
        console.log(JSON.stringify(user, null, 2));
        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/googlelogin`, {
            email: user.email,
            name: user.name,
            image: user.image,
          });
          if (res.status === 200) {
            user.id = res.data.id;
            user.message = res.data.message;
            user.role = res.data.role;
            user.major = res.data.major;
            user.grade = res.data.grade;
            user.testscore = res.data.testscore;
          }
        } catch (error) {
          console.error("Kakao 로그인 후 백엔드 전송 실패:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.message = user.message;
        token.role = user.role;
        token.major = user.major;
        token.grade = user.grade;
        token.testscore = user.testscore;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.message = token.message;
      session.user.role = token.role;
      session.user.grade = token.grade;
      session.user.major = token.major;
      session.user.testscore = token.testscore;
      return session;
    },
  },

});

export { handler as GET, handler as POST };
