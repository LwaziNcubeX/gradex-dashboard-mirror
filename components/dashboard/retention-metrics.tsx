"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Eye, Repeat2, Heart, Zap } from "lucide-react"

const retentionData = [
  {
    metric: "Daily Active Users",
    value: "847",
    percentage: 78,
    change: "+5%",
    icon: Eye,
    color: "hsl(200, 100%, 50%)",
  },
  {
    metric: "Weekly Returning Rate",
    value: "92%",
    percentage: 92,
    change: "+2%",
    icon: Repeat2,
    color: "hsl(120, 100%, 50%)",
  },
  {
    metric: "Student Satisfaction",
    value: "4.6/5",
    percentage: 92,
    change: "+0.2",
    icon: Heart,
    color: "hsl(0, 100%, 50%)",
  },
  {
    metric: "Engagement Score",
    value: "8.9/10",
    percentage: 89,
    change: "+1.2",
    icon: Zap,
    color: "hsl(45, 100%, 50%)",
  },
]

export function RetentionMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Engagement & Retention</CardTitle>
        <CardDescription>User activity and retention metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {retentionData.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.metric} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: item.color + "20" }}
                  >
                    <Icon className="h-5 w-5" style={{ color: item.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.metric}</p>
                    <p className="text-lg font-semibold">{item.value}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {item.change}
                </Badge>
              </div>
              <Progress value={item.percentage} className="h-2" />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
