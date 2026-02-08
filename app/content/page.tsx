"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  HelpCircle,
  FileQuestion,
  Layers,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cookies } from "@/lib/cookie-manager";
import Questions from "@/components/content/questions";

// Sample data for quizzes
const quizzes = [
  {
    id: 1,
    name: "Algebra Basics",
    questions: 20,
    subject: "Mathematics",
    attempts: 1234,
    avgScore: 78,
    inLevel: true,
    levelName: "Math Fundamentals",
  },
  {
    id: 2,
    name: "Newton's Laws",
    questions: 15,
    subject: "Physics",
    attempts: 892,
    avgScore: 72,
    inLevel: true,
    levelName: "Physics 101",
  },
  {
    id: 3,
    name: "World Capitals",
    questions: 25,
    subject: "Geography",
    attempts: 756,
    avgScore: 81,
    inLevel: false,
    levelName: null,
  },
  {
    id: 4,
    name: "Cell Biology",
    questions: 18,
    subject: "Biology",
    attempts: 1089,
    avgScore: 85,
    inLevel: true,
    levelName: "Life Sciences",
  },
  {
    id: 5,
    name: "Shakespeare Intro",
    questions: 12,
    subject: "Literature",
    attempts: 423,
    avgScore: 88,
    inLevel: false,
    levelName: null,
  },
  {
    id: 6,
    name: "Quick Math",
    questions: 10,
    subject: "Mathematics",
    attempts: 2341,
    avgScore: 92,
    inLevel: false,
    levelName: null,
  },
];

// Sample data for levels
const levels = [
  {
    id: 1,
    name: "Math Fundamentals",
    quizzes: 5,
    totalQuestions: 75,
    students: 456,
    completionRate: 68,
  },
  {
    id: 2,
    name: "Physics 101",
    quizzes: 4,
    totalQuestions: 60,
    students: 312,
    completionRate: 54,
  },
  {
    id: 3,
    name: "Life Sciences",
    quizzes: 6,
    totalQuestions: 90,
    students: 523,
    completionRate: 72,
  },
  {
    id: 4,
    name: "History Journey",
    quizzes: 8,
    totalQuestions: 120,
    students: 289,
    completionRate: 45,
  },
  {
    id: 5,
    name: "English Mastery",
    quizzes: 7,
    totalQuestions: 105,
    students: 634,
    completionRate: 61,
  },
];

function ActionMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 hover:bg-accent rounded transition-colors">
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-secondary border-border">
        <DropdownMenuItem className="text-foreground focus:bg-accent focus:text-foreground cursor-pointer">
          <Edit className="h-4 w-4 mr-2" /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem className="text-foreground focus:bg-accent focus:text-foreground cursor-pointer">
          <Copy className="h-4 w-4 mr-2" /> Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive focus:bg-accent focus:text-destructive cursor-pointer">
          <Trash2 className="h-4 w-4 mr-2" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function ContentPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between pl-2">
        <h1 className="text-4xl font-bold font-oswald">Content Management</h1>
      </div>

      <Tabs defaultValue="questions" className="space-y-6">
        <TabsList className="bg-background border border-border p-1">
          <TabsTrigger
            value="questions"
            className="data-[state=active]:bg-secondary data-[state=active]:text-white text-muted-foreground"
          >
            Questions
          </TabsTrigger>
          <TabsTrigger
            value="quizzes"
            className="data-[state=active]:bg-secondary data-[state=active]:text-primary text-muted-foreground"
          >
            Quizzes
          </TabsTrigger>
          <TabsTrigger
            value="levels"
            className="data-[state=active]:bg-secondary data-[state=active]:text-primary text-muted-foreground"
          >
            Levels
          </TabsTrigger>
        </TabsList>

        {/* Questions Tab */}
        <TabsContent value="questions">
          <Questions />
        </TabsContent>

        {/* Quizzes Tab */}
        <TabsContent value="quizzes" className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              Manage quizzes - collections of questions that can be standalone
              or part of a level
            </p>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-colors">
              <Plus className="h-4 w-4" /> Create Quiz
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <HelpCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Quizzes</p>
                  <p className="text-2xl font-bold text-foreground">156</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-chart-2/10 rounded-lg">
                  <Layers className="h-6 w-6 text-chart-2" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">In Levels</p>
                  <p className="text-2xl font-bold text-foreground">98</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-chart-3/10 rounded-lg">
                  <HelpCircle className="h-6 w-6 text-chart-3" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Standalone</p>
                  <p className="text-2xl font-bold text-foreground">58</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">All Quizzes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Quiz Name
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Subject
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Questions
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Attempts
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Avg Score
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Level
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizzes.map((quiz) => (
                      <tr
                        key={quiz.id}
                        className="border-b border-border hover:bg-secondary/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm text-foreground font-medium">
                          {quiz.name}
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {quiz.subject}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground">
                          {quiz.questions}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground">
                          {quiz.attempts.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-sm font-medium ${
                              quiz.avgScore >= 80
                                ? "text-chart-1"
                                : quiz.avgScore >= 70
                                ? "text-chart-3"
                                : "text-destructive"
                            }`}
                          >
                            {quiz.avgScore}%
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {quiz.inLevel ? (
                            <span className="text-xs px-2 py-1 rounded bg-chart-2/10 text-chart-2">
                              {quiz.levelName}
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-1 rounded bg-secondary text-muted-foreground">
                              Standalone
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <ActionMenu />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Levels Tab */}
        <TabsContent value="levels" className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              Manage levels - structured learning paths containing multiple
              quizzes
            </p>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-colors">
              <Plus className="h-4 w-4" /> Create Level
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Layers className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Levels</p>
                  <p className="text-2xl font-bold text-foreground">24</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-chart-2/10 rounded-lg">
                  <HelpCircle className="h-6 w-6 text-chart-2" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Quizzes</p>
                  <p className="text-2xl font-bold text-foreground">98</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-chart-5/10 rounded-lg">
                  <FileQuestion className="h-6 w-6 text-chart-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Questions
                  </p>
                  <p className="text-2xl font-bold text-foreground">1,450</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">All Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Level Name
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Quizzes
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Questions
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Students
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Completion Rate
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {levels.map((level) => (
                      <tr
                        key={level.id}
                        className="border-b border-border hover:bg-secondary/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm text-foreground font-medium">
                          {level.name}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground">
                          {level.quizzes}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground">
                          {level.totalQuestions}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground">
                          {level.students.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  level.completionRate >= 70
                                    ? "bg-chart-1"
                                    : level.completionRate >= 50
                                    ? "bg-chart-3"
                                    : "bg-destructive"
                                }`}
                                style={{ width: `${level.completionRate}%` }}
                              />
                            </div>
                            <span className="text-sm text-foreground">
                              {level.completionRate}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <ActionMenu />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
