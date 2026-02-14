import Cookies from "js-cookie";
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

class CookieManager {
  private readonly ACCESS_TOKEN_KEY = "accessToken";
  private readonly REFRESH_TOKEN_KEY = "refreshToken";
  private readonly ACCESS_TOKEN_EXPIRY = 14; // days
  private readonly REFRESH_TOKEN_EXPIRY = 30; // days

  public saveTokens(data: TokenResponse): void {
    try {
      Cookies.set(this.ACCESS_TOKEN_KEY, data.access_token, {
        expires: this.ACCESS_TOKEN_EXPIRY,
        secure: true,
        sameSite: "strict",
        path: "/",
      });

      Cookies.set(this.REFRESH_TOKEN_KEY, data.refresh_token, {
        expires: this.REFRESH_TOKEN_EXPIRY,
        secure: true,
        sameSite: "strict",
        path: "/",
      });
    } catch (error) {
      console.error("Failed to save tokens:", error);
      throw new Error("Token storage failed");
    }
  }

  public getAccessToken(): string | undefined {
    try {
      return Cookies.get(this.ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error("Failed to retrieve access token:", error);
      return undefined;
    }
  }

  public getRefreshToken(): string | undefined {
    try {
      return Cookies.get(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error("Failed to retrieve refresh token:", error);
      return undefined;
    }
  }

  public clearTokens(): void {
    try {
      Cookies.remove(this.ACCESS_TOKEN_KEY, { path: "/" });
      Cookies.remove(this.REFRESH_TOKEN_KEY, { path: "/" });
    } catch (error) {
      console.error("Failed to clear tokens:", error);
    }
  }

  public isTokenExpired(token: string): boolean {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      console.error("Failed to decode token:", error);
      return true;
    }
  }
}

export const cookies = new CookieManager();
