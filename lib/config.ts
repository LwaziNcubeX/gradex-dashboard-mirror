/**
 * Central configuration file for the application
 * This file contains all environment-specific configurations
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api-gradex.rapidshyft.com",
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
} as const;

// Authentication Configuration
export const AUTH_CONFIG = {
  TOKEN_COOKIE_NAME: "gradex_admin_token",
  REFRESH_TOKEN_COOKIE_NAME: "gradex_refresh_token",
  ACCESS_TOKEN_EXPIRY: 60 * 60 * 24, // 1 day in seconds
  REFRESH_TOKEN_EXPIRY: 60 * 60 * 24 * 7, // 7 days in seconds
} as const;

// App Configuration
export const APP_CONFIG = {
  NAME: "GradeX Dashboard",
  DESCRIPTION: "Educational quiz management platform",
  VERSION: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
  ENV: process.env.NODE_ENV || "development",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
  ENABLE_ERROR_REPORTING:
    process.env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING === "true",
  ENABLE_DEBUG_LOGS:
    process.env.NEXT_PUBLIC_ENABLE_DEBUG_LOGS === "development",
} as const;

// Cache Configuration
export const CACHE_CONFIG = {
  STATIC_CACHE_DURATION: 60 * 60, // 1 hour
  API_CACHE_DURATION: 5 * 60, // 5 minutes
  REVALIDATE_TIME: 60, // 1 minute for ISR
} as const;

// API Endpoints Configuration
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REQUEST_OTP: "/auth/request-otp",
    REFRESH_TOKEN: "/auth/refresh",
  },

  // Questions
  QUESTIONS: {
    LIST: "/questions",
    CREATE: "/questions/create",
    UPDATE: (id: string) => `/questions/${id}`,
    DELETE: (id: string) => `/questions/${id}`,
  },

  // Quizzes
  QUIZZES: {
    LIST: "/quiz/list",
    CREATE: "/quiz/create",
    UPDATE: (id: string) => `/quiz/${id}`,
    DELETE: (id: string) => `/quiz/${id}`,
    GET_BY_ID: (id: string) => `/quiz/${id}`,
  },

  // Levels
  LEVELS: {
    LIST: "/levels",
    CREATE: "/levels/create",
    UPDATE: (id: string) => `/levels/${id}`,
    DELETE: (id: string) => `/levels/${id}`,
  },

  // Dashboard/Stats
  DASHBOARD: {
    STATS: "/dashboard/stats",
    RECENT_ACTIVITY: "/dashboard/recent-activity",
  },
} as const;

// Validation helpers
export const validateConfig = () => {
  const requiredEnvVars = ["NEXT_PUBLIC_API_BASE_URL"];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0 && APP_CONFIG.IS_PRODUCTION) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }

  return true;
};

// Export all configurations
export const CONFIG = {
  API: API_CONFIG,
  AUTH: AUTH_CONFIG,
  APP: APP_CONFIG,
  FEATURES: FEATURE_FLAGS,
  CACHE: CACHE_CONFIG,
  ENDPOINTS: API_ENDPOINTS,
} as const;

export default CONFIG;
