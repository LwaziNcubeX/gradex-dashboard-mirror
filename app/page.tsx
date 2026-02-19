import { DashboardMetrics } from "@/components/dashboard-metrics";
import { PerformanceChart } from "@/components/performance-chart";
import { TopQuizzes } from "@/components/top-quizzes";
import { RecentActivity } from "@/components/recent-activity";
import { TopStudents } from "@/components/top-students";
import { SubjectDistribution } from "@/components/subject-distribution";
import { QuickActions } from "@/components/quick-actions";
import { DashboardLayout } from "@/components/dashboard-layout";
import { cookies } from "next/headers";
import {
  adminService,
  type OverviewData,
  type AnalyticsData,
} from "@/lib/api/admin";
import { studentService } from "@/lib/api/students";

async function getDashboardData(): Promise<{
  overview: OverviewData | null;
  analytics: AnalyticsData | null;
  topStudents: any[] | null;
}> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { overview: null, analytics: null, topStudents: null };
  }

  try {
    const [overview, analytics, studentsResult] = await Promise.allSettled([
      adminService.getOverview(accessToken),
      adminService.getAnalytics(accessToken),
      studentService.getAllStudents(
        { page: 1, page_size: 5, sort_by: "total_xp", sort_order: "desc" },
        accessToken,
      ),
    ]);

    return {
      overview: overview.status === "fulfilled" ? overview.value : null,
      analytics: analytics.status === "fulfilled" ? analytics.value : null,
      topStudents:
        studentsResult.status === "fulfilled"
          ? studentsResult.value.data
          : null,
    };
  } catch {
    return { overview: null, analytics: null, topStudents: null };
  }
}

export default async function Dashboard() {
  const { overview, analytics, topStudents } = await getDashboardData();

  return (
    <DashboardLayout>
      <DashboardMetrics overview={overview} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PerformanceChart analytics={analytics} />
        </div>
        <div className="flex flex-col gap-6">
          <SubjectDistribution overview={overview} />
          <QuickActions />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TopQuizzes analytics={analytics} />
        </div>
        <div className="flex flex-col gap-6">
          <TopStudents students={topStudents ?? undefined} />
        </div>
      </div>

      <RecentActivity />
    </DashboardLayout>
  );
}
