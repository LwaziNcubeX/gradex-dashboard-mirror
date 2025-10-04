import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CONFIG } from "./lib/config";

export async function middleware(request: NextRequest) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers);

  // Add request ID for tracking
  const requestId = crypto.randomUUID();
  requestHeaders.set("x-request-id", requestId);

  const token = request.cookies.get(CONFIG.AUTH.TOKEN_COOKIE_NAME)?.value;

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
      const response = await fetch(`${CONFIG.API.BASE_URL}/auth/profile`, {
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

  // Create response with enhanced headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Request-ID", requestId);
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // CORS headers for API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Request-ID"
    );
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
