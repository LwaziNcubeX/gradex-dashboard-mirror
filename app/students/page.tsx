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

const allStudents = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@email.com",
    quizzes: 45,
    avgScore: 92,
    streak: 12,
    status: "active",
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike@email.com",
    quizzes: 38,
    avgScore: 88,
    streak: 7,
    status: "active",
  },
  {
    id: 3,
    name: "Emily Davis",
    email: "emily@email.com",
    quizzes: 52,
    avgScore: 95,
    streak: 21,
    status: "active",
  },
  {
    id: 4,
    name: "James Wilson",
    email: "james@email.com",
    quizzes: 29,
    avgScore: 79,
    streak: 3,
    status: "inactive",
  },
  {
    id: 5,
    name: "Anna Martinez",
    email: "anna@email.com",
    quizzes: 41,
    avgScore: 86,
    streak: 9,
    status: "active",
  },
  {
    id: 6,
    name: "David Lee",
    email: "david@email.com",
    quizzes: 33,
    avgScore: 91,
    streak: 14,
    status: "active",
  },
  {
    id: 7,
    name: "Sophie Brown",
    email: "sophie@email.com",
    quizzes: 27,
    avgScore: 74,
    streak: 2,
    status: "inactive",
  },
  {
    id: 8,
    name: "Ryan Taylor",
    email: "ryan@email.com",
    quizzes: 48,
    avgScore: 89,
    streak: 16,
    status: "active",
  },
];

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
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = allStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
      <Card className="rounded-xl">
        <CardHeader className="px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle className="text-mg font-medium text-foreground">
              All Students
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-medium text-xs">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors">
                      Student <ChevronsUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-muted-foreground font-medium text-xs hidden md:table-cell">
                    Email
                  </TableHead>
                  <TableHead className="text-muted-foreground font-medium text-xs text-right">
                    Quizzes
                  </TableHead>
                  <TableHead className="text-muted-foreground font-medium text-xs text-right">
                    Avg Score
                  </TableHead>
                  <TableHead className="text-muted-foreground font-medium text-xs text-right hidden sm:table-cell">
                    Streak
                  </TableHead>
                  <TableHead className="text-muted-foreground font-medium text-xs text-right hidden sm:table-cell">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student, index) => (
                  <TableRow key={student.id} className="border-border group">
                    <TableCell className="py-2.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar
                          className={`h-7 w-7 ${avatarColors[index % avatarColors.length]}`}
                        >
                          <AvatarFallback className="bg-transparent text-[11px] font-semibold">
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground text-sm">
                          {student.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm py-2.5 hidden md:table-cell">
                      {student.email}
                    </TableCell>
                    <TableCell className="text-right text-foreground text-sm py-2.5 tabular-nums">
                      {student.quizzes}
                    </TableCell>
                    <TableCell className="text-right py-2.5">
                      <span
                        className={`text-sm font-medium tabular-nums ${
                          student.avgScore >= 90
                            ? "text-chart-1"
                            : student.avgScore >= 80
                              ? "text-chart-3"
                              : "text-destructive"
                        }`}
                      >
                        {student.avgScore}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-sm py-2.5 hidden sm:table-cell">
                      <span className="text-foreground tabular-nums">
                        {student.streak}d
                      </span>
                    </TableCell>
                    <TableCell className="text-right py-2.5 hidden sm:table-cell">
                      <Badge
                        variant={
                          student.status === "active" ? "default" : "secondary"
                        }
                        className={`text-[10px] px-1.5 py-0 ${
                          student.status === "active"
                            ? "bg-chart-1/10 text-chart-1 border-chart-1/20"
                            : "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {student.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
            <span className="text-xs text-muted-foreground">
              Showing {filteredStudents.length} of {allStudents.length} students
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                disabled
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 bg-primary/10 text-primary border-primary/20"
              >
                1
              </Button>
              <Button variant="outline" size="sm" className="h-7 w-7">
                2
              </Button>
              <Button variant="outline" size="sm" className="h-7 w-7">
                3
              </Button>
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
