import type React from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-screen w-full bg-background text-foreground overflow-hidden">
      <div className="h-full overflow-y-auto no-scrollbar">
        <main className="flex gap-6 p-6 pt-12 min-h-full ">
          <Sidebar />

          <div className="flex-1 flex flex-col gap-6 p-4 rounded-3xl min-w-0 bg-secondary">
            {children}

            <div className="flex items-center justify-end gap-2 mt-4">
              <div className="w-3.25 h-3.25 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground">
                System Online
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
