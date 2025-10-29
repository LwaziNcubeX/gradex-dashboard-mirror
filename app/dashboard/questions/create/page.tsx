import { QuestionForm } from "@/components/question-form";

export default function CreateQuestionPage() {
  return (
    <div className="max-w-3xl space-y-6 flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Create Question</h2>
        <p className="text-muted-foreground">
          Add a new question to your question bank
        </p>
      </div>

      <QuestionForm />
    </div>
  );
}
