import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { QuizzesContent } from "@/components/quizzes/quizzes-content"

export default function QuizzesPage() {
  return (
    <DashboardShell title="Quizzes" description="Create, manage, and organize your quiz collection">
      <QuizzesContent />
    </DashboardShell>
  )
}
