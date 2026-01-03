import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ReportsContent } from "@/components/reports/reports-content"
import { Button } from "@/components/ui/button"
import { Download, Plus } from "lucide-react"

export default function ReportsPage() {
  return (
    <DashboardShell
      title="Reports"
      description="View and generate performance reports"
      actions={
        <>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </>
      }
    >
      <ReportsContent />
    </DashboardShell>
  )
}
