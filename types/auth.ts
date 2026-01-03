export interface User {
  user_id: string;
  email: string;
  name: string;
  role: "student" | "teacher" | "admin";
  is_verified: boolean;
  created_at: string;
  last_login: string;
  total_xp: number;
  total_coins: number;
  current_level: number;
  quizzes_completed: number;
  streak_days: number;
  longest_streak: number;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
}

export interface LoginResponse {
  success: boolean;
  data: {
    access_token: string;
    refresh_token: string;
    token_type: "bearer";
    user: User;
  };
}

export interface RequestOtpRequest {
  email: string;
}

export interface LoginRequest {
  email: string;
  otp: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  data: {
    access_token: string;
    refresh_token: string;
    token_type: "bearer";
  };
}

export interface LogoutRequest {
  refresh_token: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface ProfileResponse {
  success: boolean;
  data: User;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  data?: unknown;
}
