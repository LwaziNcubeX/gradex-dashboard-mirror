import { type NextRequest, NextResponse } from "next/server";
import { setAuthToken } from "@/lib/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://0.0.0.0:8000";

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();
    console.log("[API Login] Request received for:", email);

    if (!email || !otp) {
      console.error("[API Login] Missing email or OTP");
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    console.log("[API Login] Calling backend:", `${API_BASE_URL}/auth/login`);
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    console.log("[API Login] Backend response status:", response.status);
    const data = await response.json();
    console.log("[API Login] Backend response data:", JSON.stringify(data));

    if (response.ok && data.access_token) {
      const user = data.user;
      console.log("[API Login] User data:", user);

      if (user.role !== "admin" && user.role !== "teacher") {
        console.error("[API Login] Access denied for role:", user.role);
        return NextResponse.json(
          { error: "Access denied. Admin or teacher role required." },
          { status: 403 }
        );
      }

      console.log("[API Login] Setting auth tokens...");
      await setAuthToken(data.access_token, data.refresh_token);
      console.log("[API Login] Auth tokens set successfully");
      return NextResponse.json({ success: true, user });
    }

    console.error("[API Login] Login failed:", data.message || "Invalid OTP");
    return NextResponse.json(
      { error: data.message || "Invalid OTP" },
      { status: response.status }
    );
  } catch (error) {
    console.error("[API Login] Internal server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
