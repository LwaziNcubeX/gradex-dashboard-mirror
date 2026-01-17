"use client"

import { Plus, Upload, Users, FileText } from "lucide-react"
import Link from "next/link"

const actions = [
  {
    label: "Add Question",
    icon: Plus,
    href: "/content",
    color: "emerald",
  },
  {
    label: "Create Quiz",
    icon: FileText,
    href: "/content",
    color: "blue",
  },
  {
    label: "Import Data",
    icon: Upload,
    href: "/settings",
    color: "amber",
  },
  {
    label: "Manage Students",
    icon: Users,
    href: "/students",
    color: "rose",
  },
]

const colorClasses: Record<string, { bg: string; hover: string; text: string }> = {
  emerald: { bg: "bg-emerald-500/10", hover: "hover:bg-emerald-500/20", text: "text-emerald-500" },
  blue: { bg: "bg-blue-500/10", hover: "hover:bg-blue-500/20", text: "text-blue-500" },
  amber: { bg: "bg-amber-500/10", hover: "hover:bg-amber-500/20", text: "text-amber-500" },
  rose: { bg: "bg-rose-500/10", hover: "hover:bg-rose-500/20", text: "text-rose-500" },
}

export function QuickActions() {
  return (
    <div className="bg-[#0D0D0D] rounded-2xl p-6 border border-[#1A1A1A]">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
        <p className="text-sm text-gray-500 mt-1">Common tasks</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const colors = colorClasses[action.color]
          return (
            <Link
              key={action.label}
              href={action.href}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl ${colors.bg} ${colors.hover} transition-colors`}
            >
              <action.icon className={`h-5 w-5 ${colors.text}`} />
              <span className="text-xs font-medium text-white text-center">{action.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
