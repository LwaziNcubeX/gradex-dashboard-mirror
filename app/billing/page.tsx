import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { BillingContent } from "@/components/billing/billing-content"

export default function BillingPage() {
  return (
    <DashboardShell title="Billing" description="Manage your subscription and billing information">
      <BillingContent />
    </DashboardShell>
  )
}
