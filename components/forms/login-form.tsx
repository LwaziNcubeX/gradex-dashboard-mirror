"use client";

/**
 * Login Form Component
 * Handles email/OTP-based login flow
 */

import { useState } from "react";
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
import { AlertCircle, Loader2 } from "lucide-react";

type LoginStep = "email" | "otp";

export function LoginForm() {
  const router = useRouter();
  const { requestOtp, login, isLoading, error, clearError } = useAuth();

  const [step, setStep] = useState<LoginStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">GradeX Admin</CardTitle>
          <CardDescription>
            {step === "email"
              ? "Enter your email to continue"
              : "Enter the OTP sent to your email"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {displayError && (
            <div className="mb-6 flex items-center gap-3 rounded-lg bg-red-50 p-3 text-sm text-red-800">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{displayError}</span>
            </div>
          )}

          {step === "email" ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@gradex.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <p className="text-xs text-slate-500">
                  We'll send you a 6-digit OTP code
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">One-Time Password</Label>
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
                  className="text-center text-2xl tracking-widest"
                />
                <p className="text-xs text-slate-500">
                  Check your email for the 6-digit code
                </p>
              </div>

              <div className="space-y-2">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isLoading ? "Logging in..." : "Login"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setStep("email");
                    setOtp("");
                    setLocalError(null);
                    clearError();
                  }}
                  disabled={isLoading}
                >
                  Back
                </Button>
              </div>
            </form>
          )}

          <p className="mt-6 text-center text-xs text-slate-500">
            OTP expires in 5 minutes. Request a new one if it expires.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
