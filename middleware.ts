import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_BASE_URL = "http://0.0.0.0:8000";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("gradex_admin_token")?.value;

  // If no token and trying to access protected routes, redirect to login
  if (!token && !request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If has token and trying to access login, redirect to dashboard
  if (token && request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Verify token and role for protected routes
  if (token && !request.nextUrl.pathname.startsWith("/login")) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error(
          "[Middleware] Token validation failed, status:",
          response.status
        );
        // Invalid token, redirect to login
        const redirectResponse = NextResponse.redirect(
          new URL("/login", request.url)
        );
        redirectResponse.cookies.delete("gradex_admin_token");
        redirectResponse.cookies.delete("gradex_refresh_token");
        return redirectResponse;
      }

      const data = await response.json();
      const user = data.user || data.data || data;

      // Check if user is admin or teacher
      if (user.role !== "admin" && user.role !== "teacher") {
        console.error("[Middleware] Unauthorized role:", user.role);
        return NextResponse.json(
          { error: "Unauthorized. Admin or teacher access required." },
          { status: 403 }
        );
      }
    } catch (error) {
      console.error("[Middleware] Error validating token:", error);
      // Network error or invalid response, redirect to login
      const redirectResponse = NextResponse.redirect(
        new URL("/login", request.url)
      );
      redirectResponse.cookies.delete("gradex_admin_token");
      redirectResponse.cookies.delete("gradex_refresh_token");
      return redirectResponse;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
