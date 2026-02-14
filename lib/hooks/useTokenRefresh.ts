"use client";

import { useState, useCallback } from "react";
import { refreshAccessToken, RefreshTokenResponse } from "@/lib/api";

interface UseTokenRefreshReturn {
  refreshing: boolean;
  error: string | null;
  refresh: () => Promise<RefreshTokenResponse | null>;
  clearError: () => void;
}

export function useTokenRefresh(): UseTokenRefreshReturn {
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refresh =
    useCallback(async (): Promise<RefreshTokenResponse | null> => {
      setRefreshing(true);
      setError(null);
      try {
        const result = await refreshAccessToken();
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to refresh token";
        setError(message);
        console.error("Token refresh error:", err);
        return null;
      } finally {
        setRefreshing(false);
      }
    }, []);

  return {
    refreshing,
    error,
    refresh,
    clearError,
  };
}
