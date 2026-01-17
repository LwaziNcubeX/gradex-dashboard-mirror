"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Mathematics", value: 32, color: "oklch(var(--chart-2))" },
  { name: "Science", value: 28, color: "oklch(var(--chart-1))" },
  { name: "English", value: 22, color: "oklch(var(--chart-3))" },
  { name: "History", value: 18, color: "oklch(var(--chart-4))" },
];

export function SubjectDistribution() {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">
          Subject Distribution
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Quiz attempts by subject
        </p>
      </div>

      <div className="flex items-center gap-6">
        <div className="h-40 w-40 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-popover border border-border p-2 rounded-lg shadow-xl">
                        <p className="text-foreground text-sm font-medium">
                          {data.name}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {data.value}% of quizzes
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{total}%</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-3">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {item.name}
                </span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
