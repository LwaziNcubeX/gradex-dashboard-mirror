/**
 * Error Cache and Retry Management
 * Prevents API spam by caching errors and implementing exponential backoff
 */

interface CachedError {
  error: Error;
  timestamp: number;
  retryCount: number;
  nextRetryTime: number;
}

// Cache for failed requests - Map<endpoint, CachedError>
const errorCache = new Map<string, CachedError>();

// Configuration
const ERROR_CACHE_CONFIG = {
  // Initial retry delay in ms (1 second)
  INITIAL_RETRY_DELAY: 1000,
  // Max retry delay (30 seconds)
  MAX_RETRY_DELAY: 30000,
  // Cache TTL for permanent errors like 404 (5 minutes)
  PERMANENT_ERROR_TTL: 5 * 60 * 1000,
  // Cache TTL for transient errors like 5xx (30 seconds)
  TRANSIENT_ERROR_TTL: 30 * 1000,
  // Max retry attempts before permanent blacklist
  MAX_RETRIES: 3,
};

/**
 * Determine if an error is permanent (shouldn't be retried)
 */
function isPermanentError(status?: number): boolean {
  if (!status) return false;
  // 4xx errors (except 429) are permanent
  return (status >= 400 && status < 500 && status !== 429) || status >= 500;
}

/**
 * Get cache TTL based on error type
 */
function getCacheTTL(status?: number): number {
  if (!status) return ERROR_CACHE_CONFIG.TRANSIENT_ERROR_TTL;

  // 404 and 403 are permanent errors
  if (status === 404 || status === 403) {
    return ERROR_CACHE_CONFIG.PERMANENT_ERROR_TTL;
  }

  // Server errors are transient
  if (status >= 500) {
    return ERROR_CACHE_CONFIG.TRANSIENT_ERROR_TTL;
  }

  // Other 4xx errors
  if (status >= 400) {
    return ERROR_CACHE_CONFIG.PERMANENT_ERROR_TTL;
  }

  return ERROR_CACHE_CONFIG.TRANSIENT_ERROR_TTL;
}

/**
 * Check if we should retry this request based on cache
 * @param endpoint - The API endpoint being called
 * @returns { shouldRetry, error, waitTime } or null if cache miss
 */
export function getErrorCacheStatus(endpoint: string): {
  shouldRetry: boolean;
  error?: Error;
  waitTime?: number;
} | null {
  const cached = errorCache.get(endpoint);

  if (!cached) {
    return null; // No cache entry
  }

  const now = Date.now();
  const age = now - cached.timestamp;
  const ttl = getCacheTTL((cached.error as any).status);

  // Cache expired
  if (age > ttl) {
    errorCache.delete(endpoint);
    return null;
  }

  // Check if we should retry
  const now2 = Date.now();
  const timeSinceLastRetry = now2 - cached.timestamp;

  // Still waiting for backoff timeout
  if (now2 < cached.nextRetryTime) {
    return {
      shouldRetry: false,
      error: cached.error,
      waitTime: cached.nextRetryTime - now2,
    };
  }

  // Can retry
  return {
    shouldRetry: true,
    error: cached.error,
  };
}

/**
 * Cache an error for an endpoint
 * @param endpoint - The API endpoint
 * @param error - The error that occurred
 */
export function cacheError(endpoint: string, error: Error): void {
  const cached = errorCache.get(endpoint);
  const retryCount = cached ? cached.retryCount + 1 : 0;
  const status = (error as any).status;

  // Calculate backoff with exponential increase: 1s, 2s, 4s, 8s...
  const delayMultiplier = Math.pow(2, Math.min(retryCount, 4));
  const jitter = Math.random() * 1000; // Add up to 1s random jitter
  const delay = Math.min(
    ERROR_CACHE_CONFIG.INITIAL_RETRY_DELAY * delayMultiplier + jitter,
    ERROR_CACHE_CONFIG.MAX_RETRY_DELAY
  );

  const nextRetryTime = Date.now() + delay;

  errorCache.set(endpoint, {
    error,
    timestamp: Date.now(),
    retryCount,
    nextRetryTime,
  });

  if (process.env.NEXT_PUBLIC_API_DEBUG === "true") {
    console.log(
      `[ERROR_CACHE] Cached error for ${endpoint}: ${error.message}`,
      {
        retryCount,
        nextRetryTime: new Date(nextRetryTime),
        status,
      }
    );
  }
}

/**
 * Clear cache for a specific endpoint (e.g., on successful request)
 */
export function clearErrorCache(endpoint: string): void {
  if (errorCache.has(endpoint)) {
    errorCache.delete(endpoint);
    if (process.env.NEXT_PUBLIC_API_DEBUG === "true") {
      console.log(`[ERROR_CACHE] Cleared cache for ${endpoint}`);
    }
  }
}

/**
 * Clear all error cache
 */
export function clearAllErrorCache(): void {
  errorCache.clear();
  if (process.env.NEXT_PUBLIC_API_DEBUG === "true") {
    console.log("[ERROR_CACHE] Cleared all cache");
  }
}

/**
 * Get cache statistics (for debugging)
 */
export function getErrorCacheStats(): {
  totalCached: number;
  entries: Array<{ endpoint: string; status?: number; age: number }>;
} {
  const now = Date.now();
  const entries = Array.from(errorCache.entries()).map(
    ([endpoint, cached]) => ({
      endpoint,
      status: (cached.error as any).status,
      age: now - cached.timestamp,
    })
  );

  return {
    totalCached: entries.length,
    entries,
  };
}
