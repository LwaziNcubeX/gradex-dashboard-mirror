/**
 * Authentication API service
 * Handles login, OTP verification, token management, and logout
 */

import { apiPost, apiGet, clearTokens, setTokens } from "@/lib/api";
import type {
  RequestOtpRequest,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  LogoutRequest,
  LogoutResponse,
  ProfileResponse,
} from "@/types/auth";

/**
 * Request OTP for email
 */
export async function requestOtp(email: string): Promise<void> {
  const payload: RequestOtpRequest = { email };
  await apiPost("/auth/request-otp", payload);
}

/**
 * Login with email and OTP
 */
export async function login(
  email: string,
  otp: string
): Promise<LoginResponse["data"]> {
  const payload: LoginRequest = { email, otp };
  const response = await apiPost<LoginResponse>("/auth/login", payload);

  // Store tokens
  setTokens(response.data.access_token, response.data.refresh_token);

  return response.data;
}

/**
 * Refresh access token
 */
export async function refreshToken(refreshToken: string): Promise<string> {
  const payload: RefreshTokenRequest = { refresh_token: refreshToken };
  const response = await apiPost<RefreshTokenResponse>(
    "/auth/refresh",
    payload
  );

  // Store new tokens
  setTokens(response.data.access_token, response.data.refresh_token);

  return response.data.access_token;
}

/**
 * Get current user profile
 */
export async function getProfile(): Promise<ProfileResponse["data"]> {
  const response = await apiGet<ProfileResponse>("/auth/profile");
  return response.data;
}

/**
 * Logout user
 */
export async function logout(refreshToken: string): Promise<void> {
  try {
    const payload: LogoutRequest = { refresh_token: refreshToken };
    await apiPost<LogoutResponse>("/auth/logout", payload);
  } finally {
    // Always clear tokens even if logout API call fails
    clearTokens();
  }
}

export const authService = {
  requestOtp,
  login,
  refreshToken,
  getProfile,
  logout,
};
