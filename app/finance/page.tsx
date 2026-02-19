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
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Star,
  Zap,
  Users,
  BarChart3,
  Shield,
  Bot,
  Check,
  Crown,
  Rocket,
} from "lucide-react";

const FREE_FEATURES = [
  "Up to 50 students",
  "5 subjects",
  "Basic analytics",
  "Arcade & Speed Run game modes",
  "Email support",
];

const PREMIUM_FEATURES = [
  "Unlimited students",
  "All subjects + custom subjects",
  "Advanced analytics & exports",
  "All game modes incl. Wild Card",
  "AI question generation",
  "Custom branding",
  "Priority support",
  "Bulk content import",
  "Student progress reports",
  "API access",
];

const MONTHLY_PRICE = 2;
const ANNUAL_PRICE = 20; // ~$1.67/month

function FeatureRow({ text, included }: { text: string; included?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <Check
        className={`h-3.5 w-3.5 flex-shrink-0 ${included ? "text-chart-1" : "text-muted-foreground"}`}
      />
      <span
        className={`text-sm ${included ? "text-foreground" : "text-muted-foreground"}`}
      >
        {text}
      </span>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: string;
}) {
  const colorMap: Record<string, { bg: string; text: string }> = {
    primary: { bg: "bg-primary/10", text: "text-primary" },
    "chart-1": { bg: "bg-chart-1/10", text: "text-chart-1" },
    "chart-2": { bg: "bg-chart-2/10", text: "text-chart-2" },
    "chart-3": { bg: "bg-chart-3/10", text: "text-chart-3" },
    "chart-4": { bg: "bg-chart-4/10", text: "text-chart-4" },
  };
  const c = colorMap[color] || colorMap.primary;
  return (
    <Card className="rounded-xl border-border/50 py-0">
      <CardContent className="p-3 flex items-center gap-2.5">
        <div className={`p-1.5 rounded-md ${c.bg}`}>
          <Icon className={`h-4 w-4 ${c.text}`} />
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground">{label}</p>
          <p className="text-lg font-bold text-foreground leading-tight">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function FinancePage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Finance &amp; Billing
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your subscription and unlock premium features for your GradeX
            platform.
          </p>
        </div>

        {/* Current plan banner */}
        <Card className="rounded-xl bg-secondary/30 border-border">
          <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Rocket className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    Free Plan
                  </p>
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0"
                  >
                    Current
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  $0 / month — Great for getting started
                </p>
              </div>
            </div>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Crown className="h-4 w-4 mr-1.5" /> Upgrade to Premium
            </Button>
          </CardContent>
        </Card>

        {/* Usage stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={Users} label="Students" value="—" color="primary" />
          <StatCard icon={Zap} label="XP Issued" value="—" color="chart-1" />
          <StatCard
            icon={BarChart3}
            label="Quiz Attempts"
            value="—"
            color="chart-2"
          />
          <StatCard
            icon={Star}
            label="Active Levels"
            value="—"
            color="chart-3"
          />
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Free */}
          <Card className="rounded-xl border-border">
            <CardHeader className="px-5 pt-5 pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-foreground">
                    Free
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mt-0.5">
                    Perfect for small classrooms
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-[10px]">
                  Current Plan
                </Badge>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-bold text-foreground">$0</span>
                <span className="text-sm text-muted-foreground ml-1">
                  / month
                </span>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5 flex flex-col gap-2.5">
              <div className="flex flex-col gap-2 py-3 border-y border-border">
                {FREE_FEATURES.map((f) => (
                  <FeatureRow key={f} text={f} included />
                ))}
              </div>
              <Button variant="secondary" size="sm" className="w-full" disabled>
                Current Plan
              </Button>
            </CardContent>
          </Card>

          {/* Premium */}
          <Card className="rounded-xl border-primary/40 relative overflow-hidden">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-primary/3 pointer-events-none" />
            <CardHeader className="px-5 pt-5 pb-3 relative">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-semibold text-foreground">
                      Premium
                    </CardTitle>
                    <Crown className="h-4 w-4 text-chart-3" />
                  </div>
                  <CardDescription className="text-xs text-muted-foreground mt-0.5">
                    For serious educators &amp; institutions
                  </CardDescription>
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                  Best Value
                </Badge>
              </div>
              <div className="mt-3 flex items-end gap-3">
                <div>
                  <span className="text-3xl font-bold text-foreground">
                    ${MONTHLY_PRICE}
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">
                    / month
                  </span>
                </div>
                <span className="text-xs text-muted-foreground mb-1">
                  or ${ANNUAL_PRICE}/year (save 17%)
                </span>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5 flex flex-col gap-2.5 relative">
              <div className="flex flex-col gap-2 py-3 border-y border-border">
                {PREMIUM_FEATURES.map((f) => (
                  <FeatureRow key={f} text={f} included />
                ))}
              </div>
              <Button
                size="sm"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <CreditCard className="h-4 w-4 mr-1.5" /> Upgrade for $
                {MONTHLY_PRICE}/month
              </Button>
              <p className="text-[11px] text-muted-foreground text-center">
                Cancel anytime. No hidden fees.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              icon: Bot,
              title: "AI Question Generation",
              desc: "Generate questions for any subject and form level instantly using AI.",
              color: "primary",
            },
            {
              icon: BarChart3,
              title: "Advanced Analytics",
              desc: "Deep insights into student performance, mastery levels, and learning gaps.",
              color: "chart-2",
            },
            {
              icon: Shield,
              title: "Priority Support",
              desc: "Get dedicated support with guaranteed response times for your institution.",
              color: "chart-4",
            },
          ].map(({ icon: Icon, title, desc, color }) => {
            const colorMap: Record<string, { bg: string; text: string }> = {
              primary: { bg: "bg-primary/10", text: "text-primary" },
              "chart-2": { bg: "bg-chart-2/10", text: "text-chart-2" },
              "chart-4": { bg: "bg-chart-4/10", text: "text-chart-4" },
            };
            const c = colorMap[color] || colorMap.primary;
            return (
              <Card key={title} className="rounded-xl border-border/50">
                <CardContent className="p-4">
                  <div className={`p-2 rounded-lg ${c.bg} w-fit mb-3`}>
                    <Icon className={`h-4 w-4 ${c.text}`} />
                  </div>
                  <p className="text-sm font-medium text-foreground">{title}</p>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                    {desc}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Billing history placeholder */}
        <Card className="rounded-xl">
          <CardHeader className="px-4 pt-4 pb-2">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-secondary">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-sm font-medium text-foreground">
                Billing History
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-6">
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <CreditCard className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                No billing history
              </p>
              <p className="text-[11px] text-muted-foreground">
                Invoices will appear here once you upgrade.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
