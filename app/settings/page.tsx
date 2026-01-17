import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { User, Bell, Shield, Palette, Database, Globe } from "lucide-react"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <User className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Profile Settings</CardTitle>
                  <CardDescription className="text-[#919191]">Manage your admin account details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#919191] mb-2 block">First Name</label>
                  <input
                    type="text"
                    defaultValue="Admin"
                    className="w-full bg-[#1F1F1F] border border-[#2A2A2A] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#919191] mb-2 block">Last Name</label>
                  <input
                    type="text"
                    defaultValue="User"
                    className="w-full bg-[#1F1F1F] border border-[#2A2A2A] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-[#919191] mb-2 block">Email</label>
                <input
                  type="email"
                  defaultValue="admin@gradex.com"
                  className="w-full bg-[#1F1F1F] border border-[#2A2A2A] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Bell className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Notifications</CardTitle>
                  <CardDescription className="text-[#919191]">Configure alert preferences</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[#1F1F1F]/50 rounded-lg">
                <div>
                  <p className="text-white text-sm font-medium">Email Notifications</p>
                  <p className="text-xs text-[#919191]">Receive updates via email</p>
                </div>
                <button className="w-12 h-6 bg-emerald-500 rounded-full relative">
                  <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#1F1F1F]/50 rounded-lg">
                <div>
                  <p className="text-white text-sm font-medium">New Student Alerts</p>
                  <p className="text-xs text-[#919191]">Get notified when students sign up</p>
                </div>
                <button className="w-12 h-6 bg-emerald-500 rounded-full relative">
                  <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#1F1F1F]/50 rounded-lg">
                <div>
                  <p className="text-white text-sm font-medium">Bug Report Alerts</p>
                  <p className="text-xs text-[#919191]">Immediate notification for bug reports</p>
                </div>
                <button className="w-12 h-6 bg-[#2A2A2A] rounded-full relative">
                  <span className="absolute left-1 top-1 w-4 h-4 bg-[#919191] rounded-full" />
                </button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Shield className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Security</CardTitle>
                  <CardDescription className="text-[#919191]">Manage security settings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-[#919191] mb-2 block">Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  className="w-full bg-[#1F1F1F] border border-[#2A2A2A] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-sm text-[#919191] mb-2 block">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full bg-[#1F1F1F] border border-[#2A2A2A] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-sm font-medium transition-colors">
                Update Password
              </button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <Palette className="h-5 w-5 text-amber-400" />
                </div>
                <CardTitle className="text-white">Appearance</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full p-3 bg-[#1F1F1F] border-2 border-emerald-500 rounded-lg text-left">
                <p className="text-white text-sm font-medium">Dark Mode</p>
                <p className="text-xs text-[#919191]">Currently active</p>
              </button>
              <button className="w-full p-3 bg-[#1F1F1F] border border-[#2A2A2A] rounded-lg text-left hover:border-[#3A3A3A] transition-colors">
                <p className="text-white text-sm font-medium">Light Mode</p>
                <p className="text-xs text-[#919191]">Switch to light theme</p>
              </button>
            </CardContent>
          </Card>

          <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 rounded-lg">
                  <Globe className="h-5 w-5 text-cyan-400" />
                </div>
                <CardTitle className="text-white">Language</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <select className="w-full bg-[#1F1F1F] border border-[#2A2A2A] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500">
                <option>English (US)</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </CardContent>
          </Card>

          <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <Database className="h-5 w-5 text-red-400" />
                </div>
                <CardTitle className="text-white">Data</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full px-4 py-2 bg-[#1F1F1F] hover:bg-[#2A2A2A] rounded-lg text-sm font-medium transition-colors text-white">
                Export All Data
              </button>
              <button className="w-full px-4 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-sm font-medium transition-colors text-red-400">
                Delete Account
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
