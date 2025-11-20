/**
 * Base API client with token management and request/response interceptors
 */

import Cookies from "js-cookie";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api-gradex.rapidshyft.com";

interface ApiRequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get access token from cookies
   */
  private getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return Cookies.get("accessToken") || null;
  }

  /**
   * Get refresh token from cookies
   */
  private getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return Cookies.get("refreshToken") || null;
  }

  /**
   * Store tokens in cookies with secure settings
   */
  private storeTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === "undefined") return;

    const cookieOptions = {
      expires: 7, // 7 days
      path: "/",
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "strict" as const,
    };

    Cookies.set("accessToken", accessToken, {
      ...cookieOptions,
      expires: 1, // Access token expires in 1 day
    });

    Cookies.set("refreshToken", refreshToken, {
      ...cookieOptions,
      expires: 7, // Refresh token expires in 7 days
    });
  }

  /**
   * Clear tokens from cookies
   */
  private clearTokens(): void {
    if (typeof window === "undefined") return;
    Cookies.remove("accessToken", { path: "/" });
    Cookies.remove("refreshToken", { path: "/" });
    localStorage.removeItem("user");
  }

  /**
   * Build query string from params
   */
  private buildQueryString(
    params?: Record<string, string | number | boolean>
  ): string {
    if (!params || Object.keys(params).length === 0) return "";

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    return `?${searchParams.toString()}`;
  }

  /**
   * Make HTTP request
   */
  async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const { params, ...fetchOptions } = options;

    const url = `${this.baseUrl}${endpoint}${this.buildQueryString(params)}`;
    const accessToken = this.getAccessToken();

    // Set up headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add custom headers from options
    if (fetchOptions.headers) {
      Object.assign(headers, fetchOptions.headers);
    }

    // Add authorization header if token exists
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      });

      // Handle 401 - try to refresh token
      if (response.status === 401 && accessToken) {
        const refreshToken = this.getRefreshToken();
        if (refreshToken) {
          const refreshed = await this.refreshTokens(refreshToken);
          if (refreshed) {
            // Retry original request with new token
            return this.request<T>(endpoint, options);
          }
        }
        // If refresh fails, clear tokens
        this.clearTokens();
        throw new Error("Session expired. Please login again.");
      }

      // Parse response
      const data: ApiResponse<T> = await response.json();

      // Handle error responses
      if (!response.ok) {
        throw new Error(data.message || `HTTP Error: ${response.status}`);
      }

      return data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "GET",
    });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: Record<string, unknown>,
    options?: ApiRequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body?: Record<string, unknown>,
    options?: ApiRequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "DELETE",
    });
  }

  /**
   * Refresh access token
   */
  private async refreshTokens(refreshToken: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      const newAccessToken = data.data?.access_token;
      const newRefreshToken = data.data?.refresh_token;

      if (newAccessToken && newRefreshToken) {
        this.storeTokens(newAccessToken, newRefreshToken);
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }

  /**
   * Store user data
   */
  storeUser(user: Record<string, unknown>): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("user", JSON.stringify(user));
  }

  /**
   * Get stored user data
   */
  getUser(): Record<string, unknown> | null {
    if (typeof window === "undefined") return null;
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
