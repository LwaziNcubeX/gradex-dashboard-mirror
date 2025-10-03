import { cookies } from "next/headers"

const API_BASE_URL = "https://api-gradex.rapidshyft.com/"
const TOKEN_COOKIE_NAME = "gradex_admin_token"
const REFRESH_TOKEN_COOKIE_NAME = "gradex_refresh_token"

export interface User {
  user_id: string
  email: string
  name: string
  role: "admin" | "teacher" | "student"
}

export async function setAuthToken(accessToken: string, refreshToken?: string) {
  const cookieStore = await cookies()

  cookieStore.set(TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 1 day for access token
    path: "/",
  })

  if (refreshToken) {
    cookieStore.set(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days for refresh token
      path: "/",
    })
  }
}

export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(TOKEN_COOKIE_NAME)?.value
}

export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value
}

export async function removeAuthToken() {
  const cookieStore = await cookies()
  cookieStore.delete(TOKEN_COOKIE_NAME)
  cookieStore.delete(REFRESH_TOKEN_COOKIE_NAME)
}

export async function getCurrentUser(): Promise<User | null> {
  const token = await getAuthToken()

  if (!token) {
    return null
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.data || data.user || data
  } catch (error) {
    return null
  }
}

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === "admin" || user?.role === "teacher"
}
