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

export default function AnalyticsPage() {
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
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground mt-2">
                  Track and analyze your key metrics
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Views</CardTitle>
                    <CardDescription>Page views</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">28,400</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      +12% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Engagement</CardTitle>
                    <CardDescription>User interactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">8,234</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      +5% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Conversion</CardTitle>
                    <CardDescription>Success rate</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">4.2%</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      -0.5% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Bounce Rate</CardTitle>
                    <CardDescription>Exit percentage</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">28.1%</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      +2.1% from last month
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Analytics Summary</CardTitle>
                  <CardDescription>
                    Overview of your analytics data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">Page Load Time</span>
                      <span className="text-muted-foreground">1.2s avg</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">
                        Average Session Duration
                      </span>
                      <span className="text-muted-foreground">3m 45s</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">Peak Traffic Hour</span>
                      <span className="text-muted-foreground">
                        2:00 PM - 3:00 PM
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">Top Device</span>
                      <span className="text-muted-foreground">
                        Desktop (68%)
                      </span>
                    </div>
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
