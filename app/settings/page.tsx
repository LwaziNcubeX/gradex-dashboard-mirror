"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Shield,
  Palette,
  Database,
  Globe,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { ProfileSettingsCard } from "@/components/settings/profile-settings";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <ProfileSettingsCard />

          {/* Notifications */}
          <Card className="rounded-xl">
            <CardHeader className="px-4 pt-4 pb-2">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-chart-2/10">
                  <Bell className="h-4 w-4 text-chart-2" />
                </div>
                <div>
                  <CardTitle className="text-sm font-medium text-foreground">
                    Notifications
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Configure alert preferences
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 flex flex-col gap-2">
              <div className="flex items-center justify-between p-2.5 bg-secondary/50 rounded-lg">
                <div>
                  <p className="text-foreground text-sm font-medium">
                    Email Notifications
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Receive updates via email
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-2.5 bg-secondary/50 rounded-lg">
                <div>
                  <p className="text-foreground text-sm font-medium">
                    New Student Alerts
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Get notified when students sign up
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-2.5 bg-secondary/50 rounded-lg">
                <div>
                  <p className="text-foreground text-sm font-medium">
                    Bug Report Alerts
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Immediate notification for bug reports
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="rounded-xl">
            <CardHeader className="px-4 pt-4 pb-2">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-chart-4/10">
                  <Shield className="h-4 w-4 text-chart-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-medium text-foreground">
                    Security
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Account security settings
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 flex flex-col gap-3">
              <div className="p-3 bg-chart-1/5 border border-chart-1/20 rounded-lg flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-chart-1 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    OTP Authentication Active
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    GradeX uses secure one-time passcodes sent to your email for
                    authentication. No password required.
                  </p>
                </div>
              </div>
              <div className="p-3 bg-secondary/50 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-foreground font-medium">
                      Two-Factor Auth
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Built-in via OTP login flow
                    </p>
                  </div>
                </div>
                <Badge className="bg-chart-1/10 text-chart-1 border-chart-1/20 text-[10px]">
                  Enabled
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          {/* Appearance */}
          <Card className="rounded-xl">
            <CardHeader className="px-4 pt-4 pb-2">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-chart-3/10">
                  <Palette className="h-4 w-4 text-chart-3" />
                </div>
                <CardTitle className="text-sm font-medium text-foreground">
                  Appearance
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 flex flex-col gap-2">
              <button className="w-full p-2.5 bg-secondary border-2 border-primary rounded-lg text-left">
                <p className="text-foreground text-sm font-medium">Dark Mode</p>
                <p className="text-[11px] text-muted-foreground">
                  Currently active
                </p>
              </button>
              <button className="w-full p-2.5 bg-secondary border border-border rounded-lg text-left hover:border-muted-foreground transition-colors">
                <p className="text-foreground text-sm font-medium">
                  Light Mode
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Switch to light theme
                </p>
              </button>
            </CardContent>
          </Card>

          {/* Language */}
          <Card className="rounded-xl">
            <CardHeader className="px-4 pt-4 pb-2">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-chart-5/10">
                  <Globe className="h-4 w-4 text-chart-5" />
                </div>
                <CardTitle className="text-sm font-medium text-foreground">
                  Language
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 flex flex-col gap-2">
              <div className="flex items-center justify-between p-2.5 bg-secondary/50 rounded-lg">
                <div>
                  <p className="text-foreground text-sm font-medium">
                    English (US)
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Current language
                  </p>
                </div>
                <Badge variant="secondary" className="text-[10px]">
                  Active
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground px-0.5">
                Platform is configured for English. Additional language support
                coming soon.
              </p>
            </CardContent>
          </Card>

          {/* Data */}
          <Card className="rounded-xl">
            <CardHeader className="px-4 pt-4 pb-2">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-destructive/10">
                  <Database className="h-4 w-4 text-destructive" />
                </div>
                <CardTitle className="text-sm font-medium text-foreground">
                  Data
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 flex flex-col gap-2">
              <Button variant="secondary" size="sm" className="w-full">
                Export All Data
              </Button>
              <Button variant="destructive" size="sm" className="w-full">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
