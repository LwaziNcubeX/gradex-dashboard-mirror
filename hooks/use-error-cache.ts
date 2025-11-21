"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { getErrorCacheStatus, clearErrorCache } from "@/lib/error-cache";

interface UseErrorCacheOptions {
  onError?: (error: Error) => void;
  onRetryAvailable?: () => void;
  autoRetry?: boolean;
  autoRetryInterval?: number;
}

/**
 * Hook to manage error cache and retry logic
 * Helps prevent spamming the API with repeated requests
 */
export function useErrorCache(
  endpoint: string,
  options: UseErrorCacheOptions = {}
) {
  const [error, setError] = useState<Error | null>(null);
  const [waitTime, setWaitTime] = useState<number>(0);
  const [canRetry, setCanRetry] = useState(true);
  const retryIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const autoRetryInterval = options.autoRetryInterval || 1000; // Check every second

  // Check cache on mount and interval
  useEffect(() => {
    const checkCache = () => {
      const cacheStatus = getErrorCacheStatus(endpoint);

      if (cacheStatus) {
        if (cacheStatus.error) {
          setError(cacheStatus.error);
        }
        setCanRetry(cacheStatus.shouldRetry);

        if (cacheStatus.waitTime) {
          setWaitTime(Math.ceil(cacheStatus.waitTime / 1000)); // Convert to seconds

          if (!cacheStatus.shouldRetry) {
            // Set up interval to check when we can retry
            if (retryIntervalRef.current)
              clearInterval(retryIntervalRef.current);
            retryIntervalRef.current = setInterval(() => {
              const updated = getErrorCacheStatus(endpoint);
              if (updated?.shouldRetry) {
                setCanRetry(true);
                setWaitTime(0);
                setError(null);
                options.onRetryAvailable?.();
                if (retryIntervalRef.current)
                  clearInterval(retryIntervalRef.current);
              } else if (updated?.waitTime) {
                setWaitTime(Math.ceil(updated.waitTime / 1000));
              }
            }, autoRetryInterval);
          }
        } else {
          setCanRetry(true);
          setWaitTime(0);
        }
      } else {
        setError(null);
        setCanRetry(true);
        setWaitTime(0);
      }
    };

    checkCache();

    return () => {
      if (retryIntervalRef.current) clearInterval(retryIntervalRef.current);
    };
  }, [endpoint, autoRetryInterval, options]);

  const retry = useCallback(() => {
    clearErrorCache(endpoint);
    setError(null);
    setCanRetry(true);
    setWaitTime(0);
  }, [endpoint]);

  return {
    error,
    canRetry,
    waitTime, // seconds remaining before retry
    retry,
    isBlocked: !!error && !canRetry,
  };
}

/**
 * Hook to prevent repeated API calls for the same endpoint
 * Useful for preventing spam during user interactions
 */
export function useRequestThrottle(
  endpoint: string,
  cooldownMs: number = 1000
) {
  const [lastRequestTime, setLastRequestTime] = useState<number>(0);
  const [isThrottled, setIsThrottled] = useState(false);
  const [nextAvailableTime, setNextAvailableTime] = useState<number>(0);

  const canMakeRequest = useCallback((): boolean => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;

    if (timeSinceLastRequest < cooldownMs) {
      setIsThrottled(true);
      setNextAvailableTime(lastRequestTime + cooldownMs);
      return false;
    }

    setIsThrottled(false);
    return true;
  }, [lastRequestTime, cooldownMs]);

  const markRequestTime = useCallback(() => {
    setLastRequestTime(Date.now());
  }, []);

  useEffect(() => {
    if (!isThrottled) return;

    const interval = setInterval(() => {
      const now = Date.now();
      if (now >= nextAvailableTime) {
        setIsThrottled(false);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isThrottled, nextAvailableTime]);

  return {
    canMakeRequest,
    markRequestTime,
    isThrottled,
    waitTime: Math.max(0, nextAvailableTime - Date.now()),
  };
}
