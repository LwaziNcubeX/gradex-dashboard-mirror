"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

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
  { name: "Math", value: 35, color: "oklch(var(--chart-2))" },
  { name: "Physics", value: 20, color: "oklch(var(--chart-5))" },
  { name: "Chemistry", value: 18, color: "oklch(var(--chart-1))" },
  { name: "Biology", value: 15, color: "oklch(var(--chart-3))" },
  { name: "History", value: 12, color: "oklch(var(--chart-4))" },
];

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between pl-2">
        <h1 className="text-4xl font-bold font-oswald">Analytics</h1>
        <select className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground">
          <option>Last 30 days</option>
          <option>Last 90 days</option>
          <option>Last year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">
              Student & Quiz Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-75">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={engagementData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />
                  <XAxis
                    dataKey="month"
                    className="text-muted-foreground"
                    fontSize={12}
                  />
                  <YAxis className="text-muted-foreground" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(var(--card))",
                      border: "1px solid oklch(var(--border))",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "oklch(var(--foreground))" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="students"
                    stroke="oklch(var(--chart-1))"
                    fill="oklch(var(--chart-1))"
                    fillOpacity={0.2}
                    name="Students"
                  />
                  <Area
                    type="monotone"
                    dataKey="quizzes"
                    stroke="oklch(var(--chart-2))"
                    fill="oklch(var(--chart-2))"
                    fillOpacity={0.2}
                    name="Quizzes Taken"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">
              Score Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-75">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreDistribution}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />
                  <XAxis
                    dataKey="range"
                    className="text-muted-foreground"
                    fontSize={12}
                  />
                  <YAxis className="text-muted-foreground" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(var(--card))",
                      border: "1px solid oklch(var(--border))",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "oklch(var(--foreground))" }}
                  />
                  <Bar
                    dataKey="count"
                    fill="oklch(var(--chart-1))"
                    radius={[4, 4, 0, 0]}
                    name="Students"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">
              Quiz Activity by Subject
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-75 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(var(--card))",
                      border: "1px solid oklch(var(--border))",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "oklch(var(--foreground))" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {subjectData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Key Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-primary font-medium">Student Growth</p>
              <p className="text-sm text-muted-foreground mt-1">
                Student enrollment increased by 18.7% this month
              </p>
            </div>
            <div className="p-4 bg-chart-2/10 rounded-lg border border-chart-2/20">
              <p className="text-chart-2 font-medium">Quiz Engagement</p>
              <p className="text-sm text-muted-foreground mt-1">
                Average quiz completion rate is 78%, up from 72%
              </p>
            </div>
            <div className="p-4 bg-chart-3/10 rounded-lg border border-chart-3/20">
              <p className="text-chart-3 font-medium">Performance Trend</p>
              <p className="text-sm text-muted-foreground mt-1">
                Mathematics scores improved by 5.2% across all levels
              </p>
            </div>
            <div className="p-4 bg-chart-5/10 rounded-lg border border-chart-5/20">
              <p className="text-chart-5 font-medium">Peak Activity</p>
              <p className="text-sm text-muted-foreground mt-1">
                Most quizzes are taken between 6 PM - 9 PM
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
