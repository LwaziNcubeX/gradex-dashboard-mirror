import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, ThumbsUp, ThumbsDown, AlertCircle, Star } from "lucide-react"

const feedbackItems = [
  {
    id: 1,
    user: "Sarah J.",
    type: "suggestion",
    message: "Would love to see more practice quizzes for calculus",
    date: "2 hours ago",
    rating: 5,
  },
  {
    id: 2,
    user: "Mike C.",
    type: "bug",
    message: "App crashes when submitting quiz on slow connection",
    date: "5 hours ago",
    rating: null,
  },
  {
    id: 3,
    user: "Emily D.",
    type: "praise",
    message: "The new physics course is amazing! Very helpful explanations",
    date: "1 day ago",
    rating: 5,
  },
  {
    id: 4,
    user: "James W.",
    type: "suggestion",
    message: "Please add dark mode for studying at night",
    date: "1 day ago",
    rating: 4,
  },
  {
    id: 5,
    user: "Anna M.",
    type: "bug",
    message: "Leaderboard not updating after quiz completion",
    date: "2 days ago",
    rating: null,
  },
  {
    id: 6,
    user: "David L.",
    type: "praise",
    message: "Best learning app I've used. Keep up the great work!",
    date: "3 days ago",
    rating: 5,
  },
]

export default function FeedbackPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Feedback</h1>
        <div className="flex gap-2">
          <button className="px-3 py-2 bg-[#1F1F1F] hover:bg-[#2A2A2A] rounded-lg text-sm font-medium transition-colors">
            All
          </button>
          <button className="px-3 py-2 bg-[#1F1F1F] hover:bg-[#2A2A2A] rounded-lg text-sm font-medium transition-colors">
            Bugs
          </button>
          <button className="px-3 py-2 bg-[#1F1F1F] hover:bg-[#2A2A2A] rounded-lg text-sm font-medium transition-colors">
            Suggestions
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-lg">
              <MessageSquare className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-[#919191]">Total Feedback</p>
              <p className="text-2xl font-bold text-white">1,247</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <ThumbsUp className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-[#919191]">Positive</p>
              <p className="text-2xl font-bold text-white">892</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-lg">
              <AlertCircle className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-[#919191]">Suggestions</p>
              <p className="text-2xl font-bold text-white">267</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-red-500/10 rounded-lg">
              <ThumbsDown className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-[#919191]">Bug Reports</p>
              <p className="text-2xl font-bold text-white">88</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
        <CardHeader>
          <CardTitle className="text-white">Recent Feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {feedbackItems.map((item) => (
            <div key={item.id} className="p-4 bg-[#1F1F1F]/50 rounded-lg border border-[#2A2A2A]">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <span className="text-emerald-400 font-medium">{item.user.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{item.user}</p>
                    <p className="text-xs text-[#919191]">{item.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm text-white">{item.rating}</span>
                    </div>
                  )}
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      item.type === "praise"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : item.type === "suggestion"
                          ? "bg-blue-500/10 text-blue-400"
                          : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </span>
                </div>
              </div>
              <p className="text-sm text-[#919191] mt-3">{item.message}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
