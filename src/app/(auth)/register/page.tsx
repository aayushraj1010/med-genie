"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new sign-up page
    router.replace('/sign-up');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-[#0a0f14] to-black">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3FB5F4] mx-auto mb-4"></div>
        <p className="text-white/70">Redirecting...</p>
      </div>
    </div>
  );
}
