"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { name: "Mathematics", value: 32, color: "#3B82F6" },
  { name: "Science", value: 28, color: "#10B981" },
  { name: "English", value: 22, color: "#F59E0B" },
  { name: "History", value: 18, color: "#EF4444" },
]

export function SubjectDistribution() {
  const total = data.reduce((acc, item) => acc + item.value, 0)

  return (
    <div className="bg-[#0D0D0D] rounded-2xl p-6 border border-[#1A1A1A]">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">Subject Distribution</h2>
        <p className="text-sm text-gray-500 mt-1">Quiz attempts by subject</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="h-[160px] w-[160px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-[#1A1A1A] border border-[#333] p-2 rounded-lg shadow-xl">
                        <p className="text-white text-sm font-medium">{data.name}</p>
                        <p className="text-gray-400 text-xs">{data.value}% of quizzes</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{total}%</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-3">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-gray-400">{item.name}</span>
              </div>
              <span className="text-sm font-medium text-white">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
