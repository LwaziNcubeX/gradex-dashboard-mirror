"use client";

import {
  ArrowUp,
  ChevronsUpDown,
  BookOpen,
  MoreHorizontal,
} from "lucide-react";
import { Area, AreaChart } from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import type { AnalyticsData } from "@/lib/api/admin";

interface TopQuizzesProps {
  analytics?: AnalyticsData | null;
}

const subjectColors: Record<string, string> = {
  Mathematics: "bg-chart-2",
  English: "bg-chart-3",
  Geography: "bg-chart-4",
  History: "bg-chart-4",
  "Combined Science": "bg-chart-1",
};

const chartConfig = {
  value: { label: "Score", color: "var(--chart-1)" },
} satisfies ChartConfig;

const FALLBACK_QUIZZES = [
  {
    id: "1",
    name: "Algebra Basics",
    subject: "Mathematics",
    attempts: 4521,
    avgScore: 82,
    chartData: Array.from({ length: 11 }, (_, i) => ({ value: 75 + i })),
  },
  {
    id: "2",
    name: "Grammar Essentials",
    subject: "English",
    attempts: 3892,
    avgScore: 75,
    chartData: Array.from({ length: 11 }, (_, i) => ({ value: 70 + i })),
  },
  {
    id: "3",
    name: "Map Skills",
    subject: "Geography",
    attempts: 2941,
    avgScore: 68,
    chartData: Array.from({ length: 11 }, (_, i) => ({ value: 64 + i })),
  },
  {
    id: "4",
    name: "World History",
    subject: "History",
    attempts: 2847,
    avgScore: 79,
    chartData: Array.from({ length: 11 }, (_, i) => ({ value: 73 + i })),
  },
];

export function TopQuizzes({ analytics }: TopQuizzesProps) {
  const quizData = analytics?.top_quizzes
    ? analytics.top_quizzes.map((q) => ({
        id: q._id,
        name: q.title,
        subject: q.subject,
        attempts: q.completion_count,
        avgScore: Math.round(q.average_score),
        chartData: Array.from({ length: 11 }, (_, i) => ({
          value: Math.max(0, Math.round(q.average_score) - 5 + i),
        })),
      }))
    : FALLBACK_QUIZZES;

  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Top Performing Quizzes</CardTitle>
            <CardDescription>
              Based on completion rate and average score
            </CardDescription>
          </div>
          <Button variant="link" className="text-primary p-0 h-auto">
            View All
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium">
                <div className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors">
                  Quiz
                  <ChevronsUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-muted-foreground font-medium w-25">
                Trend
              </TableHead>
              <TableHead className="text-muted-foreground font-medium text-right">
                Attempts
              </TableHead>
              <TableHead className="text-muted-foreground font-medium text-right">
                Avg. Score
              </TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quizData.map((item, index) => (
              <TableRow
                key={item.id}
                className={`group border-border ${index === 0 ? "bg-primary/5" : ""}`}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg ${
                        subjectColors[item.subject] ?? "bg-muted"
                      } flex items-center justify-center`}
                    >
                      <BookOpen className="h-4 w-4 text-foreground" />
                    </div>
                    <div>
                      <span className="font-medium text-foreground block text-sm">
                        {item.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {item.subject}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <ChartContainer config={chartConfig} className="h-8 w-20">
                    <AreaChart data={item.chartData}>
                      <defs>
                        <linearGradient
                          id={`gradient-${item.id}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="var(--chart-1)"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="100%"
                            stopColor="var(--chart-1)"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="var(--chart-1)"
                        strokeWidth={1.5}
                        fill={`url(#gradient-${item.id})`}
                      />
                    </AreaChart>
                  </ChartContainer>
                </TableCell>
                <TableCell className="text-right text-foreground font-medium text-sm">
                  {item.attempts.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-medium text-sm text-chart-1">
                  <div className="flex items-center justify-end gap-1">
                    <ArrowUp className="h-3 w-3 text-chart-1" />
                    {item.avgScore}%
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Quiz</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
