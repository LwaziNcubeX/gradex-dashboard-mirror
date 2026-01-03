"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, FileQuestion, Trophy, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"

const stats = [
  {
    title: "Total Students",
    value: "2,847",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    description: "Active learners this month",
  },
  {
    title: "Quizzes Completed",
    value: "14,582",
    change: "+8.2%",
    trend: "up",
    icon: FileQuestion,
    description: "Across all subjects",
  },
  {
    title: "Avg. Score",
    value: "76.4%",
    change: "-2.1%",
    trend: "down",
    icon: Trophy,
    description: "Overall performance",
  },
  {
    title: "Active Streaks",
    value: "892",
    change: "+24.3%",
    trend: "up",
    icon: TrendingUp,
    description: "Students on learning streaks",
  },
]

export function DashboardStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div
                className={cn(
                  "flex items-center gap-1 text-xs font-medium",
                  stat.trend === "up" ? "text-green-600" : "text-red-600",
                )}
              >
                {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-semibold tracking-tight">{stat.value}</p>
              <p className="text-sm font-medium text-foreground mt-1">{stat.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
