"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from "recharts"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const performanceData = [
  { week: "W1", form1: 72, form2: 68, form3: 75, form4: 80 },
  { week: "W2", form1: 74, form2: 71, form3: 76, form4: 78 },
  { week: "W3", form1: 71, form2: 73, form3: 74, form4: 82 },
  { week: "W4", form1: 76, form2: 75, form3: 78, form4: 79 },
  { week: "W5", form1: 78, form2: 74, form3: 80, form4: 83 },
  { week: "W6", form1: 75, form2: 77, form3: 79, form4: 81 },
]

const difficultyData = [
  { name: "Easy", value: 45, color: "hsl(142, 76%, 36%)" },
  { name: "Medium", value: 35, color: "hsl(48, 96%, 53%)" },
  { name: "Hard", value: 20, color: "hsl(0, 84%, 60%)" },
]

const chartConfig = {
  form1: { label: "Form 1", color: "hsl(var(--chart-1))" },
  form2: { label: "Form 2", color: "hsl(var(--chart-2))" },
  form3: { label: "Form 3", color: "hsl(var(--chart-3))" },
  form4: { label: "Form 4", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig

export function AnalyticsCharts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Performance Analytics</CardTitle>
        <CardDescription>Weekly performance trends and difficulty distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="trends" className="space-y-4">
          <TabsList>
            <TabsTrigger value="trends">Score Trends</TabsTrigger>
            <TabsTrigger value="difficulty">Difficulty</TabsTrigger>
          </TabsList>

          <TabsContent value="trends">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={[60, 90]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="form1" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="form2" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="form3" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="form4" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {Object.entries(chartConfig).map(([key, config]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: config.color }} />
                  <span className="text-sm text-muted-foreground">{config.label}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="difficulty">
            <div className="flex items-center justify-center">
              <ChartContainer config={{}} className="h-[300px] w-full max-w-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={difficultyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
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
            <div className="flex justify-center gap-6 mt-4">
              {difficultyData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-muted-foreground">
                    {item.name}: {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
