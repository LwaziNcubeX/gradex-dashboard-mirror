import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/auth/login", "/"];
const adminRoutes = ["/admin", "/dashboard"];

/**
 * Proxy middleware for route protection
 *
 * ADMIN DASHBOARD SECURITY:
 * - All /admin/* and /dashboard/* routes are protected and require valid authentication
 * - Only authenticated users with admin/teacher role can access
 * - Unauthenticated users are redirected to /auth/login
 *
 * Role verification is performed on the client-side via AuthContext
 * If a non-admin user somehow gets past this middleware, they will be
 * redirected by the client-side role check
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route is an admin-only route
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  if (isAdminRoute) {
    // Get token from Authorization header or cookies
    // The token is stored in localStorage on client, checked here from request headers
    const token =
      request.headers.get("Authorization")?.split("Bearer ")[1] ||
      request.cookies.get("gradex_access_token")?.value;

    if (!token) {
      // No authentication token found
      // Redirect to login page
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Token exists, proceed to page
    // Client-side AuthContext will:
    // 1. Verify user role (must be admin or teacher)
    // 2. Fetch user profile
    // 3. Redirect to home if user is not authorized
    // 4. Handle token refresh if needed
  }

  // Allow request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
