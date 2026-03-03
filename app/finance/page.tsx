"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  TrendingUp,
  Users,
  Crown,
  Calendar,
  Loader2,
  CreditCard,
} from "lucide-react";
import {
  studentService,
  type FinanceOverview,
  type PremiumTransaction,
} from "@/lib/api/students";
import { toast } from "sonner";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function MetricCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  loading,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
  color: string;
  loading?: boolean;
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
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`p-2 rounded-lg ${c.bg}`}>
          <Icon className={`h-5 w-5 ${c.text}`} />
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground">{label}</p>
          {loading ? (
            <div className="h-6 w-16 bg-secondary rounded animate-pulse mt-0.5" />
          ) : (
            <>
              <p className="text-xl font-bold text-foreground leading-tight tabular-nums">
                {value}
              </p>
              {sub && (
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {sub}
                </p>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function FinancePage() {
  const [data, setData] = useState<FinanceOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    studentService
      .getFinanceOverview()
      .then((d) => setData(d))
      .catch(() => {
        // If endpoint not ready yet, show empty state
        setData({
          total_revenue: 0,
          monthly_revenue: 0,
          weekly_revenue: 0,
          total_premium_users: 0,
          active_premium_users: 0,
          expired_premium_users: 0,
          recent_transactions: [],
          monthly_chart: [],
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (amount: number) =>
    `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard
            icon={DollarSign}
            label="Total Revenue"
            value={formatCurrency(data?.total_revenue ?? 0)}
            sub="All time"
            color="chart-1"
            loading={loading}
          />
          <MetricCard
            icon={TrendingUp}
            label="This Month"
            value={formatCurrency(data?.monthly_revenue ?? 0)}
            sub="Current month"
            color="primary"
            loading={loading}
          />
          <MetricCard
            icon={Crown}
            label="Active Premium"
            value={String(data?.active_premium_users ?? 0)}
            sub={`${data?.expired_premium_users ?? 0} expired`}
            color="chart-3"
            loading={loading}
          />
          <MetricCard
            icon={Users}
            label="Total Upgraded"
            value={String(data?.total_premium_users ?? 0)}
            sub="All time"
            color="chart-2"
            loading={loading}
          />
        </div>

        {/* Revenue Chart */}
        <Card className="rounded-xl">
          <CardHeader className="px-4 pt-4 pb-2">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-chart-1/10">
                <TrendingUp className="h-4 w-4 text-chart-1" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium text-foreground">
                  Monthly Revenue
                </CardTitle>
                <CardDescription className="text-[11px] text-muted-foreground">
                  Revenue from premium student upgrades
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {loading ? (
              <div className="h-[250px] flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : data?.monthly_chart && data.monthly_chart.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={data.monthly_chart}>
                  <defs>
                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--chart-1))"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--chart-1))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{
                      fontSize: 11,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{
                      fontSize: 11,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                      color: "hsl(var(--foreground))",
                    }}
                    labelStyle={{
                      color: "hsl(var(--foreground))",
                      fontWeight: 600,
                    }}
                    itemStyle={{ color: "hsl(var(--muted-foreground))" }}
                    formatter={(value: number, name: string) => [
                      name === "revenue"
                        ? formatCurrency(value)
                        : `${value} upgrades`,
                      name === "revenue" ? "Revenue" : "Upgrades",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex flex-col items-center justify-center gap-2">
                <TrendingUp className="h-8 w-8 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">
                  No revenue data yet
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Revenue will appear here after premium upgrades are processed.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="rounded-xl">
          <CardHeader className="px-4 pt-4 pb-2">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-secondary">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-sm font-medium text-foreground">
                Recent Transactions
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-10 bg-secondary rounded animate-pulse"
                  />
                ))}
              </div>
            ) : data?.recent_transactions &&
              data.recent_transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground font-medium text-xs">
                        Student
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs hidden sm:table-cell">
                        User ID
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs hidden md:table-cell">
                        Txn ID
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs text-right">
                        Amount
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs text-right hidden md:table-cell">
                        Days
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs hidden md:table-cell">
                        Activated
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs hidden lg:table-cell">
                        Expires
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.recent_transactions.map((tx, i) => (
                      <TableRow key={tx._id || i} className="border-border">
                        <TableCell className="py-2.5 text-sm font-medium text-foreground">
                          <div className="flex items-center gap-1.5">
                            <Crown className="h-3 w-3 text-chart-3 flex-shrink-0" />
                            {tx.student_name}
                          </div>
                        </TableCell>
                        <TableCell className="py-2.5 text-xs text-muted-foreground hidden sm:table-cell font-mono">
                          {tx.user_id}
                        </TableCell>
                        <TableCell className="py-2.5 text-xs text-muted-foreground hidden md:table-cell font-mono">
                          {tx.transaction_id || "—"}
                        </TableCell>
                        <TableCell className="py-2.5 text-right text-sm font-semibold text-chart-1 tabular-nums">
                          ${tx.amount.toFixed(2)}
                        </TableCell>
                        <TableCell className="py-2.5 text-right text-sm text-foreground tabular-nums hidden md:table-cell">
                          {tx.days}
                        </TableCell>
                        <TableCell className="py-2.5 text-xs text-muted-foreground hidden md:table-cell">
                          {tx.activated_at
                            ? new Date(tx.activated_at).toLocaleDateString()
                            : "—"}
                        </TableCell>
                        <TableCell className="py-2.5 text-xs text-muted-foreground hidden lg:table-cell">
                          {tx.expires_at
                            ? new Date(tx.expires_at).toLocaleDateString()
                            : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <CreditCard className="h-8 w-8 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">
                  No transactions yet
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Premium upgrade transactions will appear here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info banner */}
        <Card className="rounded-xl bg-secondary/30 border-border">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-chart-3/10 flex-shrink-0">
              <Crown className="h-5 w-5 text-chart-3" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Premium Pricing
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Each $2 payment grants a student 30 days of premium access.
                Admins can upgrade students from the student detail panel.
                Revenue is tracked automatically.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
