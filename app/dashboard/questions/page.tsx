import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { QuestionsTable } from "@/components/questions-table"
import { serverApiClient } from "@/lib/server-api-client"

export interface Question {
  question_id: string
  subject: string
  topic: string
  subtopics: string[]
  question_text: string
  answers: string[]
  correct_answer: string
  hint: string
  level: "Form 1" | "Form 2" | "Form 3" | "Form 4"
  created_at: string
}

async function getQuestions() {
  try {
    const response = await serverApiClient.get<{ success: boolean; questions: Question[] }>("/questions")
    return response.questions || []
  } catch (error) {
    return []
  }
}

export default async function QuestionsPage() {
  const questions = await getQuestions()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Question Bank</h2>
          <p className="text-muted-foreground">Manage all questions for your quizzes</p>
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
  )
}
