"use client";
import { saveAuth } from "@/lib/api";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import React, { useState } from "react";

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
      <h1>LOGIN</h1>
      {!emailSent ? (
        <div>
          <form onSubmit={handleSubmit}>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit">Request otp</Button>
            <p>{message}</p>
          </form>
        </div>
      ) : (
        <div>
          <form onSubmit={handleOtpSubmit}>
            <Input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <Button type="submit">Verify OTP</Button>
            <p>{message}</p>
          </form>
        </div>
      )}
    </div>
  );
};

export default page;
