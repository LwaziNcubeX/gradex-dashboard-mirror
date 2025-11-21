"use client";

import { useErrorCache } from "@/hooks/use-error-cache";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";

interface ErrorBannerProps {
  endpoint: string;
  onRetry?: () => void;
  dismissible?: boolean;
}

/**
 * Visual component that shows cached errors with retry option
 * Use in components that need to display API errors with retry UI
 */
export function ErrorBanner({
  endpoint,
  onRetry,
  dismissible = true,
}: ErrorBannerProps) {
  const { error, canRetry, waitTime, retry, isBlocked } =
    useErrorCache(endpoint);

  if (!error || !isBlocked) {
    return null;
  }

  const handleRetry = () => {
    retry();
    onRetry?.();
  };

  return (
    <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-sm">
      <div className="flex gap-3">
        <AlertCircle className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
        <div className="flex-1">
          <p className="font-semibold text-destructive mb-1">{error.message}</p>
          <p className="text-destructive/80 text-xs">
            {waitTime > 0
              ? `Request blocked. Try again in ${waitTime}s`
              : "You can try again now"}
          </p>
        </div>
        <div className="flex gap-2">
          {canRetry && (
            <Button
              size="sm"
              variant="destructive"
              onClick={handleRetry}
              className="gap-2"
            >
              Retry
            </Button>
          )}
          {!canRetry && waitTime > 0 && (
            <Button size="sm" variant="destructive" disabled className="gap-2">
              <Loader2 className="h-3 w-3 animate-spin" />
              {waitTime}s
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
