"use client";

import { useState, useCallback } from "react";
import { getProfile, updateProfile, UserProfile } from "@/lib/api";

interface UseProfileReturn {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateUserProfile: (firstName: string, lastName: string) => Promise<void>;
  clearError: () => void;
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch profile";
      setError(message);
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserProfile = useCallback(
    async (firstName: string, lastName: string) => {
      setLoading(true);
      setError(null);
      try {
        const updatedProfile = await updateProfile(firstName, lastName);
        setProfile(updatedProfile);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update profile";
        setError(message);
        console.error("Profile update error:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateUserProfile,
    clearError,
  };
}
