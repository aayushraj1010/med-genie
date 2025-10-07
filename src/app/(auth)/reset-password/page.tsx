"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, Eye, EyeOff } from "lucide-react";
import Lottie from "lottie-react";
import ecgAnimation from "@/assets/animations/ECG.json";
import { useAuth } from "@/contexts/AuthContext";

export const dynamic = "force-dynamic";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { resetPassword } = useAuth();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      setError("Invalid reset link");
    }
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const result = await resetPassword(
        token,
        email,
        newPassword,
        confirmPassword
      );
      if (result.success) {
        setMessage(
          result.message ||
            "Password successfully reset! Redirecting to login..."
        );
        setTimeout(() => router.push("/login"), 2000);
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
          Reset Password
        </h2>
        <p className="text-white/70 text-center mb-8 text-sm">
          Enter your new password to update your account
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
            <Lock className="absolute left-3 top-3 text-[#3FB5F4] w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:border-[#3FB5F4] outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-white/50 hover:text-white transition"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-[#3FB5F4] w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:border-[#3FB5F4] outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !token || !email}
            className="w-full py-3 bg-[#3FB5F4] hover:bg-[#35a5e0] text-black font-semibold rounded-xl shadow-lg transition disabled:opacity-50"
          >
            {isLoading ? "Updating..." : "Reset Password"}
          </button>
        </form>

        <p className="text-center text-white/60 text-sm mt-6">
          Remembered your password?{" "}
          <a href="/login" className="text-[#3FB5F4] hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
