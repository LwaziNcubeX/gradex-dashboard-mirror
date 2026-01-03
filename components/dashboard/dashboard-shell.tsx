"use client";

import type React from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import type { ReactNode } from "react";

interface DashboardShellProps {
  children: ReactNode;
  title?: string;
  description?: string;
  actions?: ReactNode;
}

export function DashboardShell({
  children,
  title,
  description,
  actions,
}: DashboardShellProps) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      defaultOpen={false}
    >
      <AppSidebar variant="sidebar" />
      <SidebarInset>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-6 py-6 px-4 lg:px-6">
              {(title || actions) && (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {title && (
                    <div>
                      <h1 className="text-2xl font-semibold tracking-tight">
                        {title}
                      </h1>
                      {description && (
                        <p className="text-muted-foreground mt-1">
                          {description}
                        </p>
                      )}
                    </div>
                  )}
                  {actions && (
                    <div className="flex items-center gap-2">{actions}</div>
                  )}
                </div>
              )}
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
