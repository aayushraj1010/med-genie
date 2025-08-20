"use client";

import { useEffect, useState, Suspense } from "react";
import { User, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { PasswordStrengthIndicator } from "@/components/password-strength-indicator";
import Lottie from "lottie-react";
import ecgAnimation from "@/assets/animations/ECG.json";

function MedGenieRegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [isFromLogin, setIsFromLogin] = useState(false);
  const { register, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if user came from login page and pre-fill email if provided
    const emailFromParams = searchParams.get('email');
    const fromLogin = searchParams.get('from') === 'login';

    if (emailFromParams) {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(emailFromParams)) {
        setEmail(emailFromParams);
      }
    }

    if (fromLogin) {
      setIsFromLogin(true);
    }

    // Trigger animation after mount
    const timer = setTimeout(() => setShowForm(true), 50);
    return () => clearTimeout(timer);
  }, [searchParams]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const result = await register(username, email, password, confirmPassword);

    if (result.success) {
      router.push("/homepage");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black via-[#0a0f14] to-black p-4">
      {/* ECG Animation */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 opacity-30">
        <Lottie
          animationData={ecgAnimation}
          loop={true}
          style={{ width: 264, height: 126 }}
        />
      </div>

      <div
        className={`w-full max-w-md p-8 rounded-2xl border border-[#3FB5F440] backdrop-blur-lg bg-black/10 shadow-lg transform transition-all duration-700 ease-out ${showForm ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
      >
        <h2 className="text-3xl font-bold text-center mb-2 text-white">
          {isFromLogin ? "Create Your Account" : "Create MedGenie Account"}
        </h2>
        <p className="text-white/70 text-center mb-8 text-sm">
          {isFromLogin
            ? "It looks like you don't have an account yet. Let's create one!"
            : "Join us and start using your AI-powered health assistant"
          }
        </p>

        {isFromLogin && (
          <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <p className="text-blue-400 text-sm text-center">
              💡 We couldn't find an account with that email. Create a new account to get started!
            </p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          {/* Username */}
          <div className="relative">
            <User className="absolute left-3 top-3 text-[#3FB5F4] w-5 h-5" />
            <input
              type="text"
              required
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:border-[#3FB5F4] outline-none transition"
            />
          </div>

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
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {password && <PasswordStrengthIndicator password={password} />}

          {/* Password Requirements */}
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-[#3FB5F4]" />
              <span className="text-sm font-medium text-white/80">Password Requirements</span>
            </div>
            <ul className="text-xs text-white/60 space-y-1">
              <li>• At least 12 characters long</li>
              <li>• One uppercase letter (A-Z)</li>
              <li>• One lowercase letter (a-z)</li>
              <li>• One number (0-9)</li>
              <li>• One special character (!@#$%^&*)</li>
              <li>• No common patterns or sequences</li>
            </ul>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-[#3FB5F4] w-5 h-5" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              required
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:border-[#3FB5F4] outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-white/50 hover:text-white transition"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#3FB5F4] hover:bg-[#35a5e0] text-black font-semibold rounded-xl shadow-lg transition disabled:opacity-50"
          >
            {isLoading ? "Creating account..." : "Register"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-white/60 text-sm mt-6">
          {isFromLogin ? (
            <>
              Remember your password?{" "}
              <a href="/login" className="text-[#3FB5F4] hover:underline">
                Back to Login
              </a>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <a href="/login" className="text-[#3FB5F4] hover:underline">
                Login
              </a>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

// Loading component for Suspense
function SignUpLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black via-[#0a0f14] to-black">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3FB5F4] mx-auto mb-4"></div>
        <p className="text-white/70">Loading...</p>
      </div>
    </div>
  );
}

// Main component with Suspense wrapper
export default function SignUpPage() {
  return (
    <Suspense fallback={<SignUpLoading />}>
      <MedGenieRegisterForm />
    </Suspense>
  );
}
