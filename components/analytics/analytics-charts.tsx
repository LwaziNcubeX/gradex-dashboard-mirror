"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const performanceData = [
  { week: "W1", form1: 72, form2: 68, form3: 75, form4: 80 },
  { week: "W2", form1: 74, form2: 71, form3: 76, form4: 78 },
  { week: "W3", form1: 71, form2: 73, form3: 74, form4: 82 },
  { week: "W4", form1: 76, form2: 75, form3: 78, form4: 79 },
  { week: "W5", form1: 78, form2: 74, form3: 80, form4: 83 },
  { week: "W6", form1: 75, form2: 77, form3: 79, form4: 81 },
];

const difficultyData = [
  { name: "Easy", value: 45, color: "hsl(120, 100%, 50%)" }, // Bright Green
  { name: "Medium", value: 35, color: "hsl(45, 100%, 50%)" }, // Bright Yellow
  { name: "Hard", value: 20, color: "hsl(0, 100%, 50%)" }, // Bright Red
];

const chartConfig = {
  form1: { label: "Form 1", color: "hsl(200, 100%, 50%)" }, // Bright Blue
  form2: { label: "Form 2", color: "hsl(280, 100%, 50%)" }, // Bright Purple
  form3: { label: "Form 3", color: "hsl(120, 100%, 50%)" }, // Bright Green
  form4: { label: "Form 4", color: "hsl(45, 100%, 50%)" }, // Bright Yellow
} satisfies ChartConfig;

export function AnalyticsCharts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Performance Analytics
        </CardTitle>
        <CardDescription>
          Weekly performance trends and difficulty distribution
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="trends" className="space-y-4">
          <TabsList>
            <TabsTrigger value="trends">Score Trends</TabsTrigger>
            <TabsTrigger value="difficulty">Difficulty</TabsTrigger>
          </TabsList>

          <TabsContent value="trends">
            <ChartContainer config={chartConfig} className="h-75 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={performanceData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="oklch(var(--border))"
                  />
                  <XAxis
                    dataKey="week"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    domain={[60, 90]}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="form1"
                    stroke="hsl(200, 100%, 50%)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="form2"
                    stroke="hsl(280, 100%, 50%)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="form3"
                    stroke="hsl(120, 100%, 50%)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="form4"
                    stroke="hsl(45, 100%, 50%)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {Object.entries(chartConfig).map(([key, config]) => (
                <div key={key} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {config.label}
                  </span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="difficulty">
            <div className="flex items-center justify-center">
              <ChartContainer config={{}} className="h-87.5 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={difficultyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                      animationDuration={800}
                    >
                      {difficultyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
