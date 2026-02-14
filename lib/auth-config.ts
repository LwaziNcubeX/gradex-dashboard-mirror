/**
 * Authentication Configuration
 * Defines public and protected routes
 */

export const AUTH_CONFIG = {
  /**
   * Public routes that don't require authentication
   */
  publicRoutes: ["/auth", "/api/auth"],

  /**
   * Protected routes that require authentication
   */
  protectedRoutes: [
    "/",
    "/content",
    "/students",
    "/feedback",
    "/analytics",
    "/settings",
  ],

  /**
   * API endpoints
   */
  api: {
    AUTH_CHECK: "/api/auth/check",
    LOGOUT: "/api/auth/logout",
    REQUEST_OTP: "http://0.0.0.0:8000/auth/request-otp",
    VERIFY_OTP: "http://0.0.0.0:8000/auth",
  },

  /**
   * Cookie names
   */
  cookies: {
    ACCESS_TOKEN: "accessToken",
    REFRESH_TOKEN: "refreshToken",
  },

  /**
   * Token expiration times (in days)
   */
  tokenExpiry: {
    ACCESS_TOKEN: 14,
    REFRESH_TOKEN: 30,
  },

  /**
   * Default redirect paths
   */
  redirects: {
    AFTER_LOGIN: "/",
    AFTER_LOGOUT: "/auth",
  },
};
