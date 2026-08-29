"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldAlert, ArrowLeft, MailCheck } from "lucide-react";
import { LogoIcon } from "@/components/icons/logo-icon";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("If an account exists with that email, a password reset link has been sent to your inbox.");
      } else {
        setStatus("error");
        setMessage(data.error || "An error occurred. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("A network error occurred. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-200" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-400" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 backdrop-blur-sm">
            <LogoIcon className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-foreground tracking-tight">
          Forgot Password
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Enter your email to receive a reset link.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-card py-8 px-4 shadow-xl border border-border/40 sm:rounded-2xl sm:px-10 backdrop-blur-sm">
          
          {status === "success" ? (
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-2">
                <MailCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Check your email</h3>
              <p className="text-muted-foreground text-sm">{message}</p>
              <Button asChild className="w-full mt-6" variant="outline">
                <Link href="/login">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Return to login
                </Link>
              </Button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {status === "error" && (
                <div className="bg-destructive/15 border border-destructive/30 rounded-lg p-4 flex items-start space-x-3">
                  <ShieldAlert className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive font-medium leading-relaxed">{message}</p>
                </div>
              )}

              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-foreground">
                  Email address
                </Label>
                <div className="mt-1 relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-input rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background/50"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <Button 
                  type="submit" 
                  className="w-full flex justify-center py-2 px-4 shadow-md hover:shadow-lg transition-all duration-200"
                  disabled={status === "loading" || !email}
                >
                  {status === "loading" ? "Sending Link..." : "Send Reset Link"}
                </Button>
              </div>
              
              <div className="flex items-center justify-center mt-6">
                <Link href="/login" className="flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
