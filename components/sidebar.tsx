"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Layers,
  ActivityIcon,
  CreditCard,
  FileText,
  Copy,
  Edit,
  MoreHorizontal,
  Trash2,
  LogOut,
  Settings,
  Settings2,
  MessageCircle,
} from "lucide-react";
import { Avatar, AvatarImage } from "@/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { Label } from "recharts";

const navItems = [
  { icon: LayoutDashboard, label: "DASHBOARD", href: "/" },
  { icon: Users, label: "STUDENTS", href: "/students" },
  { icon: Layers, label: "CONTENT", href: "/content" },
  { icon: ActivityIcon, label: "ANALYTICS", href: "/analytics" },
  { icon: CreditCard, label: "FINANCE", href: "/finance" },
  { icon: MessageCircle, label: "FEEDBACK", href: "/feedback" },
  { icon: Settings2, label: "SETTINGS", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const bottomItems = navItems.slice(-2);
  const topItems = navItems.slice(0, -2);

  return (
    <aside
      className={`sticky top-24 h-[calc(100vh-8rem)] bg-secondary rounded-2xl hidden md:flex flex-col p-3 overflow-y-auto transition-all duration-300
      }`}
    >
      <nav className="flex flex-col gap-6 pt-3">
        {topItems.map((item) => (
          <NavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            active={
              pathname === item.href || pathname.startsWith(item.href + "/")
            }
          />
        ))}
      </nav>

      <div className="mt-auto border-t border-border flex flex-col gap-4 pt-2">
        {bottomItems.map((item) => (
          <NavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            active={
              pathname === item.href || pathname.startsWith(item.href + "/")
            }
          />
        ))}
      </div>
    </aside>
  );
}

function NavItem({
  icon: Icon,
  href,
  active = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-4 cursor-pointer transition-colors ${
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      } justify-center`}
    >
      <Icon className="h-5 w-5 shrink-0" />
    </Link>
  );
}
