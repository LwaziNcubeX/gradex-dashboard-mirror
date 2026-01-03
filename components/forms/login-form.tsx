"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircle,
  Loader2,
  Mail,
  KeyRound,
  ArrowLeft,
  GraduationCap,
} from "lucide-react";

type LoginStep = "email" | "otp";

export function LoginForm() {
  const router = useRouter();
  const {
    requestOtp,
    login,
    isLoading,
    error,
    clearError,
    isAuthenticated,
    user,
  } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const [step, setStep] = useState<LoginStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      setIsRedirecting(true);
      router.push("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  if (isAuthenticated || isRedirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email.trim()) {
      setLocalError("Please enter your email");
      return;
    }

    try {
      await requestOtp(email);
      setStep("otp");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send OTP";
      setLocalError(message);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!otp.trim() || otp.length !== 6) {
      setLocalError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      await login(email, otp);
      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setLocalError(message);
    }
  };

  const displayError = error || localError;

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/20 backdrop-blur-sm">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">GradeX</h1>
              <p className="text-sm text-primary-foreground/80">Admin Portal</p>
            </div>
          </div>

          <div className="space-y-6">
            <blockquote className="space-y-2">
              <p className="text-lg font-medium leading-relaxed text-black">
                "GradeX has transformed how we manage our educational content.
                The admin dashboard makes quiz management effortless."
              </p>
              <footer className="text-sm text-primary-foreground/70">
                - Education Administrator
              </footer>
            </blockquote>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary-foreground/60" />
                <span className="text-primary-foreground/80">
                  Quiz Management
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary-foreground/60" />
                <span className="text-primary-foreground/80">
                  Student Analytics
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary-foreground/60" />
                <span className="text-primary-foreground/80">
                  Progress Tracking
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">GradeX</h1>
              <p className="text-xs text-muted-foreground">Admin Portal</p>
            </div>
          </div>

          <Card className="border-0 shadow-none lg:border lg:shadow-sm">
            <CardHeader className="space-y-1 px-0 lg:px-6">
              <CardTitle className="text-2xl font-semibold tracking-tight">
                {step === "email" ? "Welcome back" : "Enter verification code"}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {step === "email"
                  ? "Sign in to access your admin dashboard"
                  : `We sent a 6-digit code to ${email}`}
              </CardDescription>
            </CardHeader>

            <CardContent className="px-0 lg:px-6">
              {displayError && (
                <div className="mb-6 flex items-center gap-3 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span>{displayError}</span>
                </div>
              )}

              {step === "email" ? (
                <form onSubmit={handleRequestOtp} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@gradex.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        required
                        className="pl-10 h-11"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      We'll send you a secure login code
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 font-medium"
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isLoading ? "Sending code..." : "Continue with Email"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="otp" className="text-sm font-medium">
                      Verification Code
                    </Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="otp"
                        type="text"
                        placeholder="000000"
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        disabled={isLoading}
                        maxLength={6}
                        inputMode="numeric"
                        required
                        className="pl-10 h-11 text-center text-lg tracking-[0.5em] font-mono"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Code expires in 5 minutes
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Button
                      type="submit"
                      className="w-full h-11 font-medium"
                      disabled={isLoading}
                    >
                      {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {isLoading ? "Verifying..." : "Sign In"}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full h-11"
                      onClick={() => {
                        setStep("email");
                        setOtp("");
                        setLocalError(null);
                        clearError();
                      }}
                      disabled={isLoading}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Use different email
                    </Button>
                  </div>
                </form>
              )}

              <div className="mt-8 text-center">
                <p className="text-xs text-muted-foreground">
                  By signing in, you agree to our Terms of Service and Privacy
                  Policy
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
