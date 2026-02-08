class CookieManager {
  public saveTokens(data: any) {
    const accessTokenMaxAge = 14 * 24 * 60 * 60;
    const refreshTokenMaxAge = 30 * 24 * 60 * 60;
    const accessToken = data.access_token;
    const refreshToken = data.refresh_token;

    // add http only later, tokens were not being saved
    document.cookie = `accessToken=${accessToken}; Secure; Path=/; Max-Age=${accessTokenMaxAge};`;
    document.cookie = `refreshToken=${refreshToken}; Secure; Path=/; Max-Age=${refreshTokenMaxAge};`;
  }

  public getAccessToken() {
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find((cookie) =>
      cookie.startsWith("accessToken=")
    );
    const accessToken = tokenCookie?.split("=")[1];

    return accessToken;
  }
}

export const cookies = new CookieManager();
