import { cookies, TokenResponse } from "./cookie-manager";

/**
 * Save authentication tokens to secure cookies
 * @param data - Token response containing access_token and refresh_token
 * @throws Error if token storage fails
 */
export async function saveAuth(data: TokenResponse): Promise<void> {
  try {
    cookies.saveTokens(data);
  } catch (error) {
    console.error("Authentication save failed:", error);
    throw new Error("Failed to save authentication tokens");
  }
}

/**
 * Logout user by clearing all tokens and calling logout API
 */
export async function logoutUser(): Promise<void> {
  try {
    // Call logout API to clear server-side session
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    }).catch((error) => {
      console.error("Failed to call logout API:", error);
      // Continue with client-side logout even if API call fails
    });

    // Clear client-side tokens
    cookies.clearTokens();
  } catch (error) {
    console.error("Logout failed:", error);
    throw new Error("Failed to logout");
  }
}

/**
 * Get current access token
 */
export function getAccessToken(): string | undefined {
  return cookies.getAccessToken();
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const token = cookies.getAccessToken();
  if (!token) return false;
  return !cookies.isTokenExpired(token);
}
