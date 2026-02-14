"use client";
import { GridBackground } from "@/components/auth/grid-background";
import { AdminLoginForm } from "@/components/auth/login-form";
import { saveAuth } from "@/lib/api";
import { useState } from "react";

interface ResponseType {
  data: {};
  message: string;
  success: boolean;
}

const page = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://0.0.0.0:8000/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data: ResponseType = await response.json();
      if (data.message) {
        setEmailSent(true);
      }
      setMessage(data.message);
    } catch (error) {
      void error;
      setMessage("Error requesting otp");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://0.0.0.0:8000/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      setMessage(data.message);
      if (data.success) {
        await saveAuth(data.data);
      }
    } catch (error) {
      void error;
      setMessage("Error verifying OTP");
    }
  };

  return (
    <div>
      <main className="relative flex min-h-screen items-center justify-center px-4">
        <GridBackground />

        <div className="relative z-10 flex w-full flex-col items-center gap-8">
          {/* Branding above card */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="h-px w-8 bg-border" />
            <span className="text-xs font-medium uppercase tracking-[0.2em]">
              Dashboard
            </span>
            <div className="h-px w-8 bg-border" />
          </div>

          <AdminLoginForm saveAuth={saveAuth} />
        </div>
      </main>
    </div>
  );
};

export default page;
