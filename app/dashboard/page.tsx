import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";

async function getDashboardStats() {
  try {
    // const [questionsRes, quizzesRes, levelsRes] = await Promise.all([
    //   serverApiClient.get<{ success: boolean; questions: any[] }>(
    //     CONFIG.ENDPOINTS.QUESTIONS.LIST,
    //     { cache: "force-cache", revalidate: CONFIG.CACHE.REVALIDATE_TIME }
    //   ),
    //   serverApiClient.get<{ success: boolean; quizzes: any[] }>(
    //     CONFIG.ENDPOINTS.QUIZZES.LIST,
    //     {
    //       cache: "force-cache",
    //       revalidate: CONFIG.CACHE.REVALIDATE_TIME,
    //     }
    //   ),
    //   serverApiClient.get<{ success: boolean; levels: any[] }>(
    //     CONFIG.ENDPOINTS.LEVELS.LIST,
    //     {
    //       cache: "force-cache",
    //       revalidate: CONFIG.CACHE.REVALIDATE_TIME,
    //     }
    //   ),
    // ]);

    return {
      totalQuizzes: 10,
      totalQuestions: 60,
      totalLevels: 50,
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
