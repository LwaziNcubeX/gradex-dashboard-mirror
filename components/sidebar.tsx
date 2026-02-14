"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Layers,
  BarChart3,
  MessageSquare,
  Settings,
} from "lucide-react";
import { GradeXLogo } from "@/components/gradex-logo";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const mainNavItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/" },
  { icon: Users, label: "Students", href: "/students" },
  { icon: Layers, label: "Content", href: "/content" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: MessageSquare, label: "Feedback", href: "/feedback" },
];

const bottomNavItems = [
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col items-center w-16 border-r border-border bg-background py-4 shrink-0">
      {/* Logo */}
      <div className="flex items-center justify-center h-10 mb-6">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-sm font-bold text-primary-foreground">G</span>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex flex-col items-center gap-1 flex-1">
        {mainNavItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href + "/"));
          return (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={isActive}
            />
          );
        })}
      </nav>

      {/* Bottom nav */}
      <div className="flex flex-col items-center gap-1 pt-4 border-t border-border mt-auto">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={isActive}
            />
          );
        })}
      </div>
    </aside>
  );
}

function NavItem({
  icon: Icon,
  label,
  href,
  active = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  active?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={`relative flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
            active
              ? "bg-primary/15 text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          }`}
        >
          {active && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[calc(50%+12px)] w-1 h-5 rounded-full bg-primary" />
          )}
          <Icon className="h-[18px] w-[18px]" />
          <span className="sr-only">{label}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

/* Mobile navigation drawer */
export function MobileNav({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-64 bg-background border-border p-0">
        <SheetHeader className="p-4 pb-2">
          <SheetTitle>
            <GradeXLogo className="text-foreground h-7 w-auto" />
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-0.5 px-3 py-2">
          {mainNavItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href + "/"));
            return (
              <MobileNavItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                active={isActive}
                onClick={() => onOpenChange(false)}
              />
            );
          })}
        </nav>

        <div className="mt-auto border-t border-border px-3 py-2">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <MobileNavItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                active={isActive}
                onClick={() => onOpenChange(false)}
              />
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MobileNavItem({
  icon: Icon,
  label,
  href,
  active = false,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-primary/15 text-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
      }`}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />
      {label}
    </Link>
  );
}
