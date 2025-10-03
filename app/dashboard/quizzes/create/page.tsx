import { QuizForm } from "@/components/quiz-form"

export default function CreateQuizPage() {
  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Create Quiz</h2>
        <p className="text-muted-foreground">Build a new quiz by selecting questions from your question bank</p>
      </div>

      <QuizForm />
    </div>
  )
}
