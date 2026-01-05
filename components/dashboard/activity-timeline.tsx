"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Award, AlertCircle, TrendingUp } from "lucide-react";

const timeline = [
  {
    timestamp: "Today 2:30 PM",
    event: "Quiz Milestone",
    description: "Sarah completed 50th quiz",
    icon: Award,
    color: "bg-yellow-500/15 dark:bg-yellow-500/20",
    iconColor: "text-yellow-400",
  },
  {
    timestamp: "Today 1:15 PM",
    event: "Low Score Alert",
    description: "John scored 45% on Chemistry Quiz",
    icon: AlertCircle,
    color: "bg-red-500/15 dark:bg-red-500/20",
    iconColor: "text-red-400",
  },
  {
    timestamp: "Today 12:00 PM",
    event: "Study Session",
    description: "5 students started group study session",
    icon: BookOpen,
    color: "bg-blue-500/15 dark:bg-blue-500/20",
    iconColor: "text-blue-400",
  },
  {
    timestamp: "Yesterday 4:45 PM",
    event: "Improvement",
    description: "Mary improved Math score by 12%",
    icon: TrendingUp,
    color: "bg-green-500/15 dark:bg-green-500/20",
    iconColor: "text-green-400",
  },
];

export function ActivityTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Activity Timeline
        </CardTitle>
        <CardDescription>Recent events and milestones</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timeline.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`rounded-full p-2 ${item.color}`}>
                    <Icon className={`h-4 w-4 ${item.iconColor}`} />
                  </div>
                  {index < timeline.length - 1 && (
                    <div className="w-0.5 h-12 bg-muted-foreground/20 my-2" />
                  )}
                </div>
                <div className="pt-0.5 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold">{item.event}</p>
                    <Badge variant="outline" className="text-xs">
                      {item.timestamp}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
