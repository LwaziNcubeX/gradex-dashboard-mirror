"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, BarChart3, Clock } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const engagementData = [
  { month: "Jan", students: 1200, quizzes: 3400 },
  { month: "Feb", students: 1400, quizzes: 4200 },
  { month: "Mar", students: 1800, quizzes: 5100 },
  { month: "Apr", students: 2100, quizzes: 5800 },
  { month: "May", students: 2400, quizzes: 6500 },
  { month: "Jun", students: 2847, quizzes: 7200 },
];

const scoreDistribution = [
  { range: "0-50", count: 120 },
  { range: "51-60", count: 280 },
  { range: "61-70", count: 450 },
  { range: "71-80", count: 680 },
  { range: "81-90", count: 520 },
  { range: "91-100", count: 340 },
];

const subjectData = [
  { name: "Math", value: 35, fill: "var(--color-math)" },
  { name: "Physics", value: 20, fill: "var(--color-physics)" },
  { name: "Chemistry", value: 18, fill: "var(--color-chemistry)" },
  { name: "Biology", value: 15, fill: "var(--color-biology)" },
  { name: "History", value: 12, fill: "var(--color-history)" },
];

const engagementConfig = {
  students: { label: "Students", color: "var(--chart-1)" },
  quizzes: { label: "Quizzes Taken", color: "var(--chart-2)" },
} satisfies ChartConfig;

const scoreConfig = {
  count: { label: "Students", color: "var(--chart-1)" },
} satisfies ChartConfig;

const subjectConfig = {
  value: { label: "Percentage" },
  math: { label: "Math", color: "var(--chart-2)" },
  physics: { label: "Physics", color: "var(--chart-5)" },
  chemistry: { label: "Chemistry", color: "var(--chart-1)" },
  biology: { label: "Biology", color: "var(--chart-3)" },
  history: { label: "History", color: "var(--chart-4)" },
} satisfies ChartConfig;

const summaryMetrics = [
  {
    label: "Total Students",
    value: "2,847",
    change: "+18.7%",
    icon: Users,
    color: "primary",
  },
  {
    label: "Quizzes Taken",
    value: "7,200",
    change: "+10.8%",
    icon: BarChart3,
    color: "chart-2",
  },
  {
    label: "Avg. Score",
    value: "76.4%",
    change: "+5.2%",
    icon: TrendingUp,
    color: "chart-1",
  },
  {
    label: "Peak Hours",
    value: "6-9 PM",
    change: "Consistent",
    icon: Clock,
    color: "chart-3",
  },
];

const metricColors: Record<string, { bg: string; text: string }> = {
  primary: { bg: "bg-primary/10", text: "text-primary" },
  "chart-1": { bg: "bg-chart-1/10", text: "text-chart-1" },
  "chart-2": { bg: "bg-chart-2/10", text: "text-chart-2" },
  "chart-3": { bg: "bg-chart-3/10", text: "text-chart-3" },
};

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-oswald tracking-tight text-foreground">
            Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track performance and engagement trends.
          </p>
        </div>
        <select className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
          <option>Last 30 days</option>
          <option>Last 90 days</option>
          <option>Last year</option>
        </select>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {summaryMetrics.map((metric) => {
          const colors = metricColors[metric.color];
          return (
            <Card
              key={metric.label}
              className="rounded-xl border-border/50 py-0"
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-md ${colors.bg}`}>
                    <metric.icon className={`h-3.5 w-3.5 ${colors.text}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted-foreground">
                      {metric.label}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold text-foreground leading-tight">
                        {metric.value}
                      </p>
                      <span
                        className={`text-[11px] font-medium ${colors.text}`}
                      >
                        {metric.change}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Growth chart */}
        <Card className="rounded-xl">
          <CardHeader className="px-4 pt-4 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Student & Quiz Growth
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-chart-1" />
                <span className="text-xs text-muted-foreground">Students</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-chart-2" />
                <span className="text-xs text-muted-foreground">Quizzes</span>
              </div>
            </div>
            <ChartContainer config={engagementConfig} className="h-64 w-full">
              <AreaChart data={engagementData} accessibilityLayer>
                <defs>
                  <linearGradient id="analStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-students)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-students)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="analQuizzes" x1="0" y1="0" x2="0" y2="1">
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
                <XAxis
                  dataKey="month"
                  tick={{ fill: "currentColor", fontSize: 11 }}
                  className="text-muted-foreground"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "currentColor", fontSize: 11 }}
                  className="text-muted-foreground"
                  axisLine={false}
                  tickLine={false}
                  width={35}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Area
                  type="monotone"
                  dataKey="students"
                  stroke="var(--color-students)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#analStudents)"
                />
                <Area
                  type="monotone"
                  dataKey="quizzes"
                  stroke="var(--color-quizzes)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#analQuizzes)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Score distribution */}
        <Card className="rounded-xl">
          <CardHeader className="px-4 pt-4 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Score Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <ChartContainer config={scoreConfig} className="h-72 w-full">
              <BarChart data={scoreDistribution} accessibilityLayer>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                  vertical={false}
                />
                <XAxis
                  dataKey="range"
                  tick={{ fill: "currentColor", fontSize: 11 }}
                  className="text-muted-foreground"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "currentColor", fontSize: 11 }}
                  className="text-muted-foreground"
                  axisLine={false}
                  tickLine={false}
                  width={35}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Bar
                  dataKey="count"
                  fill="var(--color-count)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Subject pie chart */}
        <Card className="rounded-xl">
          <CardHeader className="px-4 pt-4 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Quiz Activity by Subject
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="flex items-center gap-6">
              <ChartContainer
                config={subjectConfig}
                className="h-48 w-48 shrink-0"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={subjectData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    stroke="none"
                  >
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="flex flex-col gap-2.5">
                {subjectData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: item.fill }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-foreground tabular-nums">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="rounded-xl">
          <CardHeader className="px-4 pt-4 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 flex flex-col gap-2.5">
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
              <p className="text-primary text-sm font-medium">Student Growth</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Enrollment increased by 18.7% this month
              </p>
            </div>
            <div className="p-3 bg-chart-2/5 rounded-lg border border-chart-2/10">
              <p className="text-chart-2 text-sm font-medium">
                Quiz Engagement
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Average completion rate is 78%, up from 72%
              </p>
            </div>
            <div className="p-3 bg-chart-3/5 rounded-lg border border-chart-3/10">
              <p className="text-chart-3 text-sm font-medium">
                Performance Trend
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Mathematics scores improved by 5.2% across all levels
              </p>
            </div>
            <div className="p-3 bg-chart-5/5 rounded-lg border border-chart-5/10">
              <p className="text-chart-5 text-sm font-medium">Peak Activity</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Most quizzes are taken between 6 PM - 9 PM
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
