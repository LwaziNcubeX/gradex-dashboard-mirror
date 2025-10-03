import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function RecentActivity() {
  const activities = [
    {
      action: "Quiz Created",
      title: "Form 1 Geography Fundamentals",
      time: "2 hours ago",
    },
    {
      action: "Question Added",
      title: "Climate patterns question",
      time: "5 hours ago",
    },
    {
      action: "Level Updated",
      title: "Beginner Geography Collection",
      time: "1 day ago",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="h-2 w-2 rounded-full bg-primary mt-2" />
              <div className="flex-1">
                <div className="text-sm font-medium">{activity.action}</div>
                <div className="text-sm text-muted-foreground">{activity.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
