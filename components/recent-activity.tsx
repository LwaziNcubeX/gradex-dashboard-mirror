"use client";

import { Trophy, BookOpen, UserPlus, Star, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const activities = [
  { id: 1, type: "quiz_completed", user: "Sarah Johnson", action: "completed", target: "Algebra Basics", score: 95, time: "2 min ago", icon: Trophy, color: "chart-1" },
  { id: 2, type: "new_student", user: "Michael Chen", action: "joined GradeX", target: null, time: "5 min ago", icon: UserPlus, color: "chart-2" },
  { id: 3, type: "quiz_completed", user: "Emily Davis", action: "completed", target: "Physics Fundamentals", score: 88, time: "12 min ago", icon: BookOpen, color: "chart-3" },
  { id: 4, type: "achievement", user: "James Wilson", action: "earned", target: "Quiz Master Badge", time: "18 min ago", icon: Star, color: "chart-4" },
  { id: 5, type: "quiz_completed", user: "Lisa Anderson", action: "completed", target: "World History", score: 72, time: "25 min ago", icon: Trophy, color: "chart-1" },
  { id: 6, type: "new_student", user: "David Park", action: "joined GradeX", target: null, time: "32 min ago", icon: UserPlus, color: "chart-2" },
];

const colorClasses: Record<string, { bg: string; text: string }> = {
  "chart-1": { bg: "bg-chart-1/10", text: "text-chart-1" },
  "chart-2": { bg: "bg-chart-2/10", text: "text-chart-2" },
  "chart-3": { bg: "bg-chart-3/10", text: "text-chart-3" },
  "chart-4": { bg: "bg-chart-4/10", text: "text-chart-4" },
};

export function RecentActivity() {
  return (
    <Card className="rounded-xl">
      <CardHeader className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-foreground">Recent Activity</CardTitle>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-[11px]">Live</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4">
        <div className="flex flex-col gap-0.5">
          {activities.map((activity) => {
            const colors = colorClasses[activity.color];
            return (
              <div
                key={activity.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <div className={`p-1.5 rounded-md ${colors.bg} shrink-0`}>
                  <activity.icon className={`h-3.5 w-3.5 ${colors.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">
                    <span className="font-medium">{activity.user}</span>{" "}
                    <span className="text-muted-foreground">{activity.action}</span>{" "}
                    {activity.target && <span className="font-medium">{activity.target}</span>}
                    {activity.score && (
                      <span className="text-primary ml-1">({activity.score}%)</span>
                    )}
                  </p>
                </div>
                <span className="text-[11px] text-muted-foreground whitespace-nowrap shrink-0">
                  {activity.time}
                </span>
              </div>
            );
          })}
        </div>

        <Button
          variant="ghost"
          className="w-full mt-2 text-xs text-muted-foreground hover:text-foreground h-8"
        >
          View all activity
        </Button>
      </CardContent>
    </Card>
  );
}
