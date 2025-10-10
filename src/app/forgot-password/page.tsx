"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import Lottie from "lottie-react";
import ecgAnimation from "@/assets/animations/ECG.json";
import { useAuth } from "@/contexts/AuthContext";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { requestPasswordReset } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    // Frontend email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      const result = await requestPasswordReset(email);
      if (result.success) {
        setMessage(
          result.message || "Password reset link sent! Check your email."
        );
        // Optional: redirect to login after 5 seconds
        setTimeout(() => router.push("/login"), 5000);
      } else {
        setError(result.message || "Something went wrong");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black via-[#0a0f14] to-black p-4">
      <div className="w-full max-w-md p-8 rounded-2xl border border-[#3FB5F440] backdrop-blur-lg bg-black/10 shadow-lg">
        <div className="flex justify-center mb-6">
          <Lottie animationData={ecgAnimation} loop className="w-40 h-24" />
        </div>

        <h2 className="text-3xl font-bold text-center mb-2 text-white">
          Forgot Password
        </h2>
        <p className="text-white/70 text-center mb-8 text-sm">
          Enter your email to receive a password reset link
        </p>

        {message && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-center text-sm">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-[#3FB5F4] w-5 h-5" />
            <input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:border-[#3FB5F4] outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#3FB5F4] hover:bg-[#35a5e0] text-black font-semibold rounded-xl shadow-lg transition disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-white/60 text-sm mt-6">
          Remember your password?{" "}
          <a href="/login" className="text-[#3FB5F4] hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
