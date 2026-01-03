import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AnalyticsOverview } from "@/components/analytics/analytics-overview"
import { AnalyticsCharts } from "@/components/analytics/analytics-charts"
import { TopPerformers } from "@/components/analytics/top-performers"

export default function AnalyticsPage() {
  return (
    <DashboardShell title="Analytics" description="Track student performance and engagement metrics">
      <AnalyticsOverview />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AnalyticsCharts />
        </div>
        <div>
          <TopPerformers />
        </div>
      </div>
    </DashboardShell>
  )
}
