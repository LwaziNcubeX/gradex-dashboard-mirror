import { LevelForm } from "@/components/level-form";

export default function CreateLevelPage() {
  return (
    <div className="max-w-5xl space-y-6 flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Create Level</h2>
        <p className="text-muted-foreground">
          Build a new gamified level by selecting quizzes
        </p>
      </div>

      <LevelForm />
    </div>
  );
}
