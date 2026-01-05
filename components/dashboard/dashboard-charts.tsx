"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Bar,
  BarChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const engagementData = [
  { date: "Mon", students: 420, quizzes: 320 },
  { date: "Tue", students: 380, quizzes: 280 },
  { date: "Wed", students: 520, quizzes: 450 },
  { date: "Thu", students: 490, quizzes: 380 },
  { date: "Fri", students: 580, quizzes: 520 },
  { date: "Sat", students: 320, quizzes: 240 },
  { date: "Sun", students: 280, quizzes: 200 },
];

const subjectData = [
  { subject: "Math", completed: 2840, avgScore: 78 },
  { subject: "Science", completed: 2120, avgScore: 72 },
  { subject: "English", completed: 1890, avgScore: 81 },
  { subject: "History", completed: 1540, avgScore: 75 },
  { subject: "Geography", completed: 1280, avgScore: 69 },
];

const chartConfig = {
  students: {
    label: "Active Students",
    color: "hsl(200, 100%, 50%)",
  },
  quizzes: {
    label: "Quizzes Taken",
    color: "hsl(280, 100%, 50%)",
  },
  completed: {
    label: "Completed",
    color: "hsl(120, 100%, 50%)",
  },
} satisfies ChartConfig;

export function DashboardCharts() {
  const [timeRange, setTimeRange] = React.useState("7d");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-semibold">
            Learning Activity
          </CardTitle>
          <CardDescription>
            Student engagement and quiz completions
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32" aria-label="Select time range">
            <SelectValue placeholder="Last 7 days" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 3 months</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs defaultValue="engagement" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="subjects">By Subject</TabsTrigger>
          </TabsList>

          <TabsContent value="engagement" className="space-y-4">
            <ChartContainer config={chartConfig} className="h-70 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={engagementData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="fillStudents"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(200, 100%, 50%)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(200, 100%, 50%)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient
                      id="fillQuizzes"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(280, 100%, 50%)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(280, 100%, 50%)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="oklch(var(--border))"
                  />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fontSize: 12 }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="students"
                    stroke="hsl(200, 100%, 50%)"
                    strokeWidth={2}
                    fill="url(#fillStudents)"
                  />
                  <Area
                    type="monotone"
                    dataKey="quizzes"
                    stroke="hsl(280, 100%, 50%)"
                    strokeWidth={2}
                    fill="url(#fillQuizzes)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-4">
            <ChartContainer config={chartConfig} className="h-70 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={subjectData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="oklch(var(--border))"
                  />
                  <XAxis
                    dataKey="subject"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fontSize: 12 }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="completed"
                    fill="hsl(120, 100%, 50%)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
