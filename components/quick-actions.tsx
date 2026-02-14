"use client";

import { Plus, Upload, Users, FileText } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    label: "Students",
    icon: Users,
    href: "/students",
    color: "chart-4",
  },
];

const colorClasses: Record<string, { bg: string; hover: string; text: string }> = {
  primary: { bg: "bg-primary/10", hover: "hover:bg-primary/20", text: "text-primary" },
  "chart-2": { bg: "bg-chart-2/10", hover: "hover:bg-chart-2/20", text: "text-chart-2" },
  "chart-3": { bg: "bg-chart-3/10", hover: "hover:bg-chart-3/20", text: "text-chart-3" },
  "chart-4": { bg: "bg-chart-4/10", hover: "hover:bg-chart-4/20", text: "text-chart-4" },
};

export function QuickActions() {
  return (
    <Card className="rounded-xl">
      <CardHeader className="px-4 pt-4 pb-2">
        <CardTitle className="text-sm font-medium text-foreground">Quick Actions</CardTitle>
      </CardHeader>

      <CardContent className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action) => {
            const colors = colorClasses[action.color];
            return (
              <Link
                key={action.label}
                href={action.href}
                className={`flex items-center gap-2.5 p-2.5 rounded-lg ${colors.bg} ${colors.hover} transition-colors`}
              >
                <action.icon className={`h-4 w-4 ${colors.text} shrink-0`} />
                <span className="text-xs font-medium text-foreground">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
