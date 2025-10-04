import { CONFIG } from "./config";

// Client-side function to get auth token from cookies
function getClientAuthToken(): string | undefined {
  if (typeof window === "undefined") return undefined;

  const cookies = document.cookie.split(";");
  const tokenCookie = cookies.find((cookie) =>
    cookie.trim().startsWith(`${CONFIG.AUTH.TOKEN_COOKIE_NAME}=`)
  );

  return tokenCookie ? tokenCookie.split("=")[1] : undefined;
}

// Retry logic for failed requests
async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = CONFIG.API.RETRY_ATTEMPTS
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxAttempts) {
        throw lastError;
      }

      // Exponential backoff
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

export class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string = CONFIG.API.BASE_URL) {
    this.baseUrl = baseUrl;
    this.timeout = CONFIG.API.TIMEOUT;
  }

  private async getHeaders(): Promise<HeadersInit> {
    let token: string | undefined;

    // Get token from client-side cookies
    if (typeof window !== "undefined") {
      token = getClientAuthToken();
      if (CONFIG.FEATURES.ENABLE_DEBUG_LOGS) {
        console.log("Client-side token:", token ? "present" : "missing");
      }
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "X-Client-Version": CONFIG.APP.VERSION,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async get<T>(
    endpoint: string,
    options: { cache?: RequestCache } = {}
  ): Promise<T> {
    return withRetry(async () => {
      const headers = await this.getHeaders();
      const response = await this.fetchWithTimeout(
        `${this.baseUrl}${endpoint}`,
        {
          headers,
          cache: options.cache || "no-store",
        }
      );

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({
            message: `HTTP ${response.status}: ${response.statusText}`,
          }));

        const errorMessage =
          error.message || `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      return response.json();
    });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return withRetry(async () => {
      const headers = await this.getHeaders();
      const response = await this.fetchWithTimeout(
        `${this.baseUrl}${endpoint}`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({
            message: `HTTP ${response.status}: ${response.statusText}`,
          }));

        const errorMessage =
          error.message || `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      return response.json();
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return withRetry(async () => {
      const headers = await this.getHeaders();
      const response = await this.fetchWithTimeout(
        `${this.baseUrl}${endpoint}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({
            message: `HTTP ${response.status}: ${response.statusText}`,
          }));

        const errorMessage =
          error.message || `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      return response.json();
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return withRetry(async () => {
      const headers = await this.getHeaders();
      const response = await this.fetchWithTimeout(
        `${this.baseUrl}${endpoint}`,
        {
          method: "DELETE",
          headers,
        }
      );

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({
            message: `HTTP ${response.status}: ${response.statusText}`,
          }));

        const errorMessage =
          error.message || `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      return response.json();
    });
  }
}

export const apiClient = new ApiClient();
