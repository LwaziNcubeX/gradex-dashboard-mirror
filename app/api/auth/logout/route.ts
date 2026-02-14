import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/logout
 * Clear authentication tokens and logout user
 */
export async function POST(request: NextRequest) {
  try {
    // Try to get the refresh token from request body if provided
    let body: { refresh_token?: string } = {};
    try {
      body = await request.json();
    } catch (e) {
      // Body might be empty, which is fine
    }

    // If refresh token provided, call backend logout to invalidate it
    if (body.refresh_token) {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        await fetch(`${apiUrl}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh_token: body.refresh_token }),
        }).catch((error) => {
          console.error("Backend logout API call failed:", error);
          // Continue anyway
        });
      } catch (error) {
        console.error("Error calling backend logout:", error);
        // Continue with local logout
      }
    }

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
