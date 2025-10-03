import { type NextRequest, NextResponse } from "next/server"
import { setAuthToken } from "@/lib/auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://gradex-api.onrender.com"

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 })
    }

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    })

    const data = await response.json()

    if (response.ok && data.access_token) {
      const user = data.user

      if (user.role !== "admin" && user.role !== "teacher") {
        return NextResponse.json({ error: "Access denied. Admin or teacher role required." }, { status: 403 })
      }

      await setAuthToken(data.access_token, data.refresh_token)
      return NextResponse.json({ success: true, user })
    }

    return NextResponse.json({ error: data.message || "Invalid OTP" }, { status: response.status })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
