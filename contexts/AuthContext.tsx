"use client";

/**
 * Authentication Context
 * Provides global auth state and methods to all components
 */

import React, { createContext, useCallback, useEffect, useState } from "react";
import { authService } from "@/services/auth";
import { clearTokens, getRefreshToken, getAccessToken } from "@/lib/api";
import type { User } from "@/types/auth";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Methods
  requestOtp: (email: string) => Promise<void>;
  login: (email: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = getAccessToken();

      if (token) {
        try {
          const profile = await authService.getProfile();
          setUser(profile);
        } catch (err) {
          console.error("Failed to fetch profile:", err);
          clearTokens();
          setUser(null);
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const handleRequestOtp = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.requestOtp(email);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to request OTP";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = useCallback(async (email: string, otp: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await authService.login(email, otp);
      setUser(data.user);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Logout failed";
      setError(message);
    } finally {
      clearTokens();
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    isAuthenticated: user !== null,
    requestOtp: handleRequestOtp,
    login: handleLogin,
    logout: handleLogout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
