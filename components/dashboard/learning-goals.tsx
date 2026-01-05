"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

const learningGoals = [
  {
    goal: "Complete Form 1 Mathematics",
    progress: 85,
    dueDate: "15 Jan 2026",
    status: "on-track",
    completedLessons: 17,
    totalLessons: 20,
  },
  {
    goal: "Improve Science Scores to 80%",
    progress: 68,
    dueDate: "22 Jan 2026",
    status: "on-track",
    completedLessons: 13,
    totalLessons: 19,
  },
  {
    goal: "Master English Grammar",
    progress: 92,
    dueDate: "8 Jan 2026",
    status: "completed",
    completedLessons: 23,
    totalLessons: 25,
  },
  {
    goal: "History: Pre-Colonial Period",
    progress: 45,
    dueDate: "28 Jan 2026",
    status: "at-risk",
    completedLessons: 9,
    totalLessons: 20,
  },
];

export function LearningGoals() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case "on-track":
        return <Clock className="h-4 w-4 text-blue-400" />;
      case "at-risk":
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 border-green-500/30 dark:bg-green-500/15";
      case "on-track":
        return "bg-blue-500/10 border-blue-500/30 dark:bg-blue-500/15";
      case "at-risk":
        return "bg-red-500/10 border-red-500/30 dark:bg-red-500/15";
      default:
        return "bg-gray-500/10 border-gray-500/30 dark:bg-gray-500/15";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Learning Goals
        </CardTitle>
        <CardDescription>Progress towards objectives</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {learningGoals.map((goal, index) => (
          <div
            key={index}
            className={`rounded-lg border p-4 ${getStatusColor(goal.status)}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {getStatusIcon(goal.status)}
                <div>
                  <p className="font-medium text-sm">{goal.goal}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {goal.completedLessons}/{goal.totalLessons} lessons
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold bg-card/80 backdrop-blur-sm rounded px-2 py-1 border border-border">
                {goal.progress}%
              </span>
            </div>
            <Progress value={goal.progress} className="h-2 mb-2" />
            <p className="text-xs text-muted-foreground">Due: {goal.dueDate}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
