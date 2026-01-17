"use client"

import { Trophy, Medal, Award } from "lucide-react"

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
]

const badgeIcons: Record<string, { icon: typeof Trophy; color: string }> = {
  gold: { icon: Trophy, color: "text-amber-400" },
  silver: { icon: Medal, color: "text-gray-300" },
  bronze: { icon: Award, color: "text-amber-600" },
}

const avatarColors = [
  "from-emerald-500 to-teal-500",
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-pink-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-red-500",
]

export function TopStudents() {
  return (
    <div className="bg-[#0D0D0D] rounded-2xl p-6 border border-[#1A1A1A]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Top Students</h2>
          <p className="text-sm text-gray-500 mt-1">This month&apos;s leaderboard</p>
        </div>
        <button className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
          View All
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {students.map((student, index) => {
          const BadgeIcon = student.badge ? badgeIcons[student.badge] : null
          return (
            <div
              key={student.rank}
              className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${
                index === 0 ? "bg-amber-500/5 border border-amber-500/20" : "hover:bg-[#1A1A1A]"
              }`}
            >
              <span className={`text-sm font-bold w-6 ${index === 0 ? "text-amber-400" : "text-gray-500"}`}>
                #{student.rank}
              </span>
              <div
                className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColors[index]} flex items-center justify-center text-white font-semibold text-sm`}
              >
                {student.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white text-sm truncate">{student.name}</span>
                  {BadgeIcon && <BadgeIcon.icon className={`h-4 w-4 ${BadgeIcon.color}`} />}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-500">{student.quizzes} quizzes</span>
                  <span className="text-xs text-emerald-400">{student.avgScore}% avg</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-amber-400">
                  <span className="text-sm font-semibold">{student.streak}</span>
                  <span className="text-xs">🔥</span>
                </div>
                <span className="text-xs text-gray-500">day streak</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
