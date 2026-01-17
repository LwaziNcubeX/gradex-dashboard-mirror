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
import { User, Bell, Shield, Palette, Database, Globe } from "lucide-react";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-foreground">
                    Profile Settings
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Manage your admin account details
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">
                    First Name
                  </Label>
                  <Input
                    type="text"
                    defaultValue="Admin"
                    className="bg-secondary border-border"
                  />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">
                    Last Name
                  </Label>
                  <Input
                    type="text"
                    defaultValue="User"
                    className="bg-secondary border-border"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">
                  Email
                </Label>
                <Input
                  type="email"
                  defaultValue="admin@gradex.com"
                  className="bg-secondary border-border"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-chart-2/10 rounded-lg">
                  <Bell className="h-5 w-5 text-chart-2" />
                </div>
                <div>
                  <CardTitle className="text-foreground">
                    Notifications
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Configure alert preferences
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div>
                  <p className="text-foreground text-sm font-medium">
                    Email Notifications
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Receive updates via email
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div>
                  <p className="text-foreground text-sm font-medium">
                    New Student Alerts
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Get notified when students sign up
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div>
                  <p className="text-foreground text-sm font-medium">
                    Bug Report Alerts
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Immediate notification for bug reports
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-chart-4/10 rounded-lg">
                  <Shield className="h-5 w-5 text-chart-4" />
                </div>
                <div>
                  <CardTitle className="text-foreground">Security</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Manage security settings
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">
                  Current Password
                </Label>
                <Input
                  type="password"
                  placeholder="Enter current password"
                  className="bg-secondary border-border"
                />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">
                  New Password
                </Label>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  className="bg-secondary border-border"
                />
              </div>
              <Button>Update Password</Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-chart-3/10 rounded-lg">
                  <Palette className="h-5 w-5 text-chart-3" />
                </div>
                <CardTitle className="text-foreground">Appearance</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full p-3 bg-secondary border-2 border-primary rounded-lg text-left">
                <p className="text-foreground text-sm font-medium">Dark Mode</p>
                <p className="text-xs text-muted-foreground">
                  Currently active
                </p>
              </button>
              <button className="w-full p-3 bg-secondary border border-border rounded-lg text-left hover:border-muted-foreground transition-colors">
                <p className="text-foreground text-sm font-medium">
                  Light Mode
                </p>
                <p className="text-xs text-muted-foreground">
                  Switch to light theme
                </p>
              </button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-chart-5/10 rounded-lg">
                  <Globe className="h-5 w-5 text-chart-5" />
                </div>
                <CardTitle className="text-foreground">Language</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Select defaultValue="en-us">
                <SelectTrigger className="bg-secondary border-border">
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

          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <Database className="h-5 w-5 text-destructive" />
                </div>
                <CardTitle className="text-foreground">Data</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="secondary" className="w-full">
                Export All Data
              </Button>
              <Button variant="destructive" className="w-full">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
