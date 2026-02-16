"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HelpCircle,
  FileQuestion,
  Layers,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Search,
} from "lucide-react";
import Questions from "@/components/content/questions";

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
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card border-border">
        <DropdownMenuItem className="cursor-pointer">
          <Edit className="h-3.5 w-3.5 mr-2" /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Copy className="h-3.5 w-3.5 mr-2" /> Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
          <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MetricCard({
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
    "chart-2": { bg: "bg-chart-2/10", text: "text-chart-2" },
    "chart-3": { bg: "bg-chart-3/10", text: "text-chart-3" },
    "chart-5": { bg: "bg-chart-5/10", text: "text-chart-5" },
  };
  const colors = colorMap[color] || colorMap.primary;

  return (
    <Card className="rounded-xl border-border/50 py-0">
      <CardContent className="p-3 flex items-center gap-2.5">
        <div className={`p-1.5 rounded-md ${colors.bg}`}>
          <Icon className={`h-4 w-4 ${colors.text}`} />
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

export default function ContentPage() {
  return (
    <DashboardLayout>
      <Tabs defaultValue="questions" className="flex flex-col gap-4">
        <TabsList className="bg-secondary font-medium">
          <TabsTrigger
            value="questions"
            className="text-xs [&[aria-selected='true']]:bg-primary/60"
          >
            Questions
          </TabsTrigger>
          <TabsTrigger
            value="quizzes"
            className="text-xs [&[aria-selected='true']]:bg-primary/60"
          >
            Quizzes
          </TabsTrigger>
          <TabsTrigger
            value="levels"
            className="text-xs [&[aria-selected='true']]:bg-primary/60"
          >
            Levels
          </TabsTrigger>
        </TabsList>

        {/* Questions Tab */}
        <TabsContent value="questions" className="mt-0">
          <Questions />
        </TabsContent>

        {/* Quizzes Tab */}
        <TabsContent value="quizzes" className="mt-0 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Collections of questions that can be standalone or part of a
              level.
            </p>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-1.5" /> Create Quiz
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <MetricCard
              icon={HelpCircle}
              label="Total Quizzes"
              value="156"
              color="primary"
            />
            <MetricCard
              icon={Layers}
              label="In Levels"
              value="98"
              color="chart-2"
            />
            <MetricCard
              icon={HelpCircle}
              label="Standalone"
              value="58"
              color="chart-3"
            />
          </div>

          <Card className="rounded-xl">
            <CardHeader className="px-4 pt-4 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-foreground">
                  All Quizzes
                </CardTitle>
                <div className="relative w-56">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search quizzes..."
                    className="w-full h-8 pl-9 pr-3 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground font-medium text-xs">
                        Quiz Name
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs hidden sm:table-cell">
                        Subject
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs text-right">
                        Qs
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs text-right">
                        Attempts
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs text-right">
                        Score
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs hidden md:table-cell">
                        Level
                      </TableHead>
                      <TableHead className="w-8"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quizzes.map((quiz) => (
                      <TableRow key={quiz.id} className="border-border group">
                        <TableCell className="py-2.5 font-medium text-foreground text-sm">
                          {quiz.name}
                        </TableCell>
                        <TableCell className="py-2.5 text-muted-foreground text-sm hidden sm:table-cell">
                          {quiz.subject}
                        </TableCell>
                        <TableCell className="py-2.5 text-right text-foreground text-sm tabular-nums">
                          {quiz.questions}
                        </TableCell>
                        <TableCell className="py-2.5 text-right text-foreground text-sm tabular-nums">
                          {quiz.attempts.toLocaleString()}
                        </TableCell>
                        <TableCell className="py-2.5 text-right">
                          <span
                            className={`text-sm font-medium tabular-nums ${quiz.avgScore >= 80 ? "text-chart-1" : quiz.avgScore >= 70 ? "text-chart-3" : "text-destructive"}`}
                          >
                            {quiz.avgScore}%
                          </span>
                        </TableCell>
                        <TableCell className="py-2.5 hidden md:table-cell">
                          {quiz.inLevel ? (
                            <Badge
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0 bg-chart-2/10 text-chart-2 border-chart-2/20"
                            >
                              {quiz.levelName}
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0"
                            >
                              Standalone
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="py-2.5">
                          <ActionMenu />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Levels Tab */}
        <TabsContent value="levels" className="mt-0 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Structured learning paths containing multiple quizzes.
            </p>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-1.5" /> Create Level
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <MetricCard
              icon={Layers}
              label="Total Levels"
              value="24"
              color="primary"
            />
            <MetricCard
              icon={HelpCircle}
              label="Total Quizzes"
              value="98"
              color="chart-2"
            />
            <MetricCard
              icon={FileQuestion}
              label="Total Questions"
              value="1,450"
              color="chart-5"
            />
          </div>

          <Card className="rounded-xl">
            <CardHeader className="px-4 pt-4 pb-3">
              <CardTitle className="text-sm font-medium text-foreground">
                All Levels
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground font-medium text-xs">
                        Level Name
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs text-right">
                        Quizzes
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs text-right hidden sm:table-cell">
                        Questions
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs text-right hidden sm:table-cell">
                        Students
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs">
                        Completion
                      </TableHead>
                      <TableHead className="w-8"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {levels.map((level) => (
                      <TableRow key={level.id} className="border-border group">
                        <TableCell className="py-2.5 font-medium text-foreground text-sm">
                          {level.name}
                        </TableCell>
                        <TableCell className="py-2.5 text-right text-foreground text-sm tabular-nums">
                          {level.quizzes}
                        </TableCell>
                        <TableCell className="py-2.5 text-right text-foreground text-sm tabular-nums hidden sm:table-cell">
                          {level.totalQuestions}
                        </TableCell>
                        <TableCell className="py-2.5 text-right text-foreground text-sm tabular-nums hidden sm:table-cell">
                          {level.students.toLocaleString()}
                        </TableCell>
                        <TableCell className="py-2.5">
                          <div className="flex items-center gap-2">
                            <Progress
                              value={level.completionRate}
                              className="h-1.5 w-20 bg-secondary"
                            />
                            <span
                              className={`text-xs font-medium tabular-nums ${level.completionRate >= 70 ? "text-chart-1" : level.completionRate >= 50 ? "text-chart-3" : "text-destructive"}`}
                            >
                              {level.completionRate}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-2.5">
                          <ActionMenu />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
