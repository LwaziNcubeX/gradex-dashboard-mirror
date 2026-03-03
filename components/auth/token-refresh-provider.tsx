"use client";

import { useEffect, useRef, useCallback } from "react";
import { cookies } from "@/lib/cookie-manager";
import { refreshAccessToken } from "@/lib/api";
import { useRouter } from "next/navigation";

/**
 * Checks token expiry and auto-refreshes before it expires.
 * Runs a check every 60 seconds.
 */
export function TokenRefreshProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const refreshingRef = useRef(false);

  const checkAndRefresh = useCallback(async () => {
    if (refreshingRef.current) return;

    const token = cookies.getAccessToken();
    if (!token) return;

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const expiresAt = decoded.exp * 1000;
      const now = Date.now();
      const timeUntilExpiry = expiresAt - now;

      // Refresh if token expires in less than 5 minutes
      if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
        refreshingRef.current = true;
        try {
          await refreshAccessToken();
        } catch {
          // If refresh fails, redirect to auth
          cookies.clearTokens();
          router.push("/auth");
        } finally {
          refreshingRef.current = false;
        }
      } else if (timeUntilExpiry <= 0) {
        // Token already expired — try refresh
        refreshingRef.current = true;
        try {
          await refreshAccessToken();
        } catch {
          cookies.clearTokens();
          router.push("/auth");
        } finally {
          refreshingRef.current = false;
        }
      }
    } catch {
      // Failed to decode token
    }
  }, [router]);

  useEffect(() => {
    // Check immediately on mount
    checkAndRefresh();

    // Then check every 60 seconds
    const interval = setInterval(checkAndRefresh, 60 * 1000);
    return () => clearInterval(interval);
  }, [checkAndRefresh]);

  return <>{children}</>;
}
