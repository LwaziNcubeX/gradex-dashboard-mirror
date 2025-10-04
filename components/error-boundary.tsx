"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { CONFIG } from "@/lib/config";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error in development or if error reporting is enabled
    if (
      CONFIG.FEATURES.ENABLE_DEBUG_LOGS ||
      CONFIG.FEATURES.ENABLE_ERROR_REPORTING
    ) {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    // Here you could send to error reporting service like Sentry
    if (CONFIG.FEATURES.ENABLE_ERROR_REPORTING && CONFIG.APP.IS_PRODUCTION) {
      // Example: Sentry.captureException(error, { contexts: { react: errorInfo } })
    }
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      const { error } = this.state;
      const FallbackComponent = this.props.fallback;

      if (FallbackComponent && error) {
        return <FallbackComponent error={error} retry={this.retry} />;
      }

      return <DefaultErrorFallback error={error} retry={this.retry} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  retry: () => void;
}

function DefaultErrorFallback({ error, retry }: ErrorFallbackProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-xl">Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          {CONFIG.FEATURES.ENABLE_DEBUG_LOGS && error && (
            <div className="rounded-md bg-muted p-3 text-left text-sm">
              <pre className="whitespace-pre-wrap break-words text-xs">
                {error.message}
              </pre>
            </div>
          )}
          <p className="text-muted-foreground">
            We apologize for the inconvenience. Please try refreshing the page.
          </p>
          <Button onClick={retry} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
}
