"use client";

import { type ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { AlertCircle, Loader2, GraduationCap } from "lucide-react";
import Image from "next/image";

interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (!isLoading && user && !["admin", "teacher"].includes(user.role)) {
      router.push("/");
      return;
    }
  }, [user, isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Image src={"image.svg"} alt="logo" fill className="rounded-md" />
          </div>
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <div className="text-center">
            <h2 className="text-lg font-semibold">Loading...</h2>
            <p className="text-sm text-muted-foreground">
              Verifying your access
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Card className="max-w-md p-8">
          <div className="flex items-center gap-3 rounded-lg bg-destructive/10 p-4">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <div>
              <h3 className="font-semibold text-destructive">Access Denied</h3>
              <p className="text-sm text-destructive/80">
                Please log in to continue
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (user && !["admin", "teacher"].includes(user.role)) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Card className="max-w-md p-8">
          <div className="flex items-center gap-3 rounded-lg bg-destructive/10 p-4">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <div>
              <h3 className="font-semibold text-destructive">
                Admin Access Required
              </h3>
              <p className="text-sm text-destructive/80">
                Only administrators and teachers can access this dashboard.
              </p>
              <p className="mt-2 text-xs text-destructive/60">
                Your current role: <strong>{user.role}</strong>
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
