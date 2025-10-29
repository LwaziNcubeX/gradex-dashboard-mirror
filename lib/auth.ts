import { CONFIG } from "./config";

// Dynamically import cookies only on server-side
const getCookies = async () => {
  if (typeof window !== "undefined") {
    throw new Error("Auth functions can only be used on the server side");
  }
  const { cookies } = await import("next/headers");
  return cookies;
};

export interface User {
  user_id: string;
  email: string;
  name: string;
  role: "admin" | "teacher" | "student";
}

export async function setAuthToken(accessToken: string, refreshToken?: string) {
  const cookies = await getCookies();
  const cookieStore = await cookies();

  console.log(
    "[Auth] Setting access token:",
    accessToken ? "present" : "missing"
  );
  console.log(
    "[Auth] Setting refresh token:",
    refreshToken ? "present" : "missing"
  );

  cookieStore.set(CONFIG.AUTH.TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: CONFIG.APP.IS_PRODUCTION,
    sameSite: "lax",
    maxAge: CONFIG.AUTH.ACCESS_TOKEN_EXPIRY,
    path: "/",
  });

  console.log("[Auth] Access token cookie set:", CONFIG.AUTH.TOKEN_COOKIE_NAME);

  if (refreshToken) {
    cookieStore.set(CONFIG.AUTH.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: CONFIG.APP.IS_PRODUCTION,
      sameSite: "lax",
      maxAge: CONFIG.AUTH.REFRESH_TOKEN_EXPIRY,
      path: "/",
    });
    console.log(
      "[Auth] Refresh token cookie set:",
      CONFIG.AUTH.REFRESH_TOKEN_COOKIE_NAME
    );
  }
}

export async function getAuthToken(): Promise<string | undefined> {
  const cookies = await getCookies();
  const cookieStore = await cookies();
  return cookieStore.get(CONFIG.AUTH.TOKEN_COOKIE_NAME)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  const cookies = await getCookies();
  const cookieStore = await cookies();
  return cookieStore.get(CONFIG.AUTH.REFRESH_TOKEN_COOKIE_NAME)?.value;
}

export async function removeAuthToken() {
  const cookies = await getCookies();
  const cookieStore = await cookies();
  cookieStore.delete(CONFIG.AUTH.TOKEN_COOKIE_NAME);
  cookieStore.delete(CONFIG.AUTH.REFRESH_TOKEN_COOKIE_NAME);
}

export async function getCurrentUser(): Promise<User | null> {
  const token = await getAuthToken();

  if (!token) {
    console.log("[Auth] No token found for getCurrentUser");
    return null;
  }

  try {
    const response = await fetch(`${CONFIG.API.BASE_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error(
        "[Auth] Failed to fetch user profile, status:",
        response.status
      );
      return null;
    }

    const data = await response.json();
    console.log("[Auth] User profile data:", data);
    return data.data || data.user || data;
  } catch (error) {
    console.error("[Auth] Error fetching user profile:", error);
    return null;
  }
}

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === "admin" || user?.role === "teacher";
}
