import { getAuthToken } from "./auth";

const API_BASE_URL = "https://api-gradex.rapidshyft.com";

export class ServerApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async getHeaders(): Promise<HeadersInit> {
    const token = await getAuthToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  async get<T>(endpoint: string): Promise<T> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Request failed" }));
      throw new Error(error.message || "Request failed");
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