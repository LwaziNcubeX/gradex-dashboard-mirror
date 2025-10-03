import { NextResponse } from "next/server"
import { removeAuthToken } from "@/lib/auth"

export async function POST() {
  try {
    await removeAuthToken()
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}
