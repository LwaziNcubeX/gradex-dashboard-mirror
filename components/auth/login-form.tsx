"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { Shield, ArrowLeft, Loader2, Mail, Lock } from "lucide-react";

interface ResponseType {
  data: Record<string, unknown>;
  message: string;
  success: boolean;
}

export function AdminLoginForm({
  saveAuth,
}: {
  saveAuth: (data: Record<string, unknown>) => Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setIsError(false);
    try {
      const response = await fetch("http://0.0.0.0:8000/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data: ResponseType = await response.json();
      if (data.message) {
        setEmailSent(true);
        setMessage(data.message);
        setIsError(false);
      }
    } catch {
      setMessage("Error requesting OTP");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setIsError(false);
    try {
      const response = await fetch("http://0.0.0.0:8000/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      setMessage(data.message);
      if (data.success) {
        setIsError(false);
        await saveAuth(data.data);
      } else {
        setIsError(true);
      }
    } catch {
      setMessage("Error verifying OTP");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setEmailSent(false);
    setOtp("");
    setMessage("");
    setIsError(false);
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Glow effect behind card */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-[hsl(220,60%,30%)]/20 via-transparent to-transparent blur-xl" />

      <div className="relative rounded-2xl border border-border/50 bg-card/80 p-8 shadow-2xl backdrop-blur-sm">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-b from-[hsl(220,60%,30%)] to-[hsl(220,60%,20%)] shadow-lg shadow-[hsl(220,60%,30%)]/20">
            <Shield className="h-7 w-7 text-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Admin Access
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {!emailSent
                ? "Enter your admin email to continue"
                : `Verification code sent to ${email}`}
            </p>
          </div>
        </div>

        {/* Email Step */}
        {!emailSent ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  ref={emailInputRef}
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@company.com"
                  required
                  className="h-11 border-border/60 bg-secondary/50 pl-10 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-[hsl(220,60%,30%)]"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !email}
              className="h-11 w-full bg-foreground text-background hover:bg-foreground/90 font-medium"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Request Access Code"
              )}
            </Button>
          </form>
        ) : (
          /* OTP Step */
          <form onSubmit={handleOtpSubmit} className="space-y-5">
            <div className="space-y-3">
              <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <Lock className="mb-0.5 mr-1 inline h-3.5 w-3.5" />
                Verification Code
              </Label>
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot
                      index={0}
                      className="h-12 w-12 border-border/60 bg-secondary/50 text-foreground text-lg font-mono"
                    />
                    <InputOTPSlot
                      index={1}
                      className="h-12 w-12 border-border/60 bg-secondary/50 text-foreground text-lg font-mono"
                    />
                    <InputOTPSlot
                      index={2}
                      className="h-12 w-12 border-border/60 bg-secondary/50 text-foreground text-lg font-mono"
                    />
                  </InputOTPGroup>
                  <InputOTPSeparator className="text-muted-foreground" />
                  <InputOTPGroup>
                    <InputOTPSlot
                      index={3}
                      className="h-12 w-12 border-border/60 bg-secondary/50 text-foreground text-lg font-mono"
                    />
                    <InputOTPSlot
                      index={4}
                      className="h-12 w-12 border-border/60 bg-secondary/50 text-foreground text-lg font-mono"
                    />
                    <InputOTPSlot
                      index={5}
                      className="h-12 w-12 border-border/60 bg-secondary/50 text-foreground text-lg font-mono"
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || otp.length < 6}
              className="h-11 w-full bg-foreground text-background hover:bg-foreground/90 font-medium"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Verify & Sign In"
              )}
            </Button>

            <button
              type="button"
              onClick={handleBack}
              className="flex w-full items-center justify-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Use a different email
            </button>
          </form>
        )}

        {/* Message */}
        {message && (
          <div
            className={`mt-4 rounded-lg border px-3 py-2.5 text-center text-sm ${
              isError
                ? "border-destructive/30 bg-destructive/10 text-destructive"
                : "border-[hsl(160,60%,30%)]/30 bg-[hsl(160,60%,30%)]/10 text-[hsl(160,60%,65%)]"
            }`}
          >
            {message}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 border-t border-border/40 pt-4">
          <p className="text-center text-xs text-muted-foreground/70">
            Restricted to authorized administrators only.
          </p>
        </div>
      </div>
    </div>
  );
}
