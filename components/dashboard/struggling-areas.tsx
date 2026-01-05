"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const strugglingAreas = [
  {
    topic: "Algebraic Fractions",
    subject: "Mathematics",
    averageScore: 52,
    studentsAffected: 24,
    trend: "down",
    recommendation: "Schedule review sessions",
    difficulty: "high",
  },
  {
    topic: "Photosynthesis",
    subject: "Biology",
    averageScore: 61,
    studentsAffected: 18,
    trend: "down",
    recommendation: "Use interactive demonstrations",
    difficulty: "high",
  },
  {
    topic: "Essay Writing",
    subject: "English",
    averageScore: 68,
    studentsAffected: 12,
    trend: "up",
    recommendation: "Continue current approach",
    difficulty: "medium",
  },
  {
    topic: "Chemical Equations",
    subject: "Chemistry",
    averageScore: 55,
    studentsAffected: 20,
    trend: "down",
    recommendation: "Increase practical activities",
    difficulty: "high",
  },
];

export function StrugglingAreas() {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-green-100 text-green-700";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Areas Needing Support
        </CardTitle>
        <CardDescription>Topics with lower performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {strugglingAreas.slice(0, 3).map((area, index) => (
          <div key={index} className="rounded-lg border p-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="font-medium text-sm">{area.topic}</p>
                <p className="text-xs text-muted-foreground">{area.subject}</p>
              </div>
              <Badge
                variant="outline"
                className={getDifficultyColor(area.difficulty)}
              >
                {area.averageScore}%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {area.studentsAffected} students affected
            </p>
            <Alert className="p-2">
              <AlertTriangle className="h-3 w-3" />
              <AlertDescription className="text-xs ml-2">
                {area.recommendation}
              </AlertDescription>
            </Alert>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
