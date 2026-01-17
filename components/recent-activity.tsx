"use client"

import { Trophy, BookOpen, UserPlus, Star, Clock } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "quiz_completed",
    user: "Sarah Johnson",
    avatar: "SJ",
    action: "completed",
    target: "Algebra Basics",
    score: 95,
    time: "2 min ago",
    icon: Trophy,
    color: "emerald",
  },
  {
    id: 2,
    type: "new_student",
    user: "Michael Chen",
    avatar: "MC",
    action: "joined GradeX",
    target: null,
    time: "5 min ago",
    icon: UserPlus,
    color: "blue",
  },
  {
    id: 3,
    type: "quiz_completed",
    user: "Emily Davis",
    avatar: "ED",
    action: "completed",
    target: "Physics Fundamentals",
    score: 88,
    time: "12 min ago",
    icon: BookOpen,
    color: "amber",
  },
  {
    id: 4,
    type: "achievement",
    user: "James Wilson",
    avatar: "JW",
    action: "earned",
    target: "Quiz Master Badge",
    time: "18 min ago",
    icon: Star,
    color: "rose",
  },
  {
    id: 5,
    type: "quiz_completed",
    user: "Lisa Anderson",
    avatar: "LA",
    action: "completed",
    target: "World History",
    score: 72,
    time: "25 min ago",
    icon: Trophy,
    color: "emerald",
  },
]

const colorClasses: Record<string, { bg: string; text: string }> = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-500" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-500" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-500" },
  rose: { bg: "bg-rose-500/10", text: "text-rose-500" },
}

export function RecentActivity() {
  return (
    <div className="bg-[#0D0D0D] rounded-2xl p-6 border border-[#1A1A1A]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
          <p className="text-sm text-gray-500 mt-1">Latest student actions</p>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Clock className="h-4 w-4" />
          <span className="text-xs">Live updates</span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {activities.map((activity) => {
          const colors = colorClasses[activity.color]
          return (
            <div
              key={activity.id}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1A1A1A] transition-colors"
            >
              <div className={`p-2 rounded-lg ${colors.bg}`}>
                <activity.icon className={`h-4 w-4 ${colors.text}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white">
                  <span className="font-medium">{activity.user}</span>{" "}
                  <span className="text-gray-400">{activity.action}</span>{" "}
                  {activity.target && <span className="font-medium">{activity.target}</span>}
                  {activity.score && <span className="text-emerald-400 ml-1">({activity.score}%)</span>}
                </p>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</span>
            </div>
          )
        })}
      </div>

      <button className="w-full mt-4 py-2 text-sm text-gray-400 hover:text-white transition-colors text-center">
        View all activity
      </button>
    </div>
  )
}
