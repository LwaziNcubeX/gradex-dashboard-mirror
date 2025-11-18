"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  HelpCircle,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

const MENU_ITEMS = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: "Quizzes",
    href: "/admin/quizzes",
    icon: BookOpen,
  },
  {
    title: "Questions",
    href: "/admin/questions",
    icon: HelpCircle,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/auth/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <aside className="flex w-64 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="border-b border-slate-200 px-6 py-8">
        <h1 className="text-2xl font-bold text-slate-900">GradeX</h1>
        <p className="text-sm text-slate-500">Admin Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-6">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-slate-200 p-4">
        <div className="mb-4 rounded-lg bg-slate-50 p-3">
          <p className="text-xs font-semibold text-slate-500">LOGGED IN AS</p>
          <p className="mt-1 text-sm font-medium text-slate-900">
            {user?.first_name} {user?.last_name}
          </p>
          <p className="text-xs text-slate-500">{user?.email}</p>
          <p className="mt-1 inline-block rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 capitalize">
            {user?.role}
          </p>
        </div>

        <Button variant="outline" className="w-full" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
