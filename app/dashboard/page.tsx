import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { serverApiClient } from "@/lib/server-api-client";
import { CONFIG } from "@/lib/config";

async function getDashboardStats() {
  try {
    const [questionsRes, quizzesRes, levelsRes] = await Promise.all([
      serverApiClient.get<{ success: boolean; questions: any[] }>(
        "/questions",
        { cache: "force-cache", revalidate: CONFIG.CACHE.REVALIDATE_TIME }
      ),
      serverApiClient.get<{ success: boolean; quizzes: any[] }>("/quizzes", {
        cache: "force-cache",
        revalidate: CONFIG.CACHE.REVALIDATE_TIME,
      }),
      serverApiClient.get<{ success: boolean; levels: any[] }>("/levels", {
        cache: "force-cache",
        revalidate: CONFIG.CACHE.REVALIDATE_TIME,
      }),
    ]);

    return {
      totalQuizzes: quizzesRes.quizzes?.length || 0,
      totalQuestions: questionsRes.questions?.length || 0,
      totalLevels: levelsRes.levels?.length || 0,
      totalStudents: 0,
    };
  } catch (error) {
    return {
      totalQuizzes: 0,
      totalQuestions: 0,
      totalLevels: 0,
      totalStudents: 0,
    };
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards stats={stats} />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
    </div>
  );
}
