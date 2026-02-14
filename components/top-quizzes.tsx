"use client";

import {
  ArrowUp,
  ArrowDown,
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

const quizData = [
  {
    id: "math-101",
    name: "Algebra Basics",
    subject: "Mathematics",
    attempts: 4521,
    avgScore: 82,
    completion: 94,
    trend: "up",
    chartData: [
      { value: 70 }, { value: 72 }, { value: 75 }, { value: 78 },
      { value: 76 }, { value: 80 }, { value: 79 }, { value: 82 },
      { value: 81 }, { value: 84 }, { value: 82 },
    ],
  },
  {
    id: "sci-201",
    name: "Physics Fundamentals",
    subject: "Science",
    attempts: 3892,
    avgScore: 75,
    completion: 88,
    trend: "up",
    chartData: [
      { value: 65 }, { value: 68 }, { value: 70 }, { value: 69 },
      { value: 72 }, { value: 71 }, { value: 73 }, { value: 74 },
      { value: 73 }, { value: 76 }, { value: 75 },
    ],
  },
  {
    id: "eng-102",
    name: "Grammar Essentials",
    subject: "English",
    attempts: 5234,
    avgScore: 68,
    completion: 91,
    trend: "down",
    chartData: [
      { value: 75 }, { value: 73 }, { value: 74 }, { value: 72 },
      { value: 70 }, { value: 71 }, { value: 69 }, { value: 70 },
      { value: 68 }, { value: 69 }, { value: 68 },
    ],
  },
  {
    id: "hist-101",
    name: "World History",
    subject: "History",
    attempts: 2847,
    avgScore: 79,
    completion: 86,
    trend: "up",
    chartData: [
      { value: 72 }, { value: 74 }, { value: 73 }, { value: 76 },
      { value: 75 }, { value: 77 }, { value: 76 }, { value: 78 },
      { value: 77 }, { value: 80 }, { value: 79 },
    ],
  },
];

const subjectColors: Record<string, string> = {
  Mathematics: "bg-chart-2/20 text-chart-2",
  Science: "bg-chart-1/20 text-chart-1",
  English: "bg-chart-3/20 text-chart-3",
  History: "bg-chart-4/20 text-chart-4",
};

const chartConfig = {
  value: { label: "Score", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function TopQuizzes() {
  return (
    <Card className="rounded-xl">
      <CardHeader className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-foreground">Top Performing Quizzes</CardTitle>
          <Button variant="link" className="text-primary p-0 h-auto text-xs">
            View All
          </Button>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium text-xs">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors">
                    Quiz <ChevronsUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-muted-foreground font-medium text-xs hidden sm:table-cell w-20">
                  Trend
                </TableHead>
                <TableHead className="text-muted-foreground font-medium text-xs text-right">
                  Attempts
                </TableHead>
                <TableHead className="text-muted-foreground font-medium text-xs text-right">
                  Avg Score
                </TableHead>
                <TableHead className="text-muted-foreground font-medium text-xs text-right hidden sm:table-cell">
                  Completion
                </TableHead>
                <TableHead className="w-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quizData.map((item, index) => (
                <TableRow
                  key={item.id}
                  className={`group border-border ${index === 0 ? "bg-primary/5" : ""}`}
                >
                  <TableCell className="py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-md ${subjectColors[item.subject]} flex items-center justify-center shrink-0`}>
                        <BookOpen className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-medium text-foreground block text-sm leading-tight truncate">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {item.subject}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-2.5 hidden sm:table-cell">
                    <ChartContainer config={chartConfig} className="h-6 w-16">
                      <AreaChart data={item.chartData}>
                        <defs>
                          <linearGradient id={`gradient-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={item.trend === "up" ? "var(--chart-1)" : "var(--destructive)"} stopOpacity={0.3} />
                            <stop offset="100%" stopColor={item.trend === "up" ? "var(--chart-1)" : "var(--destructive)"} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="value" stroke={item.trend === "up" ? "var(--chart-1)" : "var(--destructive)"} strokeWidth={1.5} fill={`url(#gradient-${item.id})`} />
                      </AreaChart>
                    </ChartContainer>
                  </TableCell>
                  <TableCell className="text-right text-foreground font-medium text-sm py-2.5 tabular-nums">
                    {item.attempts.toLocaleString()}
                  </TableCell>
                  <TableCell className={`text-right font-medium text-sm py-2.5 tabular-nums ${item.trend === "up" ? "text-chart-1" : "text-destructive"}`}>
                    {item.avgScore}%
                  </TableCell>
                  <TableCell className="text-right font-medium py-2.5 hidden sm:table-cell">
                    <div className="flex items-center justify-end gap-1 text-foreground text-sm tabular-nums">
                      {item.trend === "up" ? (
                        <ArrowUp className="h-3 w-3 text-chart-1" />
                      ) : (
                        <ArrowDown className="h-3 w-3 text-destructive" />
                      )}
                      {item.completion}%
                    </div>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Quiz</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
