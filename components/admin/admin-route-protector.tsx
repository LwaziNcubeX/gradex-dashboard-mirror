"use client";

/**
 * Admin Route Protector Component
 * Ensures only admin/teacher users can access admin routes
 * Redirects non-admin users to home page
 */

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";

interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    // If not authenticated, wait for auth check
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    // If user exists but doesn't have admin/teacher role, redirect to home
    if (!isLoading && user && !["admin", "teacher"].includes(user.role)) {
      router.push("/");
      return;
    }
  }, [user, isLoading, isAuthenticated, router]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Card className="p-8 text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-blue-600" />
          <h2 className="text-lg font-semibold text-slate-900">Loading...</h2>
          <p className="mt-2 text-sm text-slate-600">Verifying your access</p>
        </Card>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Card className="max-w-md p-8">
          <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">Access Denied</h3>
              <p className="text-sm text-red-700">Please log in to continue</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Not admin/teacher
  if (user && !["admin", "teacher"].includes(user.role)) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Card className="max-w-md p-8">
          <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">
                Admin Access Required
              </h3>
              <p className="text-sm text-red-700">
                Only administrators and teachers can access this dashboard.
              </p>
              <p className="mt-2 text-xs text-red-600">
                Your current role: <strong>{user.role}</strong>
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // User is authenticated and has admin/teacher role
  return <>{children}</>;
}
