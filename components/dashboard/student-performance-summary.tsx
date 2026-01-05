"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Clock } from "lucide-react";

const performanceSummary = [
  {
    metric: "Quiz Completion Rate",
    value: 84.2,
    target: 90,
    trend: "+2.3%",
    icon: Target,
    color: "hsl(200, 100%, 50%)",
  },
  {
    metric: "Avg. Response Time",
    value: 3.2,
    unit: "min",
    trend: "-0.5 min",
    icon: Clock,
    color: "hsl(280, 100%, 50%)",
  },
  {
    metric: "Content Mastery",
    value: 71,
    target: 85,
    trend: "+3.1%",
    icon: TrendingUp,
    color: "hsl(120, 100%, 50%)",
  },
];

export function StudentPerformanceSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Performance Summary
        </CardTitle>
        <CardDescription>Key metrics at a glance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {performanceSummary.map((item) => {
          const Icon = item.icon;
          const progress =
            "target" in item && item.target
              ? (item.value / item.target) * 100
              : item.value;

          return (
            <div key={item.metric} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-8 w-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: item.color + "20" }}
                  >
                    <Icon className="h-4 w-4" style={{ color: item.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.metric}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-lg font-semibold">
                        {item.value}
                        {"unit" in item ? item.unit : "%"}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {item.trend}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              {"target" in item && (
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{item.target}% target</span>
                  </div>
                  <Progress value={Math.min(progress, 100)} className="h-2" />
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
