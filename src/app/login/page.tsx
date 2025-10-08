"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Lottie from "lottie-react";
import ecgAnimation from "@/assets/animations/ECG.json";

export default function MedGenieLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showSignupSuggestion, setShowSignupSuggestion] = useState(false);
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShowSignupSuggestion(false);

    const result = await login(email, password);

    if (result.success) {
      router.push("/homepage");
    } else {
      setError(result.message);

      // Check if the error suggests the user doesn't exist
      if (
        result.message.toLowerCase().includes("invalid email") ||
        result.message.toLowerCase().includes("user not found") ||
        result.message.toLowerCase().includes("no user found") ||
        result.message.toLowerCase().includes("account not found")
      ) {
        setShowSignupSuggestion(true);
      }
    }
  };

  const handleGoogleLogin = () => {
    router.push("/api/auth/google"); // redirect to Google auth
  };

  const handleSignupRedirect = () => {
    // Pass the email and a flag to indicate they came from login
    const params = new URLSearchParams();
    if (email) {
      params.set("email", email);
    }
    params.set("from", "login");
    router.push(`/sign-up?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black via-[#0a0f14] to-black p-4">
      <div className="w-full max-w-md p-8 rounded-2xl border border-[#3FB5F440] backdrop-blur-lg bg-black/10 shadow-lg">
        <div className="flex justify-center mb-6">
          {/*Added the heart rate animation to look decent login page*/}
          <Lottie
            animationData={ecgAnimation}
            loop={true}
            className="w-40 h-24"
          />
        </div>

        <h2 className="text-3xl font-bold text-center mb-2 text-white">
          MedGenie Login
        </h2>
        <p className="text-white/70 text-center mb-8 text-sm">
          Sign in to access your AI-powered health assistant
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400 text-sm text-center">{error}</p>
            {showSignupSuggestion && (
              <div className="mt-3 pt-3 border-t border-red-500/20">
                <p className="text-white/70 text-xs text-center mb-2">
                  Don't have an account with this email?
                </p>
                <button
                  onClick={handleSignupRedirect}
                  className="w-full py-2 bg-[#3FB5F4]/20 hover:bg-[#3FB5F4]/30 text-[#3FB5F4] text-sm font-medium rounded-lg transition border border-[#3FB5F4]/30"
                >
                  Create Account Instead
                </button>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
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

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-[#3FB5F4] w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#3FB5F4] hover:bg-[#35a5e0] text-black font-semibold rounded-xl shadow-lg transition disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="px-3 text-white/50 text-xs">OR</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 flex items-center justify-center gap-2 bg-white text-black font-semibold rounded-xl shadow-lg hover:bg-gray-200 transition"
        >
          <img
            src="/images/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        {/* Footer */}
        <p className="text-center text-white/60 text-sm mt-6">
          Don't have an account?{" "}
          <a href="/sign-up" className="text-[#3FB5F4] hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
