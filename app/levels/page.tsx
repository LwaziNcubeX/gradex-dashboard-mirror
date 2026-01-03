import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { LevelsContent } from "@/components/levels/levels-content"

export default function LevelsPage() {
  return (
    <DashboardShell title="Levels" description="Create and manage educational levels by O-Level Forms">
      <LevelsContent />
    </DashboardShell>
  )
}
