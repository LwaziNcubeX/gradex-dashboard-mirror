import { getAuthToken } from "./auth";
import { CONFIG } from "./config";

export class ServerApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string = CONFIG.API.BASE_URL) {
    this.baseUrl = baseUrl;
    this.timeout = CONFIG.API.TIMEOUT;
  }

  private async getHeaders(): Promise<HeadersInit> {
    const token = await getAuthToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "X-Server-Version": CONFIG.APP.VERSION,
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
    options: {
      cache?: RequestCache;
      revalidate?: number | false;
    } = {}
  ): Promise<T> {
    const headers = await this.getHeaders();
    const fetchOptions: RequestInit = {
      headers,
      cache: options.cache || "no-store",
    };

    if (options.revalidate !== undefined) {
      fetchOptions["next"] = { revalidate: options.revalidate };
    }

    const response = await this.fetchWithTimeout(
      `${this.baseUrl}${endpoint}`,
      fetchOptions
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
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Request failed" }));
      throw new Error(error.message || "Request failed");
    }

    return response.json();
  }

  async delete<T>(endpoint: string): Promise<T> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Request failed" }));
      throw new Error(error.message || "Request failed");
    }

    return response.json();
  }
}

export const serverApiClient = new ServerApiClient();
