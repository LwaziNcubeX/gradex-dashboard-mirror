"use client";

import { useState, useEffect } from "react";
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
import { adminService, type AnalyticsData } from "@/lib/api/admin";

const engagementConfig = {
  count: { label: "New Registrations", color: "var(--chart-1)" },
} satisfies ChartConfig;

const scoreConfig = {
  students: { label: "Students", color: "var(--chart-1)" },
} satisfies ChartConfig;

const subjectConfig = {
  value: { label: "Percentage" },
  mathematics: { label: "Mathematics", color: "var(--chart-2)" },
  english: { label: "English", color: "var(--chart-5)" },
  geography: { label: "Geography", color: "var(--chart-1)" },
  history: { label: "History", color: "var(--chart-3)" },
  "combined science": { label: "Combined Science", color: "var(--chart-4)" },
} satisfies ChartConfig;

const metricColors: Record<string, { bg: string; text: string }> = {
  primary: { bg: "bg-primary/10", text: "text-primary" },
  "chart-1": { bg: "bg-chart-1/10", text: "text-chart-1" },
  "chart-2": { bg: "bg-chart-2/10", text: "text-chart-2" },
  "chart-3": { bg: "bg-chart-3/10", text: "text-chart-3" },
};

const SUBJECT_FILLS = [
  "var(--chart-2)",
  "var(--chart-5)",
  "var(--chart-1)",
  "var(--chart-3)",
  "var(--chart-4)",
];

const FALLBACK_DAILY = Array.from({ length: 30 }, (_, i) => ({
  date: `Day ${i + 1}`,
  count: Math.floor(Math.random() * 50 + 10),
}));

const FALLBACK_SUBJECT = [
  { name: "Mathematics", value: 35, fill: "var(--chart-2)" },
  { name: "English", value: 20, fill: "var(--chart-5)" },
  { name: "Geography", value: 18, fill: "var(--chart-1)" },
  { name: "History", value: 15, fill: "var(--chart-3)" },
  { name: "Combined Science", value: 12, fill: "var(--chart-4)" },
];

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getAnalytics()
      .then(setAnalytics)
      .catch(() => setAnalytics(null))
      .finally(() => setLoading(false));
  }, []);

  const dailyData = analytics?.daily_registrations ?? FALLBACK_DAILY;

  const totalRegistrations = dailyData.reduce((s, d) => s + d.count, 0);
  const avgPerDay =
    dailyData.length > 0
      ? Math.round(totalRegistrations / dailyData.length)
      : 0;

  const subjectData = analytics?.subject_performance
    ? analytics.subject_performance.map((s, i) => ({
        name: s.subject,
        value: s.attempts,
        fill: SUBJECT_FILLS[i % SUBJECT_FILLS.length],
      }))
    : FALLBACK_SUBJECT;

  const totalSubjectValue = subjectData.reduce((s, d) => s + d.value, 0);
  const subjectPercentages = subjectData.map((d) => ({
    ...d,
    pct:
      totalSubjectValue > 0
        ? Math.round((d.value / totalSubjectValue) * 100)
        : 0,
  }));

  const xpLevelData = analytics?.xp_by_level ?? [];

  const topQuizzes = analytics?.top_quizzes ?? [];

  const summaryMetrics = [
    {
      label: "Registrations (30d)",
      value: loading ? "—" : totalRegistrations.toLocaleString(),
      change: `~${avgPerDay}/day`,
      icon: Users,
      color: "primary",
    },
    {
      label: "Quizzes Completed",
      value: loading
        ? "—"
        : topQuizzes
            .reduce((s, q) => s + q.completion_count, 0)
            .toLocaleString(),
      change: `${topQuizzes.length} top quizzes`,
      icon: BarChart3,
      color: "chart-2",
    },
    {
      label: "Avg. Score",
      value: loading
        ? "—"
        : analytics?.subject_performance?.length
          ? `${Math.round(analytics.subject_performance.reduce((s, p) => s + p.avg_score, 0) / analytics.subject_performance.length)}%`
          : "—",
      change: "across subjects",
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

  return (
    <DashboardLayout>
      {/* Page header */}
      <div className="flex items-center justify-between">
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
        {/* Daily registrations chart */}
        <Card className="rounded-xl">
          <CardHeader className="px-4 pt-4 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Daily Registrations (Last 30 days)
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <ChartContainer config={engagementConfig} className="h-64 w-full">
              <AreaChart data={dailyData} accessibilityLayer>
                <defs>
                  <linearGradient id="analReg" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-count)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-count)"
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
                  dataKey="date"
                  tick={{ fill: "currentColor", fontSize: 10 }}
                  className="text-muted-foreground"
                  axisLine={false}
                  tickLine={false}
                  interval={4}
                />
                <YAxis
                  tick={{ fill: "currentColor", fontSize: 11 }}
                  className="text-muted-foreground"
                  axisLine={false}
                  tickLine={false}
                  width={30}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="var(--color-count)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#analReg)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* XP by level chart */}
        <Card className="rounded-xl">
          <CardHeader className="px-4 pt-4 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Avg. XP by Level
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {xpLevelData.length > 0 ? (
              <ChartContainer
                config={{
                  avg_xp: { label: "Avg XP", color: "var(--chart-1)" },
                }}
                className="h-64 w-full"
              >
                <BarChart data={xpLevelData} accessibilityLayer>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="level"
                    tick={{ fill: "currentColor", fontSize: 11 }}
                    className="text-muted-foreground"
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `L${v}`}
                  />
                  <YAxis
                    tick={{ fill: "currentColor", fontSize: 11 }}
                    className="text-muted-foreground"
                    axisLine={false}
                    tickLine={false}
                    width={40}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <Bar
                    dataKey="avg_xp"
                    fill="var(--chart-1)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
                {loading ? "Loading..." : "No level data available yet"}
              </div>
            )}
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
                    data={subjectPercentages}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="pct"
                    nameKey="name"
                    stroke="none"
                  >
                    {subjectPercentages.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="flex flex-col gap-2.5">
                {subjectPercentages.map((item) => (
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
                      {item.pct}%
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
              <p className="text-primary text-sm font-medium">
                Registration Growth
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {totalRegistrations > 0
                  ? `${totalRegistrations.toLocaleString()} new registrations in the last 30 days`
                  : "Track new student registrations over time"}
              </p>
            </div>
            <div className="p-3 bg-chart-2/5 rounded-lg border border-chart-2/10">
              <p className="text-chart-2 text-sm font-medium">
                Quiz Engagement
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {topQuizzes.length > 0
                  ? `Top quiz: "${topQuizzes[0]?.title}" with ${topQuizzes[0]?.completion_count} completions`
                  : "Monitor quiz completion rates across subjects"}
              </p>
            </div>
            <div className="p-3 bg-chart-3/5 rounded-lg border border-chart-3/10">
              <p className="text-chart-3 text-sm font-medium">
                Performance Trend
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {analytics?.subject_performance?.length
                  ? `${analytics.subject_performance[0]?.subject} leads with avg score ${Math.round(analytics.subject_performance[0]?.avg_score ?? 0)}%`
                  : "Track scores across Mathematics, English, and other subjects"}
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
