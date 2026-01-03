"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye, Calendar, TrendingUp, Users, BarChart3 } from "lucide-react"

const reportsData = [
  {
    id: 1,
    title: "Monthly Performance Summary",
    type: "Performance",
    date: "Dec 15, 2024",
    status: "ready",
    icon: TrendingUp,
  },
  {
    id: 2,
    title: "Student Engagement Report",
    type: "Engagement",
    date: "Dec 12, 2024",
    status: "ready",
    icon: Users,
  },
  {
    id: 3,
    title: "Quiz Analytics Q4 2024",
    type: "Analytics",
    date: "Dec 10, 2024",
    status: "generating",
    icon: BarChart3,
  },
  {
    id: 4,
    title: "Form 4 Progress Report",
    type: "Progress",
    date: "Dec 8, 2024",
    status: "ready",
    icon: FileText,
  },
  {
    id: 5,
    title: "Subject-wise Performance",
    type: "Performance",
    date: "Dec 5, 2024",
    status: "ready",
    icon: TrendingUp,
  },
]

const stats = [
  { label: "Total Reports", value: 42, icon: FileText },
  { label: "This Month", value: 12, icon: Calendar },
  { label: "Ready", value: 38, icon: TrendingUp },
  { label: "Generating", value: 4, icon: BarChart3 },
]

export function ReportsContent() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Recent Reports</CardTitle>
          <CardDescription>Your latest generated reports</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {reportsData.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <report.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{report.title}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{report.type}</span>
                    <span>•</span>
                    <span>{report.date}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={report.status === "ready" ? "default" : "secondary"}>
                  {report.status === "ready" ? "Ready" : "Generating..."}
                </Badge>
                {report.status === "ready" && (
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
