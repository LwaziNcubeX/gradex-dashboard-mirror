import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/logout
 * Clear authentication tokens and logout user
 */
export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json(
      { message: "Logout successful" },
      { status: 200 }
    );

    // Clear auth cookies
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ message: "Error logging out" }, { status: 500 });
  }
}
