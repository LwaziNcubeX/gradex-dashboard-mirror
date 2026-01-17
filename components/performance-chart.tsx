"use client"

import { Calendar, Download } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Bar, BarChart } from "recharts"
import { useState } from "react"

const engagementData = [
  { date: "Jan 1", users: 8500, quizzes: 12000 },
  { date: "Jan 8", users: 8800, quizzes: 13200 },
  { date: "Jan 15", users: 9200, quizzes: 14100 },
  { date: "Jan 22", users: 9400, quizzes: 14800 },
  { date: "Jan 29", users: 9100, quizzes: 13900 },
  { date: "Feb 5", users: 9600, quizzes: 15200 },
  { date: "Feb 12", users: 9800, quizzes: 15800 },
  { date: "Feb 19", users: 10100, quizzes: 16400 },
  { date: "Feb 26", users: 10400, quizzes: 17100 },
  { date: "Mar 5", users: 10200, quizzes: 16800 },
  { date: "Mar 12", users: 10600, quizzes: 17500 },
  { date: "Mar 19", users: 10900, quizzes: 18200 },
  { date: "Mar 26", users: 11100, quizzes: 18900 },
  { date: "Apr 2", users: 11400, quizzes: 19500 },
  { date: "Apr 9", users: 11200, quizzes: 19100 },
  { date: "Apr 16", users: 11600, quizzes: 19800 },
  { date: "Apr 23", users: 11800, quizzes: 20400 },
  { date: "Apr 30", users: 12000, quizzes: 21000 },
  { date: "May 7", users: 12200, quizzes: 21600 },
  { date: "May 14", users: 12100, quizzes: 21300 },
  { date: "May 21", users: 12400, quizzes: 22100 },
  { date: "May 28", users: 12600, quizzes: 22800 },
  { date: "Jun 4", users: 12500, quizzes: 22500 },
  { date: "Jun 11", users: 12700, quizzes: 23200 },
  { date: "Jun 18", users: 12847, quizzes: 23800 },
]

const weeklyData = [
  { day: "Mon", quizzes: 4200, avgScore: 76 },
  { day: "Tue", quizzes: 5100, avgScore: 78 },
  { day: "Wed", quizzes: 4800, avgScore: 75 },
  { day: "Thu", quizzes: 5400, avgScore: 79 },
  { day: "Fri", quizzes: 4600, avgScore: 77 },
  { day: "Sat", quizzes: 6200, avgScore: 82 },
  { day: "Sun", quizzes: 5800, avgScore: 80 },
]

export function PerformanceChart() {
  const [activeTab, setActiveTab] = useState<"engagement" | "weekly">("engagement")
  const [period, setPeriod] = useState("6M")

  return (
    <div className="flex flex-col gap-6 p-6 bg-[#0D0D0D] rounded-2xl border border-[#1A1A1A]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-[#1A1A1A] rounded-lg p-1">
            <button
              onClick={() => setActiveTab("engagement")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                activeTab === "engagement" ? "bg-emerald-500/20 text-emerald-400" : "text-gray-400 hover:text-white"
              }`}
            >
              Engagement
            </button>
            <button
              onClick={() => setActiveTab("weekly")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                activeTab === "weekly" ? "bg-emerald-500/20 text-emerald-400" : "text-gray-400 hover:text-white"
              }`}
            >
              Weekly Activity
            </button>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-[#1A1A1A] rounded-full border border-[#333]">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-white">Live</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {activeTab === "engagement" && (
            <div className="flex items-center bg-[#1A1A1A] rounded-lg p-1">
              {["1D", "1W", "1M", "3M", "6M"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    period === p ? "bg-[#2A2A2A] text-white shadow-sm" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-white bg-[#1A1A1A] rounded-lg transition-colors">
              <Calendar className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white bg-[#1A1A1A] rounded-lg transition-colors">
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {activeTab === "engagement" && (
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-sm text-gray-400">Active Users</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm text-gray-400">Quizzes Taken</span>
          </div>
        </div>
      )}

      <div className="h-[300px] w-full">
        {activeTab === "engagement" ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={engagementData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorQuizzes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" vertical={false} />
              <XAxis dataKey="date" hide />
              <YAxis
                yAxisId="left"
                orientation="left"
                tick={{ fill: "#666", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: "#666", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#1A1A1A] border border-[#333] p-3 rounded-lg shadow-xl">
                        <p className="text-xs text-gray-400 mb-2">{payload[0].payload.date}</p>
                        <p className="text-emerald-400 text-sm">{payload[0].value?.toLocaleString()} users</p>
                        <p className="text-blue-400 text-sm">{payload[1]?.value?.toLocaleString()} quizzes</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="users"
                stroke="#10B981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorUsers)"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="quizzes"
                stroke="#3B82F6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorQuizzes)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: "#666", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: "#666", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#1A1A1A] border border-[#333] p-3 rounded-lg shadow-xl">
                        <p className="text-xs text-gray-400 mb-2">{payload[0].payload.day}</p>
                        <p className="text-emerald-400 text-sm">{payload[0].value?.toLocaleString()} quizzes</p>
                        <p className="text-blue-400 text-sm">Avg. Score: {payload[0].payload.avgScore}%</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="quizzes" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
