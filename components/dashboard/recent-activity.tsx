"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const recentActivities = [
  {
    id: 1,
    user: "John Mutasa",
    action: "completed",
    target: "Algebra Basics Quiz",
    score: 92,
    time: "2 min ago",
  },
  {
    id: 2,
    user: "Sarah Moyo",
    action: "started",
    target: "Form 2 Geography",
    time: "5 min ago",
  },
  {
    id: 3,
    user: "David Chikwanha",
    action: "completed",
    target: "History of Zimbabwe",
    score: 78,
    time: "12 min ago",
  },
  {
    id: 4,
    user: "Grace Ndlovu",
    action: "achieved",
    target: "7-Day Streak Badge",
    time: "18 min ago",
  },
  {
    id: 5,
    user: "Peter Sibanda",
    action: "completed",
    target: "English Grammar Test",
    score: 85,
    time: "25 min ago",
  },
  {
    id: 6,
    user: "Mary Banda",
    action: "started",
    target: "Science Experiments Quiz",
    time: "32 min ago",
  },
  {
    id: 7,
    user: "James Nyathi",
    action: "completed",
    target: "Mathematics Form 3",
    score: 71,
    time: "45 min ago",
  },
];

export function RecentActivity() {
  const getActionColor = (action: string) => {
    switch (action) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "started":
        return "bg-blue-100 text-blue-700";
      case "achieved":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Recent Activity
        </CardTitle>
        <CardDescription>Latest student interactions</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-85 px-6">
          <div className="space-y-4 pb-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                    {activity.user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{activity.user}</span>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] px-1.5 py-0 ${getActionColor(
                        activity.action
                      )}`}
                    >
                      {activity.action}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {activity.target}
                    {activity.score && (
                      <span
                        className={`ml-2 font-medium ${getScoreColor(
                          activity.score
                        )}`}
                      >
                        {activity.score}%
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
