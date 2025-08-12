"use client";

import { useEffect, useState } from "react";
import { User, Mail, Lock } from "lucide-react";

export default function MedGenieRegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setShowForm(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Account created successfully!");
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black via-[#0a0f14] to-black p-4">
      <div
        className={`w-full max-w-md p-8 rounded-2xl border border-[#3FB5F440] backdrop-blur-lg bg-black/10 shadow-lg transform transition-all duration-700 ease-out ${
          showForm ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h2 className="text-3xl font-bold text-center mb-2 text-white">
          Create MedGenie Account
        </h2>
        <p className="text-white/70 text-center mb-8 text-sm">
          Join us and start using your AI-powered health assistant
        </p>

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
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:border-[#3FB5F4] outline-none transition"
            />
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-[#3FB5F4] w-5 h-5" />
            <input
              type="password"
              required
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:border-[#3FB5F4] outline-none transition"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#3FB5F4] hover:bg-[#35a5e0] text-black font-semibold rounded-xl shadow-lg transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-white/60 text-sm mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-[#3FB5F4] hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
