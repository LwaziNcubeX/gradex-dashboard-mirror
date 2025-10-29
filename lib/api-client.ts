import { CONFIG } from "./config";

// Client-side function to get auth token via API endpoint
async function getClientAuthToken(): Promise<string | undefined> {
  if (typeof window === "undefined") return undefined;

  try {
    const response = await fetch("/api/auth/token", {
      method: "GET",
      credentials: "include", // This ensures cookies are sent
    });

    if (response.ok) {
      const data = await response.json();
      if (CONFIG.FEATURES.ENABLE_DEBUG_LOGS) {
        console.log(
          "Token retrieved from API:",
          data.token ? `${data.token.substring(0, 20)}...` : "null"
        );
      }
      return data.token;
    } else {
      if (CONFIG.FEATURES.ENABLE_DEBUG_LOGS) {
        console.log("Failed to get token from API:", response.status);
      }
      return undefined;
    }
  } catch (error) {
    if (CONFIG.FEATURES.ENABLE_DEBUG_LOGS) {
      console.error("Error getting client auth token:", error);
    }
    return undefined;
  }
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

    // Get token from client-side API endpoint
    if (typeof window !== "undefined") {
      token = await getClientAuthToken();
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
        const error = await response.json().catch(() => ({
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

      // Debug logging for request
      if (CONFIG.FEATURES.ENABLE_DEBUG_LOGS) {
        console.log(`📤 POST Request to: ${this.baseUrl}${endpoint}`);
        console.log("📤 Headers:", headers);
        console.log("📤 Request Data:", data);
        console.log("📤 Request Body (JSON):", JSON.stringify(data, null, 2));
      }

      const response = await this.fetchWithTimeout(
        `${this.baseUrl}${endpoint}`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(data),
        }
      );

      // Debug logging for response
      if (CONFIG.FEATURES.ENABLE_DEBUG_LOGS) {
        console.log(
          `📥 Response Status: ${response.status} ${response.statusText}`
        );
        console.log(
          "📥 Response Headers:",
          Object.fromEntries(response.headers.entries())
        );
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: `HTTP ${response.status}: ${response.statusText}`,
        }));

        // Debug logging for error
        if (CONFIG.FEATURES.ENABLE_DEBUG_LOGS) {
          console.log("❌ Error Response:", error);
        }

        const errorMessage =
          error.message || `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      const responseData = await response.json();

      // Debug logging for success response
      if (CONFIG.FEATURES.ENABLE_DEBUG_LOGS) {
        console.log("✅ Success Response:", responseData);
      }

      return responseData;
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
        const error = await response.json().catch(() => ({
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
        const error = await response.json().catch(() => ({
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
