import { getAuthToken } from "./auth";
import { CONFIG } from "./config";

interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

interface RequestMetrics {
  endpoint: string;
  method: string;
  duration: number;
  status: number;
}

export class ServerApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string = CONFIG.API.BASE_URL) {
    this.baseUrl = baseUrl;
    this.timeout = CONFIG.API.TIMEOUT;
  }

  private log(message: string, data?: any): void {
    if (CONFIG.FEATURES.ENABLE_DEBUG_LOGS) {
      console.log(`[ServerApiClient] ${message}`, data || "");
    }
  }

  private logError(message: string, error?: any): void {
    console.error(`[ServerApiClient Error] ${message}`, error || "");
  }

  private logMetrics(metrics: RequestMetrics): void {
    if (CONFIG.FEATURES.ENABLE_DEBUG_LOGS) {
      console.log(`[ServerApiClient Metrics]`, {
        endpoint: metrics.endpoint,
        method: metrics.method,
        duration: `${metrics.duration}ms`,
        status: metrics.status,
      });
    }
  }

  private generateRequestId(): string {
    return `srv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private async getHeaders(): Promise<HeadersInit> {
    const token = await getAuthToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "X-Server-Version": CONFIG.APP.VERSION,
      "X-Request-ID": this.generateRequestId(),
      "User-Agent": `${CONFIG.APP.NAME}/${CONFIG.APP.VERSION} (Server)`,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
      this.log("Request authenticated with token");
    } else {
      this.log("No authentication token available");
    }

    return headers;
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    method: string = "GET"
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      this.logError(`Request timeout after ${this.timeout}ms`, { url, method });
      controller.abort();
    }, this.timeout);

    const startTime = Date.now();

    try {
      this.log(`Making ${method} request to: ${url}`);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      const duration = Date.now() - startTime;
      clearTimeout(timeoutId);

      this.logMetrics({
        endpoint: url.replace(this.baseUrl, ""),
        method,
        duration,
        status: response.status,
      });

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          this.logError(`Request aborted after ${duration}ms`, { url, method });
          throw new Error(`Request timeout after ${this.timeout}ms`);
        }
        this.logError(`Network error after ${duration}ms: ${error.message}`, {
          url,
          method,
        });
        throw new Error(`Network error: ${error.message}`);
      }

      throw error;
    }
  }

  private async handleResponse<T>(
    response: Response,
    endpoint: string
  ): Promise<T> {
    if (!response.ok) {
      let errorDetails: ApiError;

      try {
        errorDetails = await response.json();
      } catch {
        errorDetails = {
          message: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
        };
      }

      this.logError(`API Error on ${endpoint}`, {
        status: response.status,
        statusText: response.statusText,
        error: errorDetails,
      });

      const errorMessage =
        errorDetails.message || `Request failed with status ${response.status}`;

      const error = new Error(errorMessage) as Error & {
        status?: number;
        code?: string;
      };
      error.status = response.status;
      error.code = errorDetails.code;

      throw error;
    }

    try {
      const data = await response.json();
      this.log(
        `Successful response from ${endpoint}`,
        CONFIG.FEATURES.ENABLE_DEBUG_LOGS ? data : `[${typeof data}]`
      );
      return data;
    } catch (error) {
      this.logError(`Failed to parse JSON response from ${endpoint}`, error);
      throw new Error("Invalid JSON response from server");
    }
  }

  async get<T>(
    endpoint: string,
    options: {
      cache?: RequestCache;
      revalidate?: number | false;
      tags?: string[];
    } = {}
  ): Promise<T> {
    const headers = await this.getHeaders();
    const fetchOptions: RequestInit = {
      method: "GET",
      headers,
      cache:
        options.cache ||
        (CONFIG.APP.IS_PRODUCTION ? "force-cache" : "no-store"),
    };

    // Next.js specific options
    const nextOptions: any = {};

    if (options.revalidate !== undefined) {
      nextOptions.revalidate = options.revalidate;
    }

    if (options.tags) {
      nextOptions.tags = options.tags;
    }

    if (Object.keys(nextOptions).length > 0) {
      fetchOptions.next = nextOptions;
    }

    const response = await this.fetchWithTimeout(
      `${this.baseUrl}${endpoint}`,
      fetchOptions,
      "GET"
    );

    return this.handleResponse<T>(response, endpoint);
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const headers = await this.getHeaders();

    this.log(
      `POST request to ${endpoint}`,
      CONFIG.FEATURES.ENABLE_DEBUG_LOGS ? data : "[request data]"
    );

    const response = await this.fetchWithTimeout(
      `${this.baseUrl}${endpoint}`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      },
      "POST"
    );

    return this.handleResponse<T>(response, endpoint);
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    const headers = await this.getHeaders();

    this.log(
      `PUT request to ${endpoint}`,
      CONFIG.FEATURES.ENABLE_DEBUG_LOGS ? data : "[request data]"
    );

    const response = await this.fetchWithTimeout(
      `${this.baseUrl}${endpoint}`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
      },
      "PUT"
    );

    return this.handleResponse<T>(response, endpoint);
  }

  async patch<T>(endpoint: string, data: any): Promise<T> {
    const headers = await this.getHeaders();

    this.log(
      `PATCH request to ${endpoint}`,
      CONFIG.FEATURES.ENABLE_DEBUG_LOGS ? data : "[request data]"
    );

    const response = await this.fetchWithTimeout(
      `${this.baseUrl}${endpoint}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify(data),
      },
      "PATCH"
    );

    return this.handleResponse<T>(response, endpoint);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const headers = await this.getHeaders();

    this.log(`DELETE request to ${endpoint}`);

    const response = await this.fetchWithTimeout(
      `${this.baseUrl}${endpoint}`,
      {
        method: "DELETE",
        headers,
      },
      "DELETE"
    );

    return this.handleResponse<T>(response, endpoint);
  }

  // Utility method to check API health
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await this.get("/health", {
        cache: "no-store",
        revalidate: false,
      });
      return response as { status: string; timestamp: string };
    } catch (error) {
      this.logError("Health check failed", error);
      throw error;
    }
  }

  // Method to clear cache (useful for mutations)
  async revalidateTag(tag: string): Promise<void> {
    if (typeof window === "undefined") {
      // Server-side: use Next.js revalidateTag
      const { revalidateTag } = await import("next/cache");
      revalidateTag(tag);
    }
  }
}

export const serverApiClient = new ServerApiClient();
