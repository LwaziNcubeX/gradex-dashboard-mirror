import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/auth/login", "/"];
const adminRoutes = ["/admin"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route is an admin route
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  if (isAdminRoute) {
    // Get token from cookies or localStorage (checked on client side)
    const token =
      request.cookies.get("gradex_access_token")?.value ||
      request.headers.get("Authorization")?.split("Bearer ")[1];

    if (!token) {
      // No token, redirect to login
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Token exists, allow request
    // Token validation (role check, expiry) will be done on the client side
    // using the auth context and API responses
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
