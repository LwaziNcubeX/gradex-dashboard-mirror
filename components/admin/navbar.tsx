"use client";

import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function AdminNavbar() {
  const { user } = useAuth();

  const initials = user
    ? `${user.first_name?.[0]}${user.last_name?.[0]}`.toUpperCase()
    : "AD";

  return (
    <header className="border-b border-slate-200 bg-white px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Dashboard</h2>
          <p className="text-sm text-slate-500">
            Welcome back, {user?.first_name}!
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-900">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
          </div>
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
