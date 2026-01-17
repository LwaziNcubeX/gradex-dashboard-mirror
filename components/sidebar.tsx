"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Layers,
  BarChart3,
  Settings2,
  LogOut,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "DASHBOARD", href: "/" },
  { icon: Users, label: "STUDENTS", href: "/students" },
  { icon: Layers, label: "CONTENT", href: "/content" },
  { icon: BarChart3, label: "ANALYTICS", href: "/analytics" },
];

const bottomNavItems = [
  { icon: MessageSquare, label: "FEEDBACK", href: "/feedback" },
  { icon: Settings2, label: "SETTINGS", href: "/settings" },
];

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`sticky top-24 h-[calc(100vh-8rem)] bg-card rounded-2xl hidden md:flex flex-col p-4 overflow-y-auto transition-all duration-300 ${
        isExpanded ? "w-64" : "w-16"
      }`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="self-end mb-4 p-1.5 rounded-lg bg-secondary hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
      >
        {isExpanded ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>

      <nav className="flex flex-col gap-6">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isExpanded={isExpanded}
            active={
              pathname === item.href || pathname.startsWith(item.href + "/")
            }
          />
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-border flex flex-col gap-6">
        {bottomNavItems.map((item) => (
          <NavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isExpanded={isExpanded}
            active={pathname === item.href}
          />
        ))}
        <button
          className={`flex items-center gap-4 cursor-pointer transition-colors text-muted-foreground hover:text-foreground ${
            !isExpanded ? "justify-center" : ""
          }`}
          title={!isExpanded ? "LOGOUT" : undefined}
        >
          <LogOut className="h-6 w-6 shrink-0" />
          {isExpanded && (
            <span className="text-sm font-medium tracking-wide whitespace-nowrap">
              LOGOUT
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}

function NavItem({
  icon: Icon,
  label,
  href,
  isExpanded,
  active = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  isExpanded: boolean;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-4 cursor-pointer transition-colors ${
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      } ${!isExpanded ? "justify-center" : ""}`}
      title={!isExpanded ? label : undefined}
    >
      <Icon className="h-6 w-6 shrink-0" />
      {isExpanded && (
        <span className="text-sm font-medium tracking-wide whitespace-nowrap">
          {label}
        </span>
      )}
    </Link>
  );
}
