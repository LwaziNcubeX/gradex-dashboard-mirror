import Cookies from "js-cookie";
import {
  getErrorCacheStatus,
  cacheError,
  clearErrorCache,
} from "./error-cache";

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
 * Get stored access token from cookies
 */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return Cookies.get(TOKEN_KEY) || null;
}

/**
 * Get stored refresh token from cookies
 */
export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return Cookies.get(REFRESH_TOKEN_KEY) || null;
}

/**
 * Store tokens in cookies with secure settings
 */
export function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === "undefined") return;

  const cookieOptions = {
    expires: 7, // 7 days
    path: "/",
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "strict" as const,
  };

  Cookies.set(TOKEN_KEY, accessToken, {
    ...cookieOptions,
    expires: 1, // Access token expires in 1 day
  });

  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, {
    ...cookieOptions,
    expires: 7, // Refresh token expires in 7 days
  });
}

/**
 * Clear tokens from cookies
 */
export function clearTokens(): void {
  if (typeof window === "undefined") return;
  Cookies.remove(TOKEN_KEY, { path: "/" });
  Cookies.remove(REFRESH_TOKEN_KEY, { path: "/" });
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

  // Check error cache first - prevent spam requests
  const cacheStatus = getErrorCacheStatus(endpoint);
  if (cacheStatus && !cacheStatus.shouldRetry) {
    if (debug) {
      console.warn(
        `[API] Skipping request to ${endpoint} - error cached (wait ${cacheStatus.waitTime}ms)`,
        cacheStatus.error
      );
    }
    throw cacheStatus.error;
  }

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
        if (debug)
          console.log(
            "[API] 401 received — attempting silent token refresh (deduped)"
          );

        try {
          // Use a shared promise to deduplicate concurrent refresh attempts
          if (!refreshPromise) {
            refreshPromise = (async () => {
              const newTokens = await refreshAccessToken(refreshToken);
              setTokens(newTokens.access_token, newTokens.refresh_token);
              return newTokens;
            })().finally(() => {
              // keep refreshPromise cleared after resolution so future refreshes can start
              const p = refreshPromise; // capture
              refreshPromise = null;
            });
          }

          const newTokens = await refreshPromise;

          if (!newTokens) {
            // something went wrong upstream
            clearTokens();
            throw new Error("Session expired. Please login again.");
          }

          if (debug)
            console.log("[API] Token refreshed successfully (deduped)");

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
        // No refresh token — clear tokens and surface auth error (don't force redirect here)
        clearTokens();
        if (debug) console.error("[API] No refresh token available");
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

      // Cache the error to prevent spam
      cacheError(endpoint, error);

      throw error;
    }

    // Success - clear any cached errors for this endpoint
    clearErrorCache(endpoint);

    return data as T;
  } catch (error) {
    // Cache network and other errors
    if (error instanceof Error) {
      cacheError(endpoint, error);
    }

    // Log network errors
    if (debug) {
      console.error("[API] Network error:", error);
    }
    throw error;
  }
}

// Shared promise used to deduplicate token refresh requests
let refreshPromise: Promise<{
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
} | null> | null = null;

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
 * PATCH request
 */
export function apiPatch<T>(
  endpoint: string,
  body?: unknown,
  options?: Omit<FetchOptions, "method">
): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "PATCH",
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
