"use client";
import { GridBackground } from "@/components/auth/grid-background";
import { AdminLoginForm } from "@/components/auth/login-form";
import { saveAuth } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AuthPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Check if already authenticated, redirect to dashboard
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          router.push("/");
        }
      } catch (error) {
        console.error("Auth check error:", error);
      }
    };
    checkAuth();
  }, [router]);

  return (
    <div>
      <main className="relative flex min-h-screen items-center justify-center px-4">
        <GridBackground />

        <div className="relative z-10 flex w-full flex-col items-center gap-8">
          {/* Branding above card */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="h-px w-8 bg-border" />
            <span className="text-xs font-medium uppercase tracking-[0.2em]">
              Dashboard
            </span>
            <div className="h-px w-8 bg-border" />
          </div>

          <AdminLoginForm saveAuth={saveAuth} />
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
