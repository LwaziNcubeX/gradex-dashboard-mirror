"use client";

import { Trophy, BookOpen, UserPlus, Star, Clock } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "quiz_completed",
    user: "Sarah Johnson",
    avatar: "SJ",
    action: "completed",
    target: "Algebra Basics",
    score: 95,
    time: "2 min ago",
    icon: Trophy,
    color: "chart-1",
  },
  {
    id: 2,
    type: "new_student",
    user: "Michael Chen",
    avatar: "MC",
    action: "joined GradeX",
    target: null,
    time: "5 min ago",
    icon: UserPlus,
    color: "chart-2",
  },
  {
    id: 3,
    type: "quiz_completed",
    user: "Emily Davis",
    avatar: "ED",
    action: "completed",
    target: "Physics Fundamentals",
    score: 88,
    time: "12 min ago",
    icon: BookOpen,
    color: "chart-3",
  },
  {
    id: 4,
    type: "achievement",
    user: "James Wilson",
    avatar: "JW",
    action: "earned",
    target: "Quiz Master Badge",
    time: "18 min ago",
    icon: Star,
    color: "chart-4",
  },
  {
    id: 5,
    type: "quiz_completed",
    user: "Lisa Anderson",
    avatar: "LA",
    action: "completed",
    target: "World History",
    score: 72,
    time: "25 min ago",
    icon: Trophy,
    color: "chart-1",
  },
];

const colorClasses: Record<string, { bg: string; text: string }> = {
  "chart-1": { bg: "bg-chart-1/10", text: "text-chart-1" },
  "chart-2": { bg: "bg-chart-2/10", text: "text-chart-2" },
  "chart-3": { bg: "bg-chart-3/10", text: "text-chart-3" },
  "chart-4": { bg: "bg-chart-4/10", text: "text-chart-4" },
};

export function RecentActivity() {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Recent Activity
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Latest student actions
          </p>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span className="text-xs">Live updates</span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {activities.map((activity) => {
          const colors = colorClasses[activity.color];
          return (
            <div
              key={activity.id}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors"
            >
              <div className={`p-2 rounded-lg ${colors.bg}`}>
                <activity.icon className={`h-4 w-4 ${colors.text}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{activity.user}</span>{" "}
                  <span className="text-muted-foreground">
                    {activity.action}
                  </span>{" "}
                  {activity.target && (
                    <span className="font-medium">{activity.target}</span>
                  )}
                  {activity.score && (
                    <span className="text-primary ml-1">
                      ({activity.score}%)
                    </span>
                  )}
                </p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {activity.time}
              </span>
            </div>
          );
        })}
      </div>

      <button className="w-full mt-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors text-center">
        View all activity
      </button>
    </div>
  );
}
