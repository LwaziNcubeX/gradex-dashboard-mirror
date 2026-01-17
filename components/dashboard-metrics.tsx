"use client";

import {
  Users,
  BookOpen,
  Trophy,
  TrendingUp,
  Target,
  Clock,
} from "lucide-react";

const metrics = [
  {
    label: "Active Students",
    value: "12,847",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    color: "primary",
  },
  {
    label: "Total Questions",
    value: "3,492",
    change: "+248",
    trend: "up",
    icon: BookOpen,
    color: "chart-2",
  },
  {
    label: "Quizzes Completed",
    value: "48,392",
    change: "+8.3%",
    trend: "up",
    icon: Trophy,
    color: "chart-3",
  },
  {
    label: "Avg. Score",
    value: "78.5%",
    change: "+2.1%",
    trend: "up",
    icon: Target,
    color: "chart-4",
  },
  {
    label: "Completion Rate",
    value: "92.3%",
    change: "+1.8%",
    trend: "up",
    icon: TrendingUp,
    color: "chart-1",
  },
  {
    label: "Avg. Time/Quiz",
    value: "4m 32s",
    change: "-12s",
    trend: "up",
    icon: Clock,
    color: "chart-5",
  },
];

const colorClasses: Record<string, { bg: string; text: string; icon: string }> =
  {
    primary: {
      bg: "bg-primary/10",
      text: "text-primary",
      icon: "text-primary",
    },
    "chart-1": {
      bg: "bg-chart-1/10",
      text: "text-chart-1",
      icon: "text-chart-1",
    },
    "chart-2": {
      bg: "bg-chart-2/10",
      text: "text-chart-2",
      icon: "text-chart-2",
    },
    "chart-3": {
      bg: "bg-chart-3/10",
      text: "text-chart-3",
      icon: "text-chart-3",
    },
    "chart-4": {
      bg: "bg-chart-4/10",
      text: "text-chart-4",
      icon: "text-chart-4",
    },
    "chart-5": {
      bg: "bg-chart-5/10",
      text: "text-chart-5",
      icon: "text-chart-5",
    },
  };

export function DashboardMetrics() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {metrics.map((metric) => {
        const colors = colorClasses[metric.color];
        return (
          <div
            key={metric.label}
            className="flex flex-col gap-3 p-4 bg-card rounded-xl border border-border hover:border-accent transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${colors.bg}`}>
                <metric.icon className={`h-4 w-4 ${colors.icon}`} />
              </div>
              <span className={`text-xs font-medium ${colors.text}`}>
                {metric.change}
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {metric.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {metric.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
