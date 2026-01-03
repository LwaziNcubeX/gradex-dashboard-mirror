import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardStats />
      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <DashboardCharts />
        </div>
        <div className="lg:col-span-3">
          <RecentActivity />
        </div>
      </div>
    </DashboardShell>
  )
}
