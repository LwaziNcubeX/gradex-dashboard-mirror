import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { QuizzesTable } from "@/components/quizzes-table"
import { serverApiClient } from "@/lib/server-api-client"

export interface Quiz {
  quiz_id: string
  title: string
  description: string
  subject: string
  level: string
  questions: string[]
  created_at: string
}

async function getQuizzes() {
  try {
    const response = await serverApiClient.get<{ success: boolean; quizzes: Quiz[] }>("/quizzes")
    return response.quizzes || []
  } catch (error) {
    return []
  }
}

export default async function QuizzesPage() {
  const quizzes = await getQuizzes()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quizzes</h2>
          <p className="text-muted-foreground">Manage all quizzes for your students</p>
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
  )
}
