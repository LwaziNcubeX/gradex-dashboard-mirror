/**
 * Base API Client with token management and request/response interceptors
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const TOKEN_KEY = "gradex_access_token";
const REFRESH_TOKEN_KEY = "gradex_refresh_token";

export interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

export interface ApiError extends Error {
  status?: number;
  response?: unknown;
}

/**
 * Get stored access token
 */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Get stored refresh token
 */
export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Store tokens in localStorage
 */
export function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

/**
 * Clear tokens from localStorage
 */
export function clearTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

/**
 * Build query string from params object
 */
function buildQueryString(
  params?: Record<string, string | number | boolean>
): string {
  if (!params) return "";
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    query.append(key, String(value));
  });
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

/**
 * Make an API request with automatic token inclusion and refresh
 */
export async function apiRequest<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;
  const debug = process.env.NEXT_PUBLIC_API_DEBUG === "true";

  // Build URL
  const url = `${API_BASE_URL}${endpoint}${buildQueryString(params)}`;

  // Set up headers
  const headers = new Headers(fetchOptions.headers);

  // Add authorization header if token exists
  const token = getAccessToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Default to JSON content type
  if (!headers.has("Content-Type") && fetchOptions.body) {
    headers.set("Content-Type", "application/json");
  }

  // Log request if debug enabled
  if (debug) {
    console.log(`[API] ${fetchOptions.method || "GET"} ${url}`, {
      hasToken: !!token,
      body: fetchOptions.body
        ? JSON.parse(fetchOptions.body as string)
        : undefined,
    });
  }

  try {
    // Make the request
    let response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    // Handle 401 - try to refresh token and retry
    if (response.status === 401) {
      const refreshToken = getRefreshToken();

      if (refreshToken) {
        if (debug) console.log("[API] Attempting token refresh...");

        try {
          // Attempt to refresh the token
          const newTokens = await refreshAccessToken(refreshToken);
          setTokens(newTokens.access_token, newTokens.refresh_token);

          if (debug) console.log("[API] Token refreshed successfully");

          // Retry the original request with new token
          const retryHeaders = new Headers(fetchOptions.headers);
          retryHeaders.set("Authorization", `Bearer ${newTokens.access_token}`);

          response = await fetch(url, {
            ...fetchOptions,
            headers: retryHeaders,
          });
        } catch (error) {
          // Refresh failed, clear tokens and throw error
          clearTokens();
          if (debug) console.error("[API] Token refresh failed", error);
          throw new Error("Session expired. Please login again.");
        }
      } else {
        // No refresh token, redirect to login
        clearTokens();
        if (debug) console.error("[API] No refresh token available");
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
        throw new Error("Not authenticated");
      }
    }

    // Handle response
    let data: unknown;
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Log response if debug enabled
    if (debug) {
      console.log(`[API] ${response.status} ${endpoint}`, data);
    }

    // Check if response is ok
    if (!response.ok) {
      const errorMessage =
        typeof data === "object" && data !== null && "message" in data
          ? ((data as Record<string, unknown>).message as string)
          : `API Error: ${response.status}`;

      if (debug) {
        console.error(`[API] Error: ${errorMessage}`, data);
      }

      const error = new Error(errorMessage) as ApiError;
      error.status = response.status;
      error.response = data;
      throw error;
    }

    // Extract data from response wrapper
    if (typeof data === "object" && data !== null && "data" in data) {
      return (data as Record<string, unknown>).data as T;
    }

    return data as T;
  } catch (error) {
    // Log network errors
    if (debug) {
      console.error("[API] Network error:", error);
    }
    throw error;
  }
}

/**
 * Refresh access token using refresh token
 */
async function refreshAccessToken(refreshToken: string): Promise<{
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
}> {
  const url = `${API_BASE_URL}/auth/refresh`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  const result = (await response.json()) as {
    success: boolean;
    data: { access_token: string; refresh_token: string; token_type: "bearer" };
  };

  if (!result.success) {
    throw new Error("Token refresh failed");
  }

  return result.data;
}

/**
 * GET request
 */
export function apiGet<T>(
  endpoint: string,
  options?: Omit<FetchOptions, "method">
): Promise<T> {
  return apiRequest<T>(endpoint, { ...options, method: "GET" });
}

/**
 * POST request
 */
export function apiPost<T>(
  endpoint: string,
  body?: unknown,
  options?: Omit<FetchOptions, "method">
): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * PUT request
 */
export function apiPut<T>(
  endpoint: string,
  body?: unknown,
  options?: Omit<FetchOptions, "method">
): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * DELETE request
 */
export function apiDelete<T>(
  endpoint: string,
  options?: Omit<FetchOptions, "method">
): Promise<T> {
  return apiRequest<T>(endpoint, { ...options, method: "DELETE" });
}
