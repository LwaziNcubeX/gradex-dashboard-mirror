import {
  Users,
  BookOpen,
  Trophy,
  TrendingUp,
  Target,
  Clock,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { OverviewData } from "@/lib/api/admin";

interface DashboardMetricsProps {
  overview?: OverviewData | null;
}

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

export function DashboardMetrics({ overview }: DashboardMetricsProps) {
  const metrics = [
    {
      label: "Active Students",
      value: overview ? overview.students.total.toLocaleString() : "—",
      change: overview ? `+${overview.students.new_this_week} this week` : "",
      trend: "up" as const,
      icon: Users,
      color: "primary",
    },
    {
      label: "Total Questions",
      value: overview ? overview.content.questions.toLocaleString() : "—",
      change: "",
      trend: "up" as const,
      icon: BookOpen,
      color: "chart-2",
    },
    {
      label: "Total Quizzes",
      value: overview ? overview.content.quizzes.toLocaleString() : "—",
      change: "",
      trend: "up" as const,
      icon: Trophy,
      color: "chart-3",
    },
    {
      label: "Total Levels",
      value: overview ? overview.content.levels.toLocaleString() : "—",
      change: "",
      trend: "up" as const,
      icon: Target,
      color: "chart-4",
    },
    {
      label: "Active Today",
      value: overview ? overview.students.active_today.toLocaleString() : "—",
      change: "",
      trend: "up" as const,
      icon: TrendingUp,
      color: "chart-1",
    },
    {
      label: "Teachers",
      value: overview ? overview.teachers.total.toLocaleString() : "—",
      change: "",
      trend: "up" as const,
      icon: Clock,
      color: "chart-5",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {metrics.map((metric) => {
        const colors = colorClasses[metric.color];
        return (
          <Card
            key={metric.label}
            className="rounded-xl border-border/50 hover:border-border transition-colors py-0"
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-1.5 rounded-md ${colors.bg}`}>
                  <metric.icon className={`h-3.5 w-3.5 ${colors.icon}`} />
                </div>
                <span
                  className={`flex items-center gap-0.5 text-xs font-medium ${colors.text}`}
                >
                  {metric.trend === "up" ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                  {metric.change}
                </span>
              </div>
              <p className="text-xl font-bold text-foreground leading-none">
                {metric.value}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                {metric.label}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
