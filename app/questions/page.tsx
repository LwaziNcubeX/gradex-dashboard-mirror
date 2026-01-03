import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { QuestionsContent } from "@/components/questions/questions-content"

export default function QuestionsPage() {
  return (
    <DashboardShell title="Questions" description="Create, manage, and organize your question bank">
      <QuestionsContent />
    </DashboardShell>
  )
}
