"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award } from "lucide-react"

const topStudents = [
  { rank: 1, name: "Tendai Moyo", xp: 4520, streak: 28, level: 12 },
  { rank: 2, name: "Chipo Ndlovu", xp: 4380, streak: 21, level: 11 },
  { rank: 3, name: "Kudakwashe Banda", xp: 4150, streak: 18, level: 11 },
  { rank: 4, name: "Rudo Zimuto", xp: 3920, streak: 15, level: 10 },
  { rank: 5, name: "Tanaka Sibanda", xp: 3780, streak: 12, level: 10 },
]

export function TopPerformers() {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-4 w-4 text-yellow-500" />
      case 2:
        return <Medal className="h-4 w-4 text-gray-400" />
      case 3:
        return <Award className="h-4 w-4 text-amber-600" />
      default:
        return <span className="text-sm font-medium text-muted-foreground">#{rank}</span>
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Top Performers</CardTitle>
        <CardDescription>Students with highest XP this month</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {topStudents.map((student) => (
          <div
            key={student.rank}
            className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
          >
            <div className="flex h-8 w-8 items-center justify-center">{getRankIcon(student.rank)}</div>
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                {student.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{student.name}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{student.xp.toLocaleString()} XP</span>
                <span>•</span>
                <span>Level {student.level}</span>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              {student.streak}d streak
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
