import { QuizForm } from "@/components/quiz-form";

export default function CreateQuizPage() {
  return (
    <div className="max-w-5xl space-y-6 flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Create Quiz</h2>
        <p className="text-muted-foreground">
          Build a new quiz by selecting questions from your question bank
        </p>
      </div>

      <QuizForm />
    </div>
  );
}
