"use client";

import { Suspense,useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { SecureTokenStorage } from "@/lib/token-storage";

function GoogleRedirect() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setAccessToken, setUser } = useAuth(); 

  useEffect(() => {
    const token = searchParams.get("accessToken");
    const userJson = searchParams.get("user");

    if (token && userJson) {
      const user = JSON.parse(userJson);

      // Store tokens in your secure storage
      SecureTokenStorage.setTokens(token, ""); 
      setAccessToken(token);
      sessionStorage.setItem('medgenie_user', JSON.stringify(user));
      setUser(user);
      router.replace("/homepage"); // redirect after login
    } else {
      router.replace("/login");
    }
  }, [searchParams, router, setAccessToken, setUser]);

  return <div className="text-black font-lg m-8">Logging you in…</div>;
}

// This is the component Next.js attempts to pre-render.
export default function GoogleRedirectPage() {
  return (
    <Suspense fallback={<div className="text-black font-lg m-8">Preparing redirect...</div>}>
      <GoogleRedirect /> 
    </Suspense>
  );
}
