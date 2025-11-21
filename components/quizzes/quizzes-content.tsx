"use client";

import { useState, useMemo } from "react";
import { useQuizzes, type Quiz } from "@/hooks/use-quizzes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Loader2,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Search,
  BookOpen,
  Upload,
  Clock,
  Zap,
} from "lucide-react";
import { CreateQuizDialog } from "./create-quiz-dialog";
import { DeleteQuizDialog } from "./delete-quiz-dialog";
import { BulkUploadQuizzesDialog } from "./bulk-upload-quizzes-dialog";

const SUBJECTS = ["Mathematics", "Geography", "English", "History", "Science"];

const FORM_LEVELS = ["Form 1", "Form 2", "Form 3", "Form 4"];

export function QuizzesContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [deletingQuiz, setDeletingQuiz] = useState<Quiz | null>(null);

  const { quizzes, isLoading, error } = useQuizzes();

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz: Quiz) => {
      const matchesSearch =
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.category?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject =
        selectedSubject === "all" || quiz.subject === selectedSubject;
      const matchesLevel =
        selectedLevel === "all" || quiz.level === selectedLevel;
      return matchesSearch && matchesSubject && matchesLevel;
    });
  }, [quizzes, searchQuery, selectedSubject, selectedLevel]);

  const stats = useMemo(() => {
    return {
      total: quizzes.length,
      active: quizzes.filter((q) => q.status === "active").length,
      draft: quizzes.filter((q) => q.status === "draft").length,
      avgXp: quizzes.length
        ? Math.round(
            quizzes.reduce((sum, q) => sum + q.xp_reward, 0) / quizzes.length
          )
        : 0,
    };
  }, [quizzes]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "draft":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "archived":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 1.5) return "text-blue-600";
    if (difficulty <= 3) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Quizzes", value: stats.total, color: "bg-blue-50" },
          {
            label: "Active",
            value: stats.active,
            color: "bg-green-50",
          },
          { label: "Draft", value: stats.draft, color: "bg-yellow-50" },
          {
            label: "Avg XP Reward",
            value: stats.avgXp,
            color: "bg-purple-50",
          },
        ].map((stat) => (
          <Card key={stat.label} className={`${stat.color} border-0`}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Header with Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manage Quizzes</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Create, edit, and organize your quiz collection
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setUploadDialogOpen(true)}
            variant="outline"
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Bulk Upload
          </Button>
          <Button
            onClick={() => {
              setEditingQuiz(null);
              setCreateDialogOpen(true);
            }}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Create Quiz
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by title, description, or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background"
                />
              </div>
            </div>

            <div className="min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">Subject</label>
              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="All subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All subjects</SelectItem>
                  {SUBJECTS.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">Level</label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All levels</SelectItem>
                  {FORM_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(searchQuery ||
              selectedSubject !== "all" ||
              selectedLevel !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSubject("all");
                  setSelectedLevel("all");
                }}
                className="bg-background"
              >
                Clear filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="flex gap-3 rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Failed to load quizzes</p>
            <p className="text-xs opacity-90">{error.message}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !quizzes.length && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Loading quizzes...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredQuizzes.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-4">
              {quizzes.length === 0
                ? "No quizzes yet. Create your first quiz to get started."
                : "No quizzes match your filters."}
            </p>
            {quizzes.length === 0 && (
              <Button
                onClick={() => {
                  setEditingQuiz(null);
                  setCreateDialogOpen(true);
                }}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Quiz
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quizzes Table */}
      {filteredQuizzes.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="text-left px-6 py-3 font-semibold">
                      Quiz Title
                    </th>
                    <th className="text-left px-6 py-3 font-semibold">
                      Subject
                    </th>
                    <th className="text-left px-6 py-3 font-semibold">Level</th>
                    <th className="text-left px-6 py-3 font-semibold">
                      Duration
                    </th>
                    <th className="text-left px-6 py-3 font-semibold">XP</th>
                    <th className="text-left px-6 py-3 font-semibold">
                      Difficulty
                    </th>
                    <th className="text-left px-6 py-3 font-semibold">
                      Status
                    </th>
                    <th className="text-right px-6 py-3 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuizzes.map((quiz: Quiz) => (
                    <tr
                      key={quiz._id}
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium">{quiz.title}</p>
                          {quiz.category && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {quiz.category}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">{quiz.subject}</td>
                      <td className="px-6 py-4">{quiz.level}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{formatDuration(quiz.duration)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-yellow-500" />
                          <span className="font-semibold">
                            {quiz.xp_reward}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`font-medium ${getDifficultyColor(
                            quiz.difficulty_score
                          )}`}
                        >
                          {quiz.difficulty_score.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusBadgeClass(
                            quiz.status
                          )}`}
                        >
                          {quiz.status.charAt(0).toUpperCase() +
                            quiz.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingQuiz(quiz);
                                setCreateDialogOpen(true);
                              }}
                              className="gap-2 cursor-pointer"
                            >
                              <Edit className="h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeletingQuiz(quiz)}
                              className="gap-2 cursor-pointer text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <CreateQuizDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        quiz={editingQuiz}
      />

      <DeleteQuizDialog
        open={!!deletingQuiz}
        onOpenChange={(open) => !open && setDeletingQuiz(null)}
        quiz={deletingQuiz}
      />

      <BulkUploadQuizzesDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
      />
    </div>
  );
}
