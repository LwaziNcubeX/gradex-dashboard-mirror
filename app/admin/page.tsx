"use client";

import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, HelpCircle, Users, BarChart3 } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();

  const stats = [
    {
      title: "Total Quizzes",
      value: "0",
      description: "Active quizzes",
      icon: BookOpen,
      href: "/admin/quizzes",
      color: "bg-blue-50",
    },
    {
      title: "Total Questions",
      value: "0",
      description: "In question bank",
      icon: HelpCircle,
      href: "/admin/questions",
      color: "bg-green-50",
    },
    {
      title: "Total Users",
      value: "0",
      description: "Registered students",
      icon: Users,
      href: "/admin/users",
      color: "bg-purple-50",
    },
    {
      title: "Average Score",
      value: "0%",
      description: "All students",
      icon: BarChart3,
      href: "/admin/analytics",
      color: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome, {user?.first_name}! 👋
        </h1>
        <p className="mt-2 text-slate-600">
          Here's what's happening with GradeX today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.href} href={stat.href}>
              <Card className="cursor-pointer transition-all hover:shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className={`rounded-lg p-2 ${stat.color}`}>
                    <Icon className="h-4 w-4 text-slate-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-slate-600">{stat.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Content Management</CardTitle>
            <CardDescription>Manage quizzes and questions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link href="/admin/quizzes">
                <BookOpen className="mr-2 h-4 w-4" />
                Manage Quizzes
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/questions">
                <HelpCircle className="mr-2 h-4 w-4" />
                Manage Questions
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analytics & Users</CardTitle>
            <CardDescription>View reports and user data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link href="/admin/users">
                <Users className="mr-2 h-4 w-4" />
                View Users
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/analytics">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">Getting Started</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800">
          <ul className="space-y-2">
            <li>
              ✓ You're logged in as <strong>{user?.role}</strong>
            </li>
            <li>
              ✓ Your XP: <strong>{user?.total_xp}</strong>
            </li>
            <li>
              ✓ Current Level: <strong>{user?.current_level}</strong>
            </li>
            <li>
              ✓ Quizzes Completed: <strong>{user?.quizzes_completed}</strong>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
