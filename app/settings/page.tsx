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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, Shield, Palette, Database, Globe } from "lucide-react";
import { ProfileSettingsCard } from "@/components/settings/profile-settings";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold font-oswald tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account and preferences.</p>
      </div>

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
                  <CardTitle className="text-sm font-medium text-foreground">Notifications</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">Configure alert preferences</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 flex flex-col gap-2">
              <div className="flex items-center justify-between p-2.5 bg-secondary/50 rounded-lg">
                <div>
                  <p className="text-foreground text-sm font-medium">Email Notifications</p>
                  <p className="text-[11px] text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-2.5 bg-secondary/50 rounded-lg">
                <div>
                  <p className="text-foreground text-sm font-medium">New Student Alerts</p>
                  <p className="text-[11px] text-muted-foreground">Get notified when students sign up</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-2.5 bg-secondary/50 rounded-lg">
                <div>
                  <p className="text-foreground text-sm font-medium">Bug Report Alerts</p>
                  <p className="text-[11px] text-muted-foreground">Immediate notification for bug reports</p>
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
                  <CardTitle className="text-sm font-medium text-foreground">Security</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">Manage security settings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 flex flex-col gap-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Current Password</Label>
                <Input type="password" placeholder="Enter current password" className="bg-secondary border-border h-9 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">New Password</Label>
                <Input type="password" placeholder="Enter new password" className="bg-secondary border-border h-9 text-sm" />
              </div>
              <Button size="sm" className="w-fit">Update Password</Button>
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
                <CardTitle className="text-sm font-medium text-foreground">Appearance</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 flex flex-col gap-2">
              <button className="w-full p-2.5 bg-secondary border-2 border-primary rounded-lg text-left">
                <p className="text-foreground text-sm font-medium">Dark Mode</p>
                <p className="text-[11px] text-muted-foreground">Currently active</p>
              </button>
              <button className="w-full p-2.5 bg-secondary border border-border rounded-lg text-left hover:border-muted-foreground transition-colors">
                <p className="text-foreground text-sm font-medium">Light Mode</p>
                <p className="text-[11px] text-muted-foreground">Switch to light theme</p>
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
                <CardTitle className="text-sm font-medium text-foreground">Language</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <Select defaultValue="en-us">
                <SelectTrigger className="bg-secondary border-border h-9 text-sm">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-us">English (US)</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Data */}
          <Card className="rounded-xl">
            <CardHeader className="px-4 pt-4 pb-2">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-destructive/10">
                  <Database className="h-4 w-4 text-destructive" />
                </div>
                <CardTitle className="text-sm font-medium text-foreground">Data</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 flex flex-col gap-2">
              <Button variant="secondary" size="sm" className="w-full">Export All Data</Button>
              <Button variant="destructive" size="sm" className="w-full">Delete Account</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
