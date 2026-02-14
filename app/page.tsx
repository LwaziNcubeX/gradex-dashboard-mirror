import { DashboardMetrics } from "@/components/dashboard-metrics";
import { PerformanceChart } from "@/components/performance-chart";
import { TopQuizzes } from "@/components/top-quizzes";
import { RecentActivity } from "@/components/recent-activity";
import { TopStudents } from "@/components/top-students";
import { SubjectDistribution } from "@/components/subject-distribution";
import { QuickActions } from "@/components/quick-actions";
import { DashboardLayout } from "@/components/dashboard-layout";

export default function Dashboard() {
  return (
    <DashboardLayout>
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-oswald tracking-tight text-foreground">
            Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Welcome back. Here is what is happening today.
          </p>
        </div>
      </div>

      {/* Metrics row */}
      <DashboardMetrics />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <PerformanceChart />
        </div>
        <div className="flex flex-col gap-4">
          <SubjectDistribution />
          <QuickActions />
        </div>
      </div>

      {/* Tables row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <TopQuizzes />
        </div>
        <TopStudents />
      </div>

      {/* Activity */}
      <RecentActivity />
    </DashboardLayout>
  );
}
