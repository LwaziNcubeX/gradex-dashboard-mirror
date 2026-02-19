import { cookies } from "../cookie-manager";

const getApiUrl = (): string => {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
};

export const API_BASE_URL = getApiUrl();
export const API_URL = `${API_BASE_URL}/admin`;

export const getHeaders = (token?: string): Record<string, string> => {
  const accessToken = token ?? cookies.getAccessToken();

  if (!accessToken) {
    return {
      "Content-Type": "application/json",
    };
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
};

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function handleApiResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.message || "API request failed",
      data,
    );
  }

  return data;
}
