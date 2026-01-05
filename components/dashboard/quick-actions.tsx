"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Download,
  FileText,
  Users,
  MessageSquare,
  BarChart3,
  Zap,
} from "lucide-react"

const quickActions = [
  {
    label: "Export Report",
    icon: Download,
    description: "Download performance data",
    color: "bg-blue-100 hover:bg-blue-200",
    iconColor: "text-blue-600",
  },
  {
    label: "Send Feedback",
    icon: MessageSquare,
    description: "Message to students",
    color: "bg-purple-100 hover:bg-purple-200",
    iconColor: "text-purple-600",
  },
  {
    label: "View Reports",
    icon: BarChart3,
    description: "Detailed analytics",
    color: "bg-green-100 hover:bg-green-200",
    iconColor: "text-green-600",
  },
  {
    label: "Create Quiz",
    icon: FileText,
    description: "New assessment",
    color: "bg-orange-100 hover:bg-orange-200",
    iconColor: "text-orange-600",
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold text-sm mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.label}
                variant="ghost"
                className={`h-auto flex flex-col items-start justify-start p-3 ${action.color}`}
              >
                <Icon className={`h-5 w-5 mb-2 ${action.iconColor}`} />
                <span className="text-xs font-medium">{action.label}</span>
                <span className="text-xs text-muted-foreground">{action.description}</span>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
