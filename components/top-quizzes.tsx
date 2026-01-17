"use client"

import { ArrowUp, ArrowDown, ChevronsUpDown, BookOpen, MoreHorizontal } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer } from "recharts"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const quizData = [
  {
    id: "math-101",
    name: "Algebra Basics",
    subject: "Mathematics",
    attempts: 4521,
    avgScore: 82,
    completion: 94,
    trend: "up",
    chartData: [
      { value: 70 },
      { value: 72 },
      { value: 75 },
      { value: 78 },
      { value: 76 },
      { value: 80 },
      { value: 79 },
      { value: 82 },
      { value: 81 },
      { value: 84 },
      { value: 82 },
    ],
  },
  {
    id: "sci-201",
    name: "Physics Fundamentals",
    subject: "Science",
    attempts: 3892,
    avgScore: 75,
    completion: 88,
    trend: "up",
    chartData: [
      { value: 65 },
      { value: 68 },
      { value: 70 },
      { value: 69 },
      { value: 72 },
      { value: 71 },
      { value: 73 },
      { value: 74 },
      { value: 73 },
      { value: 76 },
      { value: 75 },
    ],
  },
  {
    id: "eng-102",
    name: "Grammar Essentials",
    subject: "English",
    attempts: 5234,
    avgScore: 68,
    completion: 91,
    trend: "down",
    chartData: [
      { value: 75 },
      { value: 73 },
      { value: 74 },
      { value: 72 },
      { value: 70 },
      { value: 71 },
      { value: 69 },
      { value: 70 },
      { value: 68 },
      { value: 69 },
      { value: 68 },
    ],
  },
  {
    id: "hist-101",
    name: "World History",
    subject: "History",
    attempts: 2847,
    avgScore: 79,
    completion: 86,
    trend: "up",
    chartData: [
      { value: 72 },
      { value: 74 },
      { value: 73 },
      { value: 76 },
      { value: 75 },
      { value: 77 },
      { value: 76 },
      { value: 78 },
      { value: 77 },
      { value: 80 },
      { value: 79 },
    ],
  },
]

const subjectColors: Record<string, string> = {
  Mathematics: "bg-blue-500",
  Science: "bg-emerald-500",
  English: "bg-amber-500",
  History: "bg-rose-500",
}

export function TopQuizzes() {
  return (
    <div className="bg-[#0D0D0D] rounded-2xl p-6 border border-[#1A1A1A]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Top Performing Quizzes</h2>
          <p className="text-sm text-gray-500 mt-1">Based on completion rate and average score</p>
        </div>
        <button className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="text-gray-500 text-xs border-b border-[#1A1A1A]">
              <th className="pb-3 text-left font-medium pl-2">
                <div className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
                  Quiz
                  <ChevronsUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="pb-3 text-left font-medium w-[100px]">Trend</th>
              <th className="pb-3 text-right font-medium">Attempts</th>
              <th className="pb-3 text-right font-medium">Avg. Score</th>
              <th className="pb-3 text-right font-medium">Completion</th>
              <th className="pb-3 text-right font-medium pr-2 w-[40px]"></th>
            </tr>
          </thead>
          <tbody>
            {quizData.map((item, index) => (
              <tr
                key={item.id}
                className={`group transition-colors border-b border-[#1A1A1A] last:border-0 ${
                  index === 0 ? "bg-emerald-500/5" : "hover:bg-[#1A1A1A]"
                }`}
              >
                <td className="py-4 pl-2 rounded-l-xl">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg ${subjectColors[item.subject]} flex items-center justify-center`}
                    >
                      <BookOpen className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <span className="font-medium text-white block text-sm">{item.name}</span>
                      <span className="text-xs text-gray-500">{item.subject}</span>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <div className="h-8 w-20">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={item.chartData}>
                        <defs>
                          <linearGradient id={`gradient-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop
                              offset="0%"
                              stopColor={item.trend === "up" ? "#10B981" : "#F87171"}
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="100%"
                              stopColor={item.trend === "up" ? "#10B981" : "#F87171"}
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke={item.trend === "up" ? "#10B981" : "#F87171"}
                          strokeWidth={1.5}
                          fill={`url(#gradient-${item.id})`}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </td>
                <td className="py-4 text-right text-white font-medium text-sm">{item.attempts.toLocaleString()}</td>
                <td
                  className={`py-4 text-right font-medium text-sm ${item.trend === "up" ? "text-emerald-400" : "text-red-400"}`}
                >
                  {item.avgScore}%
                </td>
                <td className="py-4 text-right font-medium">
                  <div className="flex items-center justify-end gap-1 text-white text-sm">
                    {item.trend === "up" ? (
                      <ArrowUp className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <ArrowDown className="h-3 w-3 text-red-400" />
                    )}
                    {item.completion}%
                  </div>
                </td>
                <td className="py-4 pr-2 rounded-r-xl">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-[#2A2A2A] transition-colors opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#0D0D0D] border-[#1F1F1F] text-white">
                      <DropdownMenuItem className="focus:bg-[#1F1F1F] focus:text-white cursor-pointer text-gray-400">
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="focus:bg-[#1F1F1F] focus:text-white cursor-pointer text-gray-400">
                        Edit Quiz
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
