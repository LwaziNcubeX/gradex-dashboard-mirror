"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, Target, Award, BookOpen } from "lucide-react"

const metrics = [
  {
    title: "Avg. Session Duration",
    value: "24m 35s",
    subtext: "Time spent learning",
    icon: Clock,
    progress: 72,
  },
  {
    title: "Quiz Completion Rate",
    value: "84.2%",
    subtext: "Of started quizzes",
    icon: Target,
    progress: 84,
  },
  {
    title: "Achievement Unlock Rate",
    value: "67%",
    subtext: "Students with badges",
    icon: Award,
    progress: 67,
  },
  {
    title: "Content Coverage",
    value: "58%",
    subtext: "Curriculum completed",
    icon: BookOpen,
    progress: 58,
  },
]

export function AnalyticsOverview() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{metric.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{metric.subtext}</p>
            <Progress value={metric.progress} className="mt-3 h-1.5" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
