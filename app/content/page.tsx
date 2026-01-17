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

// Sample data for questions
const questions = [
  {
    id: 1,
    text: "What is the capital of France?",
    type: "Multiple Choice",
    subject: "Geography",
    difficulty: "Easy",
    usedIn: 3,
  },
  {
    id: 2,
    text: "Solve: 2x + 5 = 15",
    type: "Short Answer",
    subject: "Mathematics",
    difficulty: "Medium",
    usedIn: 5,
  },
  {
    id: 3,
    text: "What is Newton's First Law?",
    type: "Multiple Choice",
    subject: "Physics",
    difficulty: "Easy",
    usedIn: 8,
  },
  {
    id: 4,
    text: "Explain photosynthesis",
    type: "Long Answer",
    subject: "Biology",
    difficulty: "Hard",
    usedIn: 2,
  },
  {
    id: 5,
    text: "Who wrote Romeo and Juliet?",
    type: "Multiple Choice",
    subject: "Literature",
    difficulty: "Easy",
    usedIn: 4,
  },
  {
    id: 6,
    text: "Calculate the derivative of x²",
    type: "Short Answer",
    subject: "Mathematics",
    difficulty: "Medium",
    usedIn: 6,
  },
];

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

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "Easy":
      return "bg-emerald-500/10 text-emerald-400";
    case "Medium":
      return "bg-amber-500/10 text-amber-400";
    case "Hard":
      return "bg-red-500/10 text-red-400";
    default:
      return "bg-[#1F1F1F] text-[#919191]";
  }
}

function ActionMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 hover:bg-[#2A2A2A] rounded transition-colors">
          <MoreHorizontal className="h-4 w-4 text-[#919191]" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-[#1F1F1F] border-[#2A2A2A]"
      >
        <DropdownMenuItem className="text-[#E7E7E7] focus:bg-[#2A2A2A] focus:text-white cursor-pointer">
          <Edit className="h-4 w-4 mr-2" /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem className="text-[#E7E7E7] focus:bg-[#2A2A2A] focus:text-white cursor-pointer">
          <Copy className="h-4 w-4 mr-2" /> Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-400 focus:bg-[#2A2A2A] focus:text-red-400 cursor-pointer">
          <Trash2 className="h-4 w-4 mr-2" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function ContentPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Content Management</h1>
      </div>

      <Tabs defaultValue="questions" className="space-y-6">
        <TabsList className="bg-[#1F1F1F] border border-[#2A2A2A] p-1">
          <TabsTrigger
            value="questions"
            className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-[#919191]"
          >
            <FileQuestion className="h-4 w-4 mr-2" />
            Questions
          </TabsTrigger>
          <TabsTrigger
            value="quizzes"
            className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-[#919191]"
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Quizzes
          </TabsTrigger>
          <TabsTrigger
            value="levels"
            className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-[#919191]"
          >
            <Layers className="h-4 w-4 mr-2" />
            Levels
          </TabsTrigger>
        </TabsList>

        {/* Questions Tab */}
        <TabsContent value="questions" className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-[#919191]">
              Manage individual questions that can be used across quizzes
            </p>
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-sm font-medium transition-colors">
              <Plus className="h-4 w-4" /> Add Question
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-lg">
                  <FileQuestion className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-[#919191]">Total Questions</p>
                  <p className="text-2xl font-bold text-white">1,247</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <HelpCircle className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-[#919191]">Multiple Choice</p>
                  <p className="text-2xl font-bold text-white">856</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <Edit className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-[#919191]">Short/Long Answer</p>
                  <p className="text-2xl font-bold text-white">391</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
            <CardHeader>
              <CardTitle className="text-white">All Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#1F1F1F]">
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#919191]">
                        Question
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#919191]">
                        Type
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#919191]">
                        Subject
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#919191]">
                        Difficulty
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#919191]">
                        Used In
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#919191]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((q) => (
                      <tr
                        key={q.id}
                        className="border-b border-[#1F1F1F] hover:bg-[#1F1F1F]/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm text-white font-medium max-w-xs truncate">
                          {q.text}
                        </td>
                        <td className="py-3 px-4 text-sm text-[#919191]">
                          {q.type}
                        </td>
                        <td className="py-3 px-4 text-sm text-[#919191]">
                          {q.subject}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-xs px-2 py-1 rounded ${getDifficultyColor(
                              q.difficulty
                            )}`}
                          >
                            {q.difficulty}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-white">
                          {q.usedIn} quizzes
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

        {/* Quizzes Tab */}
        <TabsContent value="quizzes" className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-[#919191]">
              Manage quizzes - collections of questions that can be standalone
              or part of a level
            </p>
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-sm font-medium transition-colors">
              <Plus className="h-4 w-4" /> Create Quiz
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-lg">
                  <HelpCircle className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-[#919191]">Total Quizzes</p>
                  <p className="text-2xl font-bold text-white">156</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Layers className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-[#919191]">In Levels</p>
                  <p className="text-2xl font-bold text-white">98</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 rounded-lg">
                  <HelpCircle className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-[#919191]">Standalone</p>
                  <p className="text-2xl font-bold text-white">58</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
            <CardHeader>
              <CardTitle className="text-white">All Quizzes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#1F1F1F]">
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#919191]">
                        Quiz Name
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#919191]">
                        Subject
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#919191]">
                        Questions
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#919191]">
                        Attempts
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#919191]">
                        Avg Score
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#919191]">
                        Level
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#919191]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizzes.map((quiz) => (
                      <tr
                        key={quiz.id}
                        className="border-b border-[#1F1F1F] hover:bg-[#1F1F1F]/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm text-white font-medium">
                          {quiz.name}
                        </td>
                        <td className="py-3 px-4 text-sm text-[#919191]">
                          {quiz.subject}
                        </td>
                        <td className="py-3 px-4 text-sm text-white">
                          {quiz.questions}
                        </td>
                        <td className="py-3 px-4 text-sm text-white">
                          {quiz.attempts.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-sm font-medium ${
                              quiz.avgScore >= 80
                                ? "text-emerald-400"
                                : quiz.avgScore >= 70
                                ? "text-amber-400"
                                : "text-red-400"
                            }`}
                          >
                            {quiz.avgScore}%
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {quiz.inLevel ? (
                            <span className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400">
                              {quiz.levelName}
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-1 rounded bg-[#1F1F1F] text-[#919191]">
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
            <p className="text-[#919191]">
              Manage levels - structured learning paths containing multiple
              quizzes
            </p>
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-sm font-medium transition-colors">
              <Plus className="h-4 w-4" /> Create Level
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-lg">
                  <Layers className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-[#919191]">Total Levels</p>
                  <p className="text-2xl font-bold text-white">24</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <HelpCircle className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-[#919191]">Total Quizzes</p>
                  <p className="text-2xl font-bold text-white">98</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <FileQuestion className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-[#919191]">Total Questions</p>
                  <p className="text-2xl font-bold text-white">1,450</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
            <CardHeader>
              <CardTitle className="text-white">All Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#1F1F1F]">
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#919191]">
                        Level Name
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#919191]">
                        Quizzes
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#919191]">
                        Questions
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#919191]">
                        Students
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#919191]">
                        Completion Rate
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#919191]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {levels.map((level) => (
                      <tr
                        key={level.id}
                        className="border-b border-[#1F1F1F] hover:bg-[#1F1F1F]/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm text-white font-medium">
                          {level.name}
                        </td>
                        <td className="py-3 px-4 text-sm text-white">
                          {level.quizzes}
                        </td>
                        <td className="py-3 px-4 text-sm text-white">
                          {level.totalQuestions}
                        </td>
                        <td className="py-3 px-4 text-sm text-white">
                          {level.students.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-[#1F1F1F] rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  level.completionRate >= 70
                                    ? "bg-emerald-500"
                                    : level.completionRate >= 50
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                                }`}
                                style={{ width: `${level.completionRate}%` }}
                              />
                            </div>
                            <span className="text-sm text-white">
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
