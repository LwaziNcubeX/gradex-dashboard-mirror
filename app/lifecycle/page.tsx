import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LifecyclePage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Lifecycle</h1>
                <p className="text-muted-foreground mt-2">Track project and product lifecycle stages</p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Planning</CardTitle>
                    <CardDescription>In planning phase</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">3</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>In Development</CardTitle>
                    <CardDescription>Active development</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">5</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Released</CardTitle>
                    <CardDescription>Live in production</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">8</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Lifecycle Timeline</CardTitle>
                  <CardDescription>Project phases and milestones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { phase: "Discovery & Research", status: "Completed", progress: 100 },
                      { phase: "Design & Prototyping", status: "Completed", progress: 100 },
                      { phase: "Development", status: "In Progress", progress: 65 },
                      { phase: "Testing & QA", status: "Pending", progress: 0 },
                      { phase: "Launch", status: "Pending", progress: 0 },
                    ].map((item) => (
                      <div key={item.phase} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{item.phase}</p>
                          <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">{item.status}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
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
  )
}
