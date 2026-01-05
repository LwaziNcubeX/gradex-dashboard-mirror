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
  Grid3x3,
  List,
  Trophy,
  Target,
  TrendingUp,
  Users,
  Filter,
  Eye,
  Copy,
  Play,
  BarChart3,
  Calendar,
  Award,
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
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("grid");
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
      const matchesDifficulty =
        selectedDifficulty === "all" ||
        (quiz.difficulty_score <= 1 && selectedDifficulty === "easy") ||
        (quiz.difficulty_score > 1 &&
          quiz.difficulty_score <= 2 &&
          selectedDifficulty === "medium") ||
        (quiz.difficulty_score > 2 && selectedDifficulty === "hard");
      return (
        matchesSearch && matchesSubject && matchesLevel && matchesDifficulty
      );
    });
  }, [
    quizzes,
    searchQuery,
    selectedSubject,
    selectedLevel,
    selectedDifficulty,
  ]);

  const stats = useMemo(() => {
    const totalQuestions = quizzes.reduce(
      (sum, q) => sum + (q.questions?.length || 0),
      0
    );
    const totalCompletions = quizzes.reduce(
      (sum, q) => sum + (q.completion_count || 0),
      0
    );

    return {
      total: quizzes.length,
      active: quizzes.filter((q) => q.status === "active").length,
      draft: quizzes.filter((q) => q.status === "draft").length,
      totalQuestions,
      totalCompletions,
      avgXp: quizzes.length
        ? Math.round(
            quizzes.reduce((sum, q) => sum + q.xp_reward, 0) / quizzes.length
          )
        : 0,
      avgScore: quizzes.length
        ? Math.round(
            quizzes.reduce((sum, q) => sum + (q.average_score || 0), 0) /
              quizzes.length
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
        return "bg-green-500/10 text-green-400 border-green-500/30 border";
      case "draft":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30 border";
      case "archived":
        return "bg-gray-500/10 text-gray-400 border-gray-500/30 border";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/30 border";
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 1)
      return "bg-green-500/10 text-green-400 border-green-500/30";
    if (difficulty <= 2)
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
    return "bg-red-500/10 text-red-400 border-red-500/30";
  };

  const getDifficultyBadge = (difficulty: number) => {
    if (difficulty <= 1)
      return {
        label: "Easy",
        color: "bg-green-500/10 text-green-400 border-green-500/30",
      };
    if (difficulty <= 2)
      return {
        label: "Medium",
        color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
      };
    return {
      label: "Hard",
      color: "bg-red-500/10 text-red-400 border-red-500/30",
    };
  };

  const getSubjectColor = (subject: string) => {
    const colors: Record<string, string> = {
      Mathematics: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      Geography: "bg-green-500/10 text-green-400 border-green-500/20",
      English: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      History: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      Science: "bg-red-500/10 text-red-400 border-red-500/20",
      "Combined Science": "bg-teal-500/10 text-teal-400 border-teal-500/20",
    };
    return colors[subject] || "bg-gray-500/10 text-gray-400 border-gray-500/20";
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Quizzes",
            value: stats.total,
            icon: BookOpen,
            color: "bg-blue-500/10 border-blue-500/20",
            iconColor: "text-blue-400",
            trend: `${stats.active} active`,
          },
          {
            label: "Total Questions",
            value: stats.totalQuestions,
            icon: Target,
            color: "bg-purple-500/10 border-purple-500/20",
            iconColor: "text-purple-400",
            trend: "Across all quizzes",
          },
          {
            label: "Completions",
            value: stats.totalCompletions,
            icon: Trophy,
            color: "bg-green-500/10 border-green-500/20",
            iconColor: "text-green-400",
            trend: "Total attempts",
          },
          {
            label: "Avg XP Reward",
            value: stats.avgXp,
            icon: Zap,
            color: "bg-amber-500/10 border-amber-500/20",
            iconColor: "text-amber-400",
            trend: `${stats.avgScore}% avg score`,
          },
        ].map((stat) => (
          <Card
            key={stat.label}
            className={`${stat.color} border transition-all hover:shadow-md`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.trend}</p>
              </div>
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

      {/* Enhanced Filters */}
      <Card className="border">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Filters</h3>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 p-0"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-5">
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search quizzes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background"
                />
              </div>
            </div>

            <div>
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
                  <SelectItem value="Combined Science">
                    Combined Science
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
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

            <div>
              <label className="text-sm font-medium mb-2 block">
                Difficulty
              </label>
              <Select
                value={selectedDifficulty}
                onValueChange={setSelectedDifficulty}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="All difficulties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All difficulties</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {(searchQuery ||
            selectedSubject !== "all" ||
            selectedLevel !== "all" ||
            selectedDifficulty !== "all") && (
            <div className="mt-4 flex items-center justify-between pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {filteredQuizzes.length} of {quizzes.length} quizzes
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSubject("all");
                  setSelectedLevel("all");
                  setSelectedDifficulty("all");
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
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

      {/* Quizzes Display */}
      {filteredQuizzes.length > 0 && (
        <>
          {viewMode === "table" ? (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b bg-muted/30">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold">
                          Quiz Title
                        </th>
                        <th className="text-left px-4 py-3 font-semibold">
                          Subject
                        </th>
                        <th className="text-left px-4 py-3 font-semibold">
                          Level
                        </th>
                        <th className="text-left px-4 py-3 font-semibold">
                          Questions
                        </th>
                        <th className="text-left px-4 py-3 font-semibold">
                          Duration
                        </th>
                        <th className="text-left px-4 py-3 font-semibold">
                          XP
                        </th>
                        <th className="text-left px-4 py-3 font-semibold">
                          Difficulty
                        </th>
                        <th className="text-left px-4 py-3 font-semibold">
                          Status
                        </th>
                        <th className="text-right px-4 py-3 font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredQuizzes.map((quiz: Quiz) => {
                        const difficulty = getDifficultyBadge(
                          quiz.difficulty_score
                        );
                        return (
                          <tr
                            key={quiz._id}
                            className="border-b hover:bg-muted/50 transition-colors"
                          >
                            <td className="px-4 py-4 max-w-xs">
                              <div>
                                <p className="font-medium line-clamp-1 text-foreground">
                                  {quiz.title}
                                </p>
                                {quiz.description && (
                                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                    {quiz.description}
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span
                                className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium border ${getSubjectColor(
                                  quiz.subject
                                )}`}
                              >
                                {quiz.subject}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-sm">{quiz.level}</span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Target className="h-4 w-4" />
                                <span className="font-semibold">
                                  {quiz.questions?.length || 0}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm">
                                  {formatDuration(quiz.duration)}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-1">
                                <Zap className="h-4 w-4 text-amber-400" />
                                <span className="font-semibold">
                                  {quiz.xp_reward}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span
                                className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium border ${difficulty.color}`}
                              >
                                {difficulty.label}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <span
                                className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getStatusBadgeClass(
                                  quiz.status
                                )}`}
                              >
                                {quiz.status.charAt(0).toUpperCase() +
                                  quiz.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-right">
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
                                  <DropdownMenuItem className="gap-2 cursor-pointer">
                                    <Eye className="h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="gap-2 cursor-pointer">
                                    <Play className="h-4 w-4" />
                                    Start Quiz
                                  </DropdownMenuItem>
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
                                  <DropdownMenuItem className="gap-2 cursor-pointer">
                                    <Copy className="h-4 w-4" />
                                    Duplicate
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
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredQuizzes.map((quiz: Quiz) => {
                const difficulty = getDifficultyBadge(quiz.difficulty_score);
                return (
                  <Card
                    key={quiz._id}
                    className="hover:shadow-lg transition-all group"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-2 mb-4">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium border ${getSubjectColor(
                            quiz.subject
                          )}`}
                        >
                          {quiz.subject}
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <Eye className="h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <Play className="h-4 w-4" />
                              Start Quiz
                            </DropdownMenuItem>
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
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <Copy className="h-4 w-4" />
                              Duplicate
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
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg line-clamp-2 mb-1">
                            {quiz.title}
                          </h3>
                          {quiz.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {quiz.description}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium border ${difficulty.color}`}
                          >
                            {difficulty.label}
                          </span>
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getStatusBadgeClass(
                              quiz.status
                            )}`}
                          >
                            {quiz.status.charAt(0).toUpperCase() +
                              quiz.status.slice(1)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                          <div className="flex items-center gap-2 text-sm">
                            <Target className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {quiz.questions?.length || 0}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              questions
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {formatDuration(quiz.duration)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-amber-400" />
                            <span className="text-lg font-bold">
                              {quiz.xp_reward} XP
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              {quiz.level}
                            </p>
                            {quiz.category && (
                              <p className="text-xs text-muted-foreground">
                                {quiz.category}
                              </p>
                            )}
                          </div>
                        </div>

                        {(quiz.completion_count > 0 ||
                          quiz.average_score > 0) && (
                          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-3 border-t">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{quiz.completion_count || 0} attempts</span>
                            </div>
                            {quiz.average_score > 0 && (
                              <div className="flex items-center gap-1">
                                <Trophy className="h-3 w-3" />
                                <span>{quiz.average_score}% avg</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
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
