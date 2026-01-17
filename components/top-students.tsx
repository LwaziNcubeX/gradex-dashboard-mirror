"use client";

import { Trophy, Medal, Award } from "lucide-react";

const students = [
  {
    rank: 1,
    name: "Sarah Johnson",
    avatar: "SJ",
    quizzes: 142,
    avgScore: 96,
    streak: 28,
    badge: "gold",
  },
  {
    rank: 2,
    name: "Michael Chen",
    avatar: "MC",
    quizzes: 128,
    avgScore: 94,
    streak: 21,
    badge: "silver",
  },
  {
    rank: 3,
    name: "Emily Davis",
    avatar: "ED",
    quizzes: 119,
    avgScore: 93,
    streak: 18,
    badge: "bronze",
  },
  {
    rank: 4,
    name: "James Wilson",
    avatar: "JW",
    quizzes: 112,
    avgScore: 91,
    streak: 15,
    badge: null,
  },
  {
    rank: 5,
    name: "Lisa Anderson",
    avatar: "LA",
    quizzes: 108,
    avgScore: 90,
    streak: 12,
    badge: null,
  },
];

const badgeIcons: Record<string, { icon: typeof Trophy; color: string }> = {
  gold: { icon: Trophy, color: "text-chart-3" },
  silver: { icon: Medal, color: "text-muted-foreground" },
  bronze: { icon: Award, color: "text-chart-3/70" },
};

const avatarColors = [
  "from-primary to-primary/70",
  "from-chart-2 to-chart-2/70",
  "from-chart-5 to-chart-5/70",
  "from-chart-3 to-chart-3/70",
  "from-chart-4 to-chart-4/70",
];

export function TopStudents() {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Top Students
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            This month&apos;s leaderboard
          </p>
        </div>
        <button className="text-sm text-primary hover:text-primary/80 transition-colors font-medium">
          View All
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {students.map((student, index) => {
          const BadgeIcon = student.badge ? badgeIcons[student.badge] : null;
          return (
            <div
              key={student.rank}
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
                #{student.rank}
              </span>
              <div
                className={`w-10 h-10 rounded-full bg-linear-to-br ${avatarColors[index]} flex items-center justify-center text-foreground font-semibold text-sm`}
              >
                {student.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground text-sm truncate">
                    {student.name}
                  </span>
                  {BadgeIcon && (
                    <BadgeIcon.icon className={`h-4 w-4 ${BadgeIcon.color}`} />
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {student.quizzes} quizzes
                  </span>
                  <span className="text-xs text-primary">
                    {student.avgScore}% avg
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-chart-3">
                  <span className="text-sm font-semibold">
                    {student.streak}
                  </span>
                  <span className="text-xs">🔥</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  day streak
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
