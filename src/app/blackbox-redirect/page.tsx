"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { SecureTokenStorage } from "@/lib/token-storage";

function BlackboxRedirect() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setAccessToken, setUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get("accessToken");
    const userJson = searchParams.get("user");

    if (token && userJson) {
      const user = JSON.parse(userJson);
      SecureTokenStorage.setTokens(token, "");
      setAccessToken(token);
      sessionStorage.setItem("medgenie_user", JSON.stringify(user));
      setUser(user);
      router.replace("/homepage");
    } else {
      router.replace("/login");
    }
  }, [searchParams, router, setAccessToken, setUser]);

  return <div className="text-black font-lg m-8">Signing you in…</div>;
}

export default function BlackboxRedirectPage() {
  return (
    <Suspense fallback={<div className="text-black font-lg m-8">Preparing redirect...</div>}>
      <BlackboxRedirect />
    </Suspense>
  );
}
