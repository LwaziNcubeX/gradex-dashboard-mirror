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
      <DashboardMetrics />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PerformanceChart />
        </div>
        <div className="flex flex-col gap-6">
          <SubjectDistribution />
          <QuickActions />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TopQuizzes />
        </div>
        <div className="flex flex-col gap-6">
          <TopStudents />
        </div>
      </div>

      <RecentActivity />
    </DashboardLayout>
  );
}
