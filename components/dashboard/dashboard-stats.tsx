"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, FileQuestion, Trophy, TrendingUp, ArrowUpRight, ArrowDownRight, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

const stats = [
  {
    title: "Total Students",
    value: "2,847",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    description: "Active learners this month",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    title: "Quizzes Completed",
    value: "14,582",
    change: "+8.2%",
    trend: "up",
    icon: FileQuestion,
    description: "Across all subjects",
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    title: "Avg. Score",
    value: "76.4%",
    change: "-2.1%",
    trend: "down",
    icon: Trophy,
    description: "Overall performance",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    title: "Active Streaks",
    value: "892",
    change: "+24.3%",
    trend: "up",
    icon: TrendingUp,
    description: "Students on learning streaks",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600",
  },
]

export function DashboardStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className={`relative overflow-hidden border-0 ${stat.bgColor}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bgColor} border-2 border-white`}>
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
              <div
                className={cn(
                  "flex items-center gap-1 text-xs font-medium rounded-full px-2 py-1",
                  stat.trend === "up" 
                    ? "bg-green-100 text-green-700" 
                    : "bg-red-100 text-red-700",
                )}
              >
                {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-sm font-semibold text-foreground mt-2">{stat.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
