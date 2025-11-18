import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { QuizzesTable } from "@/components/quizzes-table";
import { serverApiClient } from "@/lib/server-api-client";
import { CONFIG } from "@/lib/config";
import type { Quiz } from "@/lib/interface";

// Enable ISR for this page
export const revalidate = CONFIG.CACHE.REVALIDATE_TIME;

async function getQuizzes() {
  try {
    const response = await serverApiClient.get<{
      success: boolean;
      quizzes: Quiz[];
    }>(CONFIG.ENDPOINTS.QUIZZES.LIST);
    return response.quizzes || [];
  } catch (error) {
    console.error("Failed to fetch quizzes:", error);
    return [];
  }
}

export default async function QuizzesPage() {
  const quizzes = await getQuizzes();

  return (
    <div className="space-y-6 flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quizzes</h2>
          <p className="text-muted-foreground">
            Manage all quizzes for your students
          </p>
        </div>
        <Link href="/dashboard/quizzes/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Quiz
          </Button>
        </Link>
      </div>

      <QuizzesTable quizzes={quizzes} />
    </div>
  );
}
