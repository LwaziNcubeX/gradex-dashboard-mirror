import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      defaultOpen={false}
    >
      <AppSidebar variant="sidebar" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
                <p className="text-muted-foreground mt-2">
                  View and manage your reports
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Reports</CardTitle>
                    <CardDescription>All reports</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">42</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>This Month</CardTitle>
                    <CardDescription>Reports generated</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">12</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Pending</CardTitle>
                    <CardDescription>Awaiting review</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">5</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Reports</CardTitle>
                  <CardDescription>Your latest reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Q4 Sales Report",
                        date: "Dec 15, 2024",
                        status: "Completed",
                      },
                      {
                        title: "Monthly Performance",
                        date: "Dec 10, 2024",
                        status: "Completed",
                      },
                      {
                        title: "Year End Summary",
                        date: "Dec 8, 2024",
                        status: "In Progress",
                      },
                      {
                        title: "Regional Analysis",
                        date: "Dec 5, 2024",
                        status: "Completed",
                      },
                    ].map((report) => (
                      <div
                        key={report.title}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{report.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {report.date}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            report.status === "Completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {report.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
