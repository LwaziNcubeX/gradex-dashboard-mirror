"use client";

import type React from "react";
import { useState } from "react";
import { Sidebar } from "@/components/sidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      {/* Desktop sidebar */}
      <div className="ml-2">
        <Sidebar />
      </div>

      {/* Main area: header + content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* <Header onMobileMenuToggle={() => setMobileNavOpen(true)} /> */}

        <main className="flex-1 overflow-y-auto no-scrollbar">
          <div className="flex flex-col gap-4 p-4 md:p-6">{children}</div>
        </main>
      </div>

      {/* Mobile navigation drawer */}
      {/* <MobileNav open={mobileNavOpen} onOpenChange={setMobileNavOpen} /> */}
    </div>
  );
}
