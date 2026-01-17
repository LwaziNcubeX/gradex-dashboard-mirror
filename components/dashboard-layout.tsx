import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-screen w-full bg-black text-white overflow-hidden">
      <Header />

      <div className="h-full overflow-y-auto no-scrollbar">
        <main className="flex gap-6 p-6 pt-24 min-h-full">
          <Sidebar />

          <div className="flex-1 flex flex-col gap-6 min-w-0">
            {children}

            <div className="flex items-center justify-end gap-2 mt-4">
              <div className="w-[13px] h-[13px] rounded-full bg-emerald-400" />
              <span className="text-sm text-[#919191]">System Online</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
