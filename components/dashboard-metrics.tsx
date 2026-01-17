"use client"

import { Users, BookOpen, Trophy, TrendingUp, Target, Clock } from "lucide-react"

const metrics = [
  {
    label: "Active Students",
    value: "12,847",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    color: "emerald",
  },
  {
    label: "Total Questions",
    value: "3,492",
    change: "+248",
    trend: "up",
    icon: BookOpen,
    color: "blue",
  },
  {
    label: "Quizzes Completed",
    value: "48,392",
    change: "+8.3%",
    trend: "up",
    icon: Trophy,
    color: "amber",
  },
  {
    label: "Avg. Score",
    value: "78.5%",
    change: "+2.1%",
    trend: "up",
    icon: Target,
    color: "rose",
  },
  {
    label: "Completion Rate",
    value: "92.3%",
    change: "+1.8%",
    trend: "up",
    icon: TrendingUp,
    color: "cyan",
  },
  {
    label: "Avg. Time/Quiz",
    value: "4m 32s",
    change: "-12s",
    trend: "up",
    icon: Clock,
    color: "violet",
  },
]

const colorClasses: Record<string, { bg: string; text: string; icon: string }> = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", icon: "text-emerald-500" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-400", icon: "text-blue-500" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", icon: "text-amber-500" },
  rose: { bg: "bg-rose-500/10", text: "text-rose-400", icon: "text-rose-500" },
  cyan: { bg: "bg-cyan-500/10", text: "text-cyan-400", icon: "text-cyan-500" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-400", icon: "text-violet-500" },
}

export function DashboardMetrics() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {metrics.map((metric) => {
        const colors = colorClasses[metric.color]
        return (
          <div
            key={metric.label}
            className="flex flex-col gap-3 p-4 bg-[#0D0D0D] rounded-xl border border-[#1A1A1A] hover:border-[#2A2A2A] transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${colors.bg}`}>
                <metric.icon className={`h-4 w-4 ${colors.icon}`} />
              </div>
              <span className={`text-xs font-medium ${colors.text}`}>{metric.change}</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{metric.value}</p>
              <p className="text-xs text-gray-500 mt-1">{metric.label}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
