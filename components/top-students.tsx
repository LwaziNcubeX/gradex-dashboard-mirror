"use client";

import { Trophy, Medal, Award } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

interface StudentEntry {
  user_id: string;
  first_name: string;
  last_name: string;
  total_xp: number;
  quizzes_completed: number;
  streak_days: number;
  current_level: number;
}

interface TopStudentsProps {
  students?: StudentEntry[];
}

const badgeIcons: Record<string, { icon: typeof Trophy; color: string }> = {
  gold: { icon: Trophy, color: "text-chart-3" },
  silver: { icon: Medal, color: "text-muted-foreground" },
  bronze: { icon: Award, color: "text-chart-3/70" },
};

const BADGE_FOR_RANK: Record<number, string> = {
  1: "gold",
  2: "silver",
  3: "bronze",
};

const avatarColors = [
  "bg-linear-to-br from-primary to-primary/70",
  "bg-linear-to-br from-chart-2 to-chart-2/70",
  "bg-linear-to-br from-chart-5 to-chart-5/70",
  "bg-linear-to-br from-chart-3 to-chart-3/70",
  "bg-linear-to-br from-chart-4 to-chart-4/70",
];

export function TopStudents({ students }: TopStudentsProps) {
  const list = students && students.length > 0 ? students.slice(0, 5) : null;

  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Top Students</CardTitle>
            <CardDescription>This month&apos;s leaderboard</CardDescription>
          </div>
          <Button variant="link" className="text-primary p-0 h-auto" asChild>
            <Link href="/students">View All</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-2">
          {list
            ? list.map((student, index) => {
                const rank = index + 1;
                const badge = BADGE_FOR_RANK[rank] ?? null;
                const BadgeIcon = badge ? badgeIcons[badge] : null;
                const initials =
                  `${student.first_name[0]}${student.last_name[0]}`.toUpperCase();
                return (
                  <div
                    key={student.user_id}
                    className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${
                      index === 0
                        ? "bg-chart-3/5 border border-chart-3/20"
                        : "hover:bg-secondary"
                    }`}
                  >
                    <span
                      className={`text-sm font-bold w-6 ${
                        index === 0 ? "text-chart-3" : "text-muted-foreground"
                      }`}
                    >
                      #{rank}
                    </span>
                    <Avatar className={avatarColors[index]}>
                      <AvatarFallback className="bg-transparent text-foreground font-semibold text-sm">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground text-sm truncate">
                          {student.first_name} {student.last_name}
                        </span>
                        {BadgeIcon && (
                          <BadgeIcon.icon
                            className={`h-4 w-4 ${BadgeIcon.color}`}
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {student.quizzes_completed} quizzes
                        </span>
                        <span className="text-xs text-primary">
                          {student.total_xp.toLocaleString()} XP
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-chart-3">
                        <span className="text-sm font-semibold">
                          {student.streak_days}
                        </span>
                        <span className="text-xs">🔥</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        day streak
                      </span>
                    </div>
                  </div>
                );
              })
            : // Skeleton placeholders while loading
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary"
                >
                  <div className="w-6 h-4 bg-secondary rounded animate-pulse" />
                  <div className="w-10 h-10 rounded-full bg-secondary animate-pulse" />
                  <div className="flex-1">
                    <div className="h-3.5 w-32 bg-secondary rounded animate-pulse mb-1.5" />
                    <div className="h-3 w-20 bg-secondary rounded animate-pulse" />
                  </div>
                  <div className="w-10 h-8 bg-secondary rounded animate-pulse" />
                </div>
              ))}
        </div>
      </CardContent>
    </Card>
  );
}
