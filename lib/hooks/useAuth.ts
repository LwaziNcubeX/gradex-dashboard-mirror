import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UseAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
}

// Custom hook for authentication management
// Provides authentication status and logout functionality

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/check", {
        method: "GET",
        credentials: "include",
      });
      setIsAuthenticated(response.ok);
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setIsAuthenticated(false);
      router.push("/auth");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }, [router]);

  return {
    isAuthenticated,
    isLoading,
    logout,
  };
}
