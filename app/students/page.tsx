"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, Award, Clock } from "lucide-react";
import StudentsTable from "@/components/students/students";
import { adminService, type OverviewData } from "@/lib/api/admin";

const metricColors: Record<string, { bg: string; text: string }> = {
  primary: { bg: "bg-primary/10", text: "text-primary" },
  "chart-2": { bg: "bg-chart-2/10", text: "text-chart-2" },
  "chart-3": { bg: "bg-chart-3/10", text: "text-chart-3" },
  "chart-5": { bg: "bg-chart-5/10", text: "text-chart-5" },
};

export default function StudentsPage() {
  const [overview, setOverview] = useState<OverviewData | null>(null);

  useEffect(() => {
    adminService
      .getOverview()
      .then(setOverview)
      .catch(() => setOverview(null));
  }, []);

  const summaryMetrics = [
    {
      label: "Total Students",
      value: overview ? overview.students.total.toLocaleString() : "—",
      icon: Users,
      color: "primary",
    },
    {
      label: "Active Today",
      value: overview ? overview.students.active_today.toLocaleString() : "—",
      icon: TrendingUp,
      color: "chart-2",
    },
    {
      label: "New This Week",
      value: overview ? overview.students.new_this_week.toLocaleString() : "—",
      icon: Award,
      color: "chart-3",
    },
    {
      label: "Teachers",
      value: overview ? overview.teachers.total.toLocaleString() : "—",
      icon: Clock,
      color: "chart-5",
    },
  ];

  return (
    <DashboardLayout>
      {/* Summary metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {summaryMetrics.map((metric) => {
          const colors = metricColors[metric.color];
          return (
            <Card
              key={metric.label}
              className="rounded-xl border-border/50 py-3"
            >
              <CardContent className="p-3 flex items-center gap-2.5">
                <div className={`p-1.5 rounded-md ${colors.bg}`}>
                  <metric.icon className={`h-4 w-4 ${colors.text}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {metric.label}
                  </p>
                  <p className="text-lg font-bold text-foreground leading-tight">
                    {metric.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Students table */}
      <StudentsTable />
    </DashboardLayout>
  );
}
