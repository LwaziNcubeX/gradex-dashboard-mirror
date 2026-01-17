"use client";

import { Calendar, Download } from "lucide-react";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
  BarChart,
} from "recharts";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip as TooltipUI,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const engagementData = [
  { date: "Jan 1", users: 8500, quizzes: 12000 },
  { date: "Jan 8", users: 8800, quizzes: 13200 },
  { date: "Jan 15", users: 9200, quizzes: 14100 },
  { date: "Jan 22", users: 9400, quizzes: 14800 },
  { date: "Jan 29", users: 9100, quizzes: 13900 },
  { date: "Feb 5", users: 9600, quizzes: 15200 },
  { date: "Feb 12", users: 9800, quizzes: 15800 },
  { date: "Feb 19", users: 10100, quizzes: 16400 },
  { date: "Feb 26", users: 10400, quizzes: 17100 },
  { date: "Mar 5", users: 10200, quizzes: 16800 },
  { date: "Mar 12", users: 10600, quizzes: 17500 },
  { date: "Mar 19", users: 10900, quizzes: 18200 },
  { date: "Mar 26", users: 11100, quizzes: 18900 },
  { date: "Apr 2", users: 11400, quizzes: 19500 },
  { date: "Apr 9", users: 11200, quizzes: 19100 },
  { date: "Apr 16", users: 11600, quizzes: 19800 },
  { date: "Apr 23", users: 11800, quizzes: 20400 },
  { date: "Apr 30", users: 12000, quizzes: 21000 },
  { date: "May 7", users: 12200, quizzes: 21600 },
  { date: "May 14", users: 12100, quizzes: 21300 },
  { date: "May 21", users: 12400, quizzes: 22100 },
  { date: "May 28", users: 12600, quizzes: 22800 },
  { date: "Jun 4", users: 12500, quizzes: 22500 },
  { date: "Jun 11", users: 12700, quizzes: 23200 },
  { date: "Jun 18", users: 12847, quizzes: 23800 },
];

const weeklyData = [
  { day: "Mon", quizzes: 4200, avgScore: 76 },
  { day: "Tue", quizzes: 5100, avgScore: 78 },
  { day: "Wed", quizzes: 4800, avgScore: 75 },
  { day: "Thu", quizzes: 5400, avgScore: 79 },
  { day: "Fri", quizzes: 4600, avgScore: 77 },
  { day: "Sat", quizzes: 6200, avgScore: 82 },
  { day: "Sun", quizzes: 5800, avgScore: 80 },
];

const engagementChartConfig = {
  users: {
    label: "Active Users",
    color: "var(--chart-1)",
  },
  quizzes: {
    label: "Quizzes Taken",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const weeklyChartConfig = {
  quizzes: {
    label: "Quizzes",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function PerformanceChart() {
  const [period, setPeriod] = useState("6M");

  return (
    <Card className="rounded-2xl">
      <Tabs defaultValue="engagement" className="w-full">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <TabsList className="bg-secondary">
                <TabsTrigger value="engagement">Engagement</TabsTrigger>
                <TabsTrigger value="weekly">Weekly Activity</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-full border border-border">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-medium text-foreground">
                  Live
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center bg-secondary rounded-lg p-1">
                {["1D", "1W", "1M", "3M", "6M"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      period === p
                        ? "bg-accent text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <TooltipUI>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-secondary"
                    >
                      <Calendar className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Select date range</TooltipContent>
                </TooltipUI>
                <TooltipUI>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-secondary"
                    >
                      <Download className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Download data</TooltipContent>
                </TooltipUI>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <TabsContent value="engagement" className="mt-0">
            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chart-1" />
                <span className="text-sm text-muted-foreground">
                  Active Users
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chart-2" />
                <span className="text-sm text-muted-foreground">
                  Quizzes Taken
                </span>
              </div>
            </div>
            <ChartContainer
              config={engagementChartConfig}
              className="h-75 w-full"
            >
              <AreaChart data={engagementData} accessibilityLayer>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-users)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-users)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="colorQuizzes" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-quizzes)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-quizzes)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                  vertical={false}
                />
                <XAxis dataKey="date" hide />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  tick={{ fill: "currentColor", fontSize: 12 }}
                  className="text-muted-foreground"
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: "currentColor", fontSize: 12 }}
                  className="text-muted-foreground"
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => value}
                      formatter={(value, name) => (
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                            style={{
                              backgroundColor: `var(--color-${name})`,
                            }}
                          />
                          <span className="text-muted-foreground">
                            {
                              engagementChartConfig[
                                name as keyof typeof engagementChartConfig
                              ]?.label
                            }
                          </span>
                          <span className="font-mono font-medium tabular-nums text-foreground">
                            {value?.toLocaleString()}
                          </span>
                        </div>
                      )}
                    />
                  }
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="users"
                  stroke="var(--color-users)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="quizzes"
                  stroke="var(--color-quizzes)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorQuizzes)"
                />
              </AreaChart>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="weekly" className="mt-0">
            <ChartContainer config={weeklyChartConfig} className="h-75 w-full">
              <BarChart data={weeklyData} accessibilityLayer>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "currentColor", fontSize: 12 }}
                  className="text-muted-foreground"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "currentColor", fontSize: 12 }}
                  className="text-muted-foreground"
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => value}
                      formatter={(value, name, item) => (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <div className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-chart-1" />
                            <span className="text-muted-foreground">
                              Quizzes
                            </span>
                            <span className="font-mono font-medium tabular-nums text-foreground">
                              {value?.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-chart-2" />
                            <span className="text-muted-foreground">
                              Avg. Score
                            </span>
                            <span className="font-mono font-medium tabular-nums text-foreground">
                              {item.payload.avgScore}%
                            </span>
                          </div>
                        </div>
                      )}
                    />
                  }
                />
                <Bar
                  dataKey="quizzes"
                  fill="var(--color-quizzes)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
