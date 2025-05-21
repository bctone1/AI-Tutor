"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RedirectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      const role = session?.user?.role;

      if (role === "professor") {
        router.replace("/home/professor");
      } else {
        router.replace("/home/user");
      }
    } else if (status === "unauthenticated") {
      // 로그인 실패 시
      router.replace("/login");
    }
  }, [status, session, router]);

  return (
    <div className="flex justify-center items-center h-screen text-lg">
      로그인 중입니다...
    </div>
  );
}
