"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const engagementData = [
  { month: "Jan", students: 1200, quizzes: 3400 },
  { month: "Feb", students: 1400, quizzes: 4200 },
  { month: "Mar", students: 1800, quizzes: 5100 },
  { month: "Apr", students: 2100, quizzes: 5800 },
  { month: "May", students: 2400, quizzes: 6500 },
  { month: "Jun", students: 2847, quizzes: 7200 },
]

const scoreDistribution = [
  { range: "0-50", count: 120 },
  { range: "51-60", count: 280 },
  { range: "61-70", count: 450 },
  { range: "71-80", count: 680 },
  { range: "81-90", count: 520 },
  { range: "91-100", count: 340 },
]

const subjectData = [
  { name: "Math", value: 35, color: "#3B82F6" },
  { name: "Physics", value: 20, color: "#8B5CF6" },
  { name: "Chemistry", value: 18, color: "#10B981" },
  { name: "Biology", value: 15, color: "#F59E0B" },
  { name: "History", value: 12, color: "#EF4444" },
]

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <select className="bg-[#1F1F1F] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-white">
          <option>Last 30 days</option>
          <option>Last 90 days</option>
          <option>Last year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
          <CardHeader>
            <CardTitle className="text-white">Student & Quiz Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" />
                  <XAxis dataKey="month" stroke="#919191" fontSize={12} />
                  <YAxis stroke="#919191" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0D0D0D", border: "1px solid #1F1F1F", borderRadius: "8px" }}
                    labelStyle={{ color: "#E7E7E7" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="students"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.2}
                    name="Students"
                  />
                  <Area
                    type="monotone"
                    dataKey="quizzes"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.2}
                    name="Quizzes Taken"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
          <CardHeader>
            <CardTitle className="text-white">Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" />
                  <XAxis dataKey="range" stroke="#919191" fontSize={12} />
                  <YAxis stroke="#919191" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0D0D0D", border: "1px solid #1F1F1F", borderRadius: "8px" }}
                    labelStyle={{ color: "#E7E7E7" }}
                  />
                  <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} name="Students" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
          <CardHeader>
            <CardTitle className="text-white">Quiz Activity by Subject</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0D0D0D", border: "1px solid #1F1F1F", borderRadius: "8px" }}
                    labelStyle={{ color: "#E7E7E7" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {subjectData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-[#919191]">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
          <CardHeader>
            <CardTitle className="text-white">Key Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <p className="text-emerald-400 font-medium">Student Growth</p>
              <p className="text-sm text-[#919191] mt-1">Student enrollment increased by 18.7% this month</p>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <p className="text-blue-400 font-medium">Quiz Engagement</p>
              <p className="text-sm text-[#919191] mt-1">Average quiz completion rate is 78%, up from 72%</p>
            </div>
            <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <p className="text-amber-400 font-medium">Performance Trend</p>
              <p className="text-sm text-[#919191] mt-1">Mathematics scores improved by 5.2% across all levels</p>
            </div>
            <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <p className="text-purple-400 font-medium">Peak Activity</p>
              <p className="text-sm text-[#919191] mt-1">Most quizzes are taken between 6 PM - 9 PM</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
