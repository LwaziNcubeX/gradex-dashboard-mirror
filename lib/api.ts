import { cookies, TokenResponse } from "./cookie-manager";
import { API_BASE_URL, getHeaders, ApiError } from "./api/common";

// Types
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  first_name?: string;
  last_name?: string;
  role: string;
  created_at: string;
  last_login: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: UserProfile;
  success: boolean;
  message: string;
}

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
 * Get user profile information
 * @throws ApiError if the request fails
 */
export async function getProfile(): Promise<UserProfile> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      throw new ApiError(response.status, "Failed to fetch profile");
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error("Get profile error:", error);
    throw error;
  }
}

/**
 * Update user profile (first_name and last_name)
 * @throws ApiError if the request fails
 */
export async function updateProfile(
  firstName: string,
  lastName: string
): Promise<UserProfile> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/update/profile`, {
      method: "PUT",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
      }),
    });

    if (!response.ok) {
      throw new ApiError(response.status, "Failed to update profile");
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error("Update profile error:", error);
    throw error;
  }
}

/**
 * Refresh access token using refresh token
 * @throws ApiError if refresh fails
 */
export async function refreshAccessToken(): Promise<RefreshTokenResponse> {
  try {
    const refreshToken = cookies.getRefreshToken();

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
      credentials: "include",
    });

    if (!response.ok) {
      throw new ApiError(response.status, "Failed to refresh token");
    }

    const data: RefreshTokenResponse = await response.json();

    // Save new tokens
    if (data.access_token && data.refresh_token) {
      await saveAuth({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });
    }

    return data;
  } catch (error) {
    console.error("Refresh token error:", error);
    throw error;
  }
}

/**
 * Logout user by clearing all tokens and calling logout API
 */
export async function logoutUser(): Promise<void> {
  try {
    const refreshToken = cookies.getRefreshToken();

    // Call logout API to clear server-side session with refresh token
    if (refreshToken) {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
        credentials: "include",
      }).catch((error) => {
        console.error("Failed to call logout API:", error);
        // Continue with client-side logout even if API call fails
      });
    }

    // Also notify local logout API endpoint to clear cookies
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    }).catch((error) => {
      console.error("Failed to call local logout API:", error);
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
