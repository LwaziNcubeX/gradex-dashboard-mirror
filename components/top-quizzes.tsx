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
      { value: 70 },
      { value: 72 },
      { value: 75 },
      { value: 78 },
      { value: 76 },
      { value: 80 },
      { value: 79 },
      { value: 82 },
      { value: 81 },
      { value: 84 },
      { value: 82 },
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
      { value: 65 },
      { value: 68 },
      { value: 70 },
      { value: 69 },
      { value: 72 },
      { value: 71 },
      { value: 73 },
      { value: 74 },
      { value: 73 },
      { value: 76 },
      { value: 75 },
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
      { value: 75 },
      { value: 73 },
      { value: 74 },
      { value: 72 },
      { value: 70 },
      { value: 71 },
      { value: 69 },
      { value: 70 },
      { value: 68 },
      { value: 69 },
      { value: 68 },
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
      { value: 72 },
      { value: 74 },
      { value: 73 },
      { value: 76 },
      { value: 75 },
      { value: 77 },
      { value: 76 },
      { value: 78 },
      { value: 77 },
      { value: 80 },
      { value: 79 },
    ],
  },
];

const subjectColors: Record<string, string> = {
  Mathematics: "bg-chart-2",
  Science: "bg-chart-1",
  English: "bg-chart-3",
  History: "bg-chart-4",
};

const chartConfig = {
  value: {
    label: "Score",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function TopQuizzes() {
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
              <TableHead className="text-muted-foreground font-medium text-right">
                Completion
              </TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quizData.map((item, index) => (
              <TableRow
                key={item.id}
                className={`group border-border ${
                  index === 0 ? "bg-primary/5" : ""
                }`}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg ${
                        subjectColors[item.subject]
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
                            stopColor={
                              item.trend === "up"
                                ? "var(--chart-1)"
                                : "var(--destructive)"
                            }
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="100%"
                            stopColor={
                              item.trend === "up"
                                ? "var(--chart-1)"
                                : "var(--destructive)"
                            }
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={
                          item.trend === "up"
                            ? "var(--chart-1)"
                            : "var(--destructive)"
                        }
                        strokeWidth={1.5}
                        fill={`url(#gradient-${item.id})`}
                      />
                    </AreaChart>
                  </ChartContainer>
                </TableCell>
                <TableCell className="text-right text-foreground font-medium text-sm">
                  {item.attempts.toLocaleString()}
                </TableCell>
                <TableCell
                  className={`text-right font-medium text-sm ${
                    item.trend === "up" ? "text-chart-1" : "text-destructive"
                  }`}
                >
                  {item.avgScore}%
                </TableCell>
                <TableCell className="text-right font-medium">
                  <div className="flex items-center justify-end gap-1 text-foreground text-sm">
                    {item.trend === "up" ? (
                      <ArrowUp className="h-3 w-3 text-chart-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 text-destructive" />
                    )}
                    {item.completion}%
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
