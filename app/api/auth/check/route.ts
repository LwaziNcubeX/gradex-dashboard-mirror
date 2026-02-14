import { NextRequest, NextResponse } from "next/server";

/**
 * Check if JWT token is expired
 */
function isTokenExpired(token: string): boolean {
  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    return decoded.exp * 1000 < Date.now();
  } catch (error) {
    console.error("Failed to decode token:", error);
    return true;
  }
}

/**
 * GET /api/auth/check
 * Check if user is currently authenticated
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { authenticated: false, message: "No token found" },
        { status: 401 }
      );
    }

    if (isTokenExpired(token)) {
      // Clear the expired token
      const response = NextResponse.json(
        { authenticated: false, message: "Token expired" },
        { status: 401 }
      );
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      return response;
    }

    return NextResponse.json(
      { authenticated: true, message: "User is authenticated" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { authenticated: false, message: "Error checking authentication" },
      { status: 500 }
    );
  }
}
