import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { StudentPerformanceSummary } from "@/components/dashboard/student-performance-summary";
import { LearningGoals } from "@/components/dashboard/learning-goals";
import { StrugglingAreas } from "@/components/dashboard/struggling-areas";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RetentionMetrics } from "@/components/dashboard/retention-metrics";
import { DataInsights } from "@/components/dashboard/data-insights";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardStats />

      {/* Main Charts and Activity */}
      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <DashboardCharts />
        </div>
        <div className="lg:col-span-3 flex flex-col gap-6">
          <ActivityTimeline />
        </div>
      </div>

      {/* Performance and Goals Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <StudentPerformanceSummary />
        <LearningGoals />
        <StrugglingAreas />
      </div>

      {/* Insights and Quick Access */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DataInsights />
        <QuickActions />
      </div>

      {/* Engagement Metrics
      <div className="grid gap-6 lg:grid-cols-1">
        <RetentionMetrics />
      </div> */}
    </DashboardShell>
  );
}
