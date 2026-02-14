"use client";

import { Trophy, Medal, Award } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const students = [
  { rank: 1, name: "Sarah Johnson", avatar: "SJ", quizzes: 142, avgScore: 96, streak: 28, badge: "gold" },
  { rank: 2, name: "Michael Chen", avatar: "MC", quizzes: 128, avgScore: 94, streak: 21, badge: "silver" },
  { rank: 3, name: "Emily Davis", avatar: "ED", quizzes: 119, avgScore: 93, streak: 18, badge: "bronze" },
  { rank: 4, name: "James Wilson", avatar: "JW", quizzes: 112, avgScore: 91, streak: 15, badge: null },
  { rank: 5, name: "Lisa Anderson", avatar: "LA", quizzes: 108, avgScore: 90, streak: 12, badge: null },
];

const badgeIcons: Record<string, { icon: typeof Trophy; color: string }> = {
  gold: { icon: Trophy, color: "text-chart-3" },
  silver: { icon: Medal, color: "text-muted-foreground" },
  bronze: { icon: Award, color: "text-chart-3/70" },
};

const avatarColors = [
  "bg-primary/20 text-primary",
  "bg-chart-2/20 text-chart-2",
  "bg-chart-5/20 text-chart-5",
  "bg-chart-3/20 text-chart-3",
  "bg-chart-4/20 text-chart-4",
];

export function TopStudents() {
  return (
    <Card className="rounded-xl">
      <CardHeader className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-foreground">Top Students</CardTitle>
          <Button variant="link" className="text-primary p-0 h-auto text-xs">
            View All
          </Button>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4">
        <div className="flex flex-col gap-1">
          {students.map((student, index) => {
            const BadgeIcon = student.badge ? badgeIcons[student.badge] : null;
            return (
              <div
                key={student.rank}
                className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors ${
                  index === 0
                    ? "bg-chart-3/5 border border-chart-3/20"
                    : "hover:bg-secondary"
                }`}
              >
                <span className={`text-xs font-bold w-5 tabular-nums ${index === 0 ? "text-chart-3" : "text-muted-foreground"}`}>
                  #{student.rank}
                </span>
                <Avatar className={`h-7 w-7 ${avatarColors[index]}`}>
                  <AvatarFallback className="bg-transparent text-[11px] font-semibold">
                    {student.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-foreground text-sm truncate">
                      {student.name}
                    </span>
                    {BadgeIcon && (
                      <BadgeIcon.icon className={`h-3.5 w-3.5 shrink-0 ${BadgeIcon.color}`} />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-muted-foreground">{student.quizzes} quizzes</span>
                    <span className="text-[11px] text-primary">{student.avgScore}%</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-semibold text-chart-3 tabular-nums">{student.streak}d</span>
                  <span className="text-[10px] text-muted-foreground block">streak</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
