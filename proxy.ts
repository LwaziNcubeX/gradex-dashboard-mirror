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
 * Get access token from request cookies with optional validation
 */
function getAccessToken(request: NextRequest): string | null {
  try {
    const token = request.cookies.get("accessToken")?.value;
    if (!token) return null;
    if (isTokenExpired(token)) return null;
    return token;
  } catch (error) {
    console.error("Failed to get access token:", error);
    return null;
  }
}

/**
 * Middleware function for route protection
 * Handles authentication and redirects
 */
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Public routes that don't require authentication
  const publicRoutes = ["/auth", "/api/auth"];

  // Protected routes that require authentication
  const protectedRoutes: string[] = [];

  const token = getAccessToken(request);
  const isAuthenticated = token !== null;

  // Check if current path is public
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // If user is authenticated and tries to access /auth, redirect to dashboard
  if (isAuthenticated && pathname === "/auth") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user is not authenticated and tries to access protected route, redirect to auth
  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // Allow the request to continue
  return NextResponse.next();
}

/**
 * Configure which routes the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
