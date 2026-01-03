import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { StudentsContent } from "@/components/students/students-content"
import { Button } from "@/components/ui/button"
import { Download, UserPlus } from "lucide-react"

export default function StudentsPage() {
  return (
    <DashboardShell
      title="Students"
      description="View and manage student accounts and progress"
      actions={
        <>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </>
      }
    >
      <StudentsContent />
    </DashboardShell>
  )
}
