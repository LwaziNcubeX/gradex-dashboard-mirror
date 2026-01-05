"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Brain, Zap } from "lucide-react";

const insights = [
  {
    title: "Peak Learning Hours",
    description: "7-9 PM is when most students engage",
    icon: Clock,
    metric: "2,451 active",
    trend: "+15%",
    color: "bg-blue-50",
  },
  {
    title: "Most Popular Subject",
    description: "Mathematics leads with 34% of quizzes",
    icon: Brain,
    metric: "34%",
    trend: "+2%",
    color: "bg-purple-50",
  },
  {
    title: "Improved Topics",
    description: "Biology shows biggest improvement",
    icon: TrendingUp,
    metric: "+8.2%",
    trend: "This month",
    color: "bg-green-50",
  },
  {
    title: "Collaboration Rate",
    description: "Group study sessions are increasing",
    icon: Users,
    metric: "245",
    trend: "+18%",
    color: "bg-orange-50",
  },
];

import { Clock } from "lucide-react";

export function DataInsights() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Learning Insights
        </CardTitle>
        <CardDescription>Key patterns and trends</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`rounded-lg border-l-4 border-l-blue-500 p-4 ${insight.color}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <insight.icon
                  className="h-5 w-5"
                  style={{ color: "currentColor" }}
                />
                <div>
                  <p className="font-semibold text-sm">{insight.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {insight.description}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="ml-2">
                {insight.trend}
              </Badge>
            </div>
            <p className="text-lg font-bold ml-7">{insight.metric}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
