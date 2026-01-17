import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, TrendingUp, Award, Clock } from "lucide-react"

const students = [
  { id: 1, name: "Sarah Johnson", email: "sarah@email.com", quizzes: 45, avgScore: 92, streak: 12 },
  { id: 2, name: "Mike Chen", email: "mike@email.com", quizzes: 38, avgScore: 88, streak: 7 },
  { id: 3, name: "Emily Davis", email: "emily@email.com", quizzes: 52, avgScore: 95, streak: 21 },
  { id: 4, name: "James Wilson", email: "james@email.com", quizzes: 29, avgScore: 79, streak: 3 },
  { id: 5, name: "Anna Martinez", email: "anna@email.com", quizzes: 41, avgScore: 86, streak: 9 },
  { id: 6, name: "David Lee", email: "david@email.com", quizzes: 33, avgScore: 91, streak: 14 },
]

export default function StudentsPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Students</h1>
        <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-sm font-medium transition-colors">
          Add Student
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-lg">
              <Users className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-[#919191]">Total Students</p>
              <p className="text-2xl font-bold text-white">2,847</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-[#919191]">Active Today</p>
              <p className="text-2xl font-bold text-white">1,234</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-lg">
              <Award className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-[#919191]">Top Performers</p>
              <p className="text-2xl font-bold text-white">156</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Clock className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-[#919191]">Avg. Study Time</p>
              <p className="text-2xl font-bold text-white">45m</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
        <CardHeader>
          <CardTitle className="text-white">All Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1F1F1F]">
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#919191]">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#919191]">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#919191]">Quizzes</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#919191]">Avg Score</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#919191]">Streak</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b border-[#1F1F1F] hover:bg-[#1F1F1F]/50 transition-colors">
                    <td className="py-3 px-4 text-sm text-white font-medium">{student.name}</td>
                    <td className="py-3 px-4 text-sm text-[#919191]">{student.email}</td>
                    <td className="py-3 px-4 text-sm text-white">{student.quizzes}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-sm font-medium ${student.avgScore >= 90 ? "text-emerald-400" : student.avgScore >= 80 ? "text-amber-400" : "text-red-400"}`}
                      >
                        {student.avgScore}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-white">{student.streak} days</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
