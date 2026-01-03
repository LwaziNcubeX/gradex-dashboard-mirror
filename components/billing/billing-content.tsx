"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CreditCard, Check, Zap, Users, HardDrive, Download } from "lucide-react"

const currentPlan = {
  name: "Professional",
  price: "$49",
  period: "month",
  features: ["Unlimited quizzes", "Up to 500 students", "Advanced analytics", "Priority support", "Custom branding"],
}

const usage = [
  { label: "Students", current: 287, limit: 500, icon: Users },
  { label: "Storage", current: 4.2, limit: 10, unit: "GB", icon: HardDrive },
  { label: "API Calls", current: 45000, limit: 100000, icon: Zap },
]

const invoices = [
  { id: "INV-001", date: "Dec 1, 2024", amount: "$49.00", status: "paid" },
  { id: "INV-002", date: "Nov 1, 2024", amount: "$49.00", status: "paid" },
  { id: "INV-003", date: "Oct 1, 2024", amount: "$49.00", status: "paid" },
]

export function BillingContent() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Current Plan */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Current Plan</CardTitle>
                <CardDescription>Your subscription details</CardDescription>
              </div>
              <Badge className="text-sm">{currentPlan.name}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">{currentPlan.price}</span>
              <span className="text-muted-foreground">/{currentPlan.period}</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {currentPlan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button>Upgrade Plan</Button>
              <Button variant="outline">Manage Subscription</Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Payment Method</CardTitle>
            <CardDescription>Your default payment method</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/2025</p>
              </div>
            </div>
            <Button variant="outline" className="w-full bg-transparent">
              Update Payment Method
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Usage This Month</CardTitle>
          <CardDescription>Your current resource consumption</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-3">
            {usage.map((item) => (
              <div key={item.label} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {item.current}
                    {item.unit && ` ${item.unit}`} / {item.limit}
                    {item.unit && ` ${item.unit}`}
                  </span>
                </div>
                <Progress value={(item.current / item.limit) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Billing History</CardTitle>
          <CardDescription>Your recent invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium">{invoice.id}</p>
                    <p className="text-sm text-muted-foreground">{invoice.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium">{invoice.amount}</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {invoice.status}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
