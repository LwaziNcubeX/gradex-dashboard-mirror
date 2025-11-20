"use client";

/**
 * Authentication Context
 * Provides global auth state and methods to all components
 */

import React, { createContext, useCallback, useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Mark as mounted on client to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use SWR to fetch and cache profile. Only fetch if mounted (client-side) and token exists.
  const shouldFetch = isMounted && !!getAccessToken();

  const {
    data: profile,
    error: swrError,
    isLoading: profileLoading,
  } = useSWR(
    shouldFetch ? "auth/profile" : null,
    async () => await authService.getProfile(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000 * 60 * 5, // dedupe identical requests for 5 minutes
    }
  );

  // Combine SWR loading state with local operation loading (login/logout)
  const combinedLoading = isLoading || !!profileLoading;
  if (swrError && !error) {
    // surface SWR errors into local error state
    setError(swrError instanceof Error ? swrError.message : String(swrError));
  }

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
      // Update SWR cache so consumers see the user immediately
      try {
        mutate("auth/profile", data.user, false);
      } catch (e) {
        // ignore mutate errors
      }
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
      // Clear SWR cache for profile so consumers update
      try {
        mutate("auth/profile", null, false);
      } catch (e) {
        // ignore
      }
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user: (profile as User) || null,
    isLoading: combinedLoading,
    error,
    isAuthenticated: !!profile,
    requestOtp: handleRequestOtp,
    login: handleLogin,
    logout: handleLogout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
