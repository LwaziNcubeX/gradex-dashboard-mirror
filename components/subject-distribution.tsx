"use client";

import { PieChart, Pie, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const data = [
  { name: "Mathematics", value: 32, fill: "var(--color-mathematics)" },
  { name: "Science", value: 28, fill: "var(--color-science)" },
  { name: "English", value: 22, fill: "var(--color-english)" },
  { name: "History", value: 18, fill: "var(--color-history)" },
];

const chartConfig = {
  value: {
    label: "Percentage",
  },
  mathematics: {
    label: "Mathematics",
    color: "var(--chart-2)",
  },
  science: {
    label: "Science",
    color: "var(--chart-1)",
  },
  english: {
    label: "English",
    color: "var(--chart-3)",
  },
  history: {
    label: "History",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

export function SubjectDistribution() {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <Card className="rounded-xl">
      <CardHeader className="px-4 pt-4 pb-2">
        <CardTitle className="text-sm font-medium text-foreground">Subject Distribution</CardTitle>
      </CardHeader>

      <CardContent className="px-4 pb-4">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <ChartContainer config={chartConfig} className="h-28 w-28">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={52}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-lg font-bold text-foreground leading-none">{total}%</p>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-2">
            {data.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                </div>
                <span className="text-xs font-medium text-foreground tabular-nums">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
