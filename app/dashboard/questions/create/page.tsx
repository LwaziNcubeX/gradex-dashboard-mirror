import { QuestionForm } from "@/components/question-form"

export default function CreateQuestionPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Create Question</h2>
        <p className="text-muted-foreground">Add a new question to your question bank</p>
      </div>

      <QuestionForm />
    </div>
  )
}
