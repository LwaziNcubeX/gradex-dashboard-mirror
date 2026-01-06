"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  FileQuestion,
  Trophy,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  {
    title: "Total Students",
    value: "2,847",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    description: "Active learners this month",
    bgColor: "bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20",
    iconColor: "text-blue-400",
  },
  {
    title: "Quizzes Completed",
    value: "14,582",
    change: "+8.2%",
    trend: "up",
    icon: FileQuestion,
    description: "Across all subjects",
    bgColor: "bg-green-500/10 dark:bg-green-500/15 border border-green-500/20",
    iconColor: "text-green-400",
  },
  {
    title: "Avg. Score",
    value: "76.4%",
    change: "-2.1%",
    trend: "down",
    icon: Trophy,
    description: "Overall performance",
    bgColor:
      "bg-purple-500/10 dark:bg-purple-500/15 border border-purple-500/20",
    iconColor: "text-purple-400",
  },
  {
    title: "Active Streaks",
    value: "892",
    change: "+24.3%",
    trend: "up",
    icon: TrendingUp,
    description: "Students on learning streaks",
    bgColor:
      "bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/20",
    iconColor: "text-orange-400",
  },
];

export function DashboardStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className={`relative rounded-3xl overflow-hidden `}
        >
          <CardContent>
            <div className="flex items-center justify-between">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg backdrop-blur-sm`}
              >
                <stat.icon className={`h-7 w-7 ${stat.iconColor}`} />
              </div>
              <div
                className={cn(
                  "flex items-center gap-1 text-xs font-medium rounded-t-md px-2 py-1",
                  stat.trend === "up"
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                )}
              >
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold tracking-tight text-foreground">
                {stat.value}
              </p>
              <p className="text-sm font-semibold text-foreground mt-2">
                {stat.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
