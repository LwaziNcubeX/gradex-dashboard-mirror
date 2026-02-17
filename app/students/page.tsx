"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  TrendingUp,
  Award,
  Clock,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
} from "lucide-react";
import StudentsTable from "@/components/students/students";

const summaryMetrics = [
  { label: "Total Students", value: "2,847", icon: Users, color: "primary" },
  { label: "Active Today", value: "1,234", icon: TrendingUp, color: "chart-2" },
  { label: "Top Performers", value: "156", icon: Award, color: "chart-3" },
  { label: "Avg. Study Time", value: "45m", icon: Clock, color: "chart-5" },
];

const metricColors: Record<string, { bg: string; text: string }> = {
  primary: { bg: "bg-primary/10", text: "text-primary" },
  "chart-2": { bg: "bg-chart-2/10", text: "text-chart-2" },
  "chart-3": { bg: "bg-chart-3/10", text: "text-chart-3" },
  "chart-5": { bg: "bg-chart-5/10", text: "text-chart-5" },
};

const avatarColors = [
  "bg-primary/20 text-primary",
  "bg-chart-2/20 text-chart-2",
  "bg-chart-5/20 text-chart-5",
  "bg-chart-3/20 text-chart-3",
  "bg-chart-4/20 text-chart-4",
  "bg-chart-1/20 text-chart-1",
  "bg-chart-2/20 text-chart-2",
  "bg-primary/20 text-primary",
];

export default function StudentsPage() {
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
