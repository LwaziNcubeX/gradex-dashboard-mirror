import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { QuestionsTable } from "@/components/questions-table";
import { serverApiClient } from "@/lib/server-api-client";
import { CONFIG } from "@/lib/config";

export interface Question {
  id?: string;
  _id?: string;
  question_id?: string;
  subject: string;
  topic: string;
  subtopics: string[];
  question_text: string;
  answers: string[];
  correct_answer: string;
  hint: string;
  level: "Form 1" | "Form 2" | "Form 3" | "Form 4";
  created_at: string;
}

// Helper function to get question ID regardless of field name
export function getQuestionId(question: Question): string {
  return question.id || question._id || question.question_id || "";
}

// Enable ISR for this page
export const revalidate = CONFIG.CACHE.REVALIDATE_TIME;

async function getQuestions() {
  try {
    const response = await serverApiClient.get<{
      success: boolean;
      questions: Question[];
    }>(CONFIG.ENDPOINTS.QUESTIONS.LIST, {
      cache: "force-cache",
      revalidate: CONFIG.CACHE.REVALIDATE_TIME,
      tags: ["questions"],
    });
    return response.questions || [];
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    return [];
  }
}

export default async function QuestionsPage() {
  const questions = await getQuestions();

  return (
    <div className="space-y-6 flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Question Bank</h2>
          <p className="text-muted-foreground">
            Manage all questions for your quizzes
          </p>
        </div>
        <Link href="/dashboard/questions/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </Link>
      </div>

      <QuestionsTable questions={questions} />
    </div>
  );
}
