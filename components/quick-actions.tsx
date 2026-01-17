"use client";

import { Plus, Upload, Users, FileText } from "lucide-react";
import Link from "next/link";

const actions = [
  {
    label: "Add Question",
    icon: Plus,
    href: "/content",
    color: "primary",
  },
  {
    label: "Create Quiz",
    icon: FileText,
    href: "/content",
    color: "chart-2",
  },
  {
    label: "Import Data",
    icon: Upload,
    href: "/settings",
    color: "chart-3",
  },
  {
    label: "Manage Students",
    icon: Users,
    href: "/students",
    color: "chart-4",
  },
];

const colorClasses: Record<
  string,
  { bg: string; hover: string; text: string }
> = {
  primary: {
    bg: "bg-primary/10",
    hover: "hover:bg-primary/20",
    text: "text-primary",
  },
  "chart-2": {
    bg: "bg-chart-2/10",
    hover: "hover:bg-chart-2/20",
    text: "text-chart-2",
  },
  "chart-3": {
    bg: "bg-chart-3/10",
    hover: "hover:bg-chart-3/20",
    text: "text-chart-3",
  },
  "chart-4": {
    bg: "bg-chart-4/10",
    hover: "hover:bg-chart-4/20",
    text: "text-chart-4",
  },
};

export function QuickActions() {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
        <p className="text-sm text-muted-foreground mt-1">Common tasks</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const colors = colorClasses[action.color];
          return (
            <Link
              key={action.label}
              href={action.href}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl ${colors.bg} ${colors.hover} transition-colors`}
            >
              <action.icon className={`h-5 w-5 ${colors.text}`} />
              <span className="text-xs font-medium text-foreground text-center">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
