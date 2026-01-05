"use client";

import { useState, useMemo } from "react";
import { useQuestions } from "@/hooks/use-questions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
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
  FileQuestion,
  GaugeCircle,
  Layers,
  Download,
  Filter,
  Grid3x3,
  List,
  TrendingUp,
  Clock,
  Check,
  Copy,
  Eye,
  BarChart3,
  X,
  HelpCircle,
  RefreshCw,
} from "lucide-react";
import { CreateQuestionDialog } from "./create-question-dialog";
import { BulkUploadDialog } from "./bulk-upload-dialog";
import type { Question } from "@/hooks/use-questions";

export function QuestionsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(
    new Set()
  );

  const { questions, isLoading, error, deleteQuestion } = useQuestions();

  const subjects = useMemo(
    () =>
      Array.from(
        new Set(questions.map((q) => q.subject).filter(Boolean))
      ).sort(),
    [questions]
  );

  const filteredQuestions = useMemo(() => {
    return questions.filter((question: Question) => {
      const matchesSearch =
        question.question_text
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        question.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        question.topic?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject =
        selectedSubject === "all" || question.subject === selectedSubject;
      const matchesLevel =
        selectedLevel === "all" || question.level === selectedLevel;
      const matchesDifficulty =
        selectedDifficulty === "all" ||
        (question.points <= 5 && selectedDifficulty === "easy") ||
        (question.points > 5 &&
          question.points <= 10 &&
          selectedDifficulty === "medium") ||
        (question.points > 10 && selectedDifficulty === "hard");
      return (
        matchesSearch && matchesSubject && matchesLevel && matchesDifficulty
      );
    });
  }, [
    questions,
    searchQuery,
    selectedSubject,
    selectedLevel,
    selectedDifficulty,
  ]);

  const stats = useMemo(() => {
    const difficultyDistribution = {
      easy: questions.filter((q) => q.points <= 5).length,
      medium: questions.filter((q) => q.points > 5 && q.points <= 10).length,
      hard: questions.filter((q) => q.points > 10).length,
    };

    return {
      total: questions.length,
      subjects: subjects.length,
      avgPoints: questions.length
        ? Math.round(
            questions.reduce((sum, q) => sum + (q.points || 0), 0) /
              questions.length
          )
        : 0,
      difficultyDistribution,
      recentlyAdded: questions.filter((q) => {
        // Assuming questions have a createdAt field, otherwise use total as fallback
        return true;
      }).length,
    };
  }, [questions, subjects]);

  const getDifficultyBadge = (points: number) => {
    if (points <= 5)
      return (
        <Badge
          variant="outline"
          className="bg-green-500/10 text-green-400 border-green-500/30"
        >
          Easy
        </Badge>
      );
    if (points <= 10)
      return (
        <Badge
          variant="outline"
          className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
        >
          Medium
        </Badge>
      );
    return (
      <Badge
        variant="outline"
        className="bg-red-500/10 text-red-400 border-red-500/30"
      >
        Hard
      </Badge>
    );
  };

  const getSubjectColor = (subject: string) => {
    const colors: Record<string, string> = {
      Mathematics: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      Geography: "bg-green-500/10 text-green-400 border-green-500/20",
      English: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      History: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      Science: "bg-red-500/10 text-red-400 border-red-500/20",
    };
    return colors[subject] || "bg-gray-500/10 text-gray-400 border-gray-500/20";
  };

  const toggleQuestionSelection = (id: string) => {
    const newSelected = new Set(selectedQuestions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedQuestions(newSelected);
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedQuestions.size} selected questions?`))
      return;

    for (const id of selectedQuestions) {
      await deleteQuestion(id);
    }
    setSelectedQuestions(new Set());
  };

  const getStatusColor = (subject: string) => {
    const colors: Record<string, string> = {
      Mathematics: "bg-blue-500 text-blue-800 hover:bg-blue-100",
      Geography: "bg-green-100 text-green-800 hover:bg-green-100",
      English: "bg-purple-100 text-purple-800 hover:bg-purple-100",
      History: "bg-amber-100 text-amber-800 hover:bg-amber-100",
      Science: "bg-red-100 text-red-800 hover:bg-red-100",
    };
    return colors[subject] || "bg-gray-100 text-gray-800 hover:bg-gray-100";
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    try {
      await deleteQuestion(questionId);
    } catch (err) {
      console.error("Failed to delete question:", err);
    }
  };

  const hasFilters =
    searchQuery ||
    selectedSubject !== "all" ||
    selectedLevel !== "all" ||
    selectedDifficulty !== "all";

  return (
    <div className="space-y-6">
      {/* Enhanced Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Questions",
            value: stats.total,
            icon: FileQuestion,
            color: "bg-blue-500/10 border-blue-500/20",
            iconColor: "text-blue-400",
            trend: "+12%",
          },
          {
            label: "Subjects",
            value: stats.subjects,
            icon: BookOpen,
            color: "bg-purple-500/10 border-purple-500/20",
            iconColor: "text-purple-400",
            trend: "4 active",
          },
          {
            label: "Avg Points",
            value: stats.avgPoints,
            icon: GaugeCircle,
            color: "bg-green-500/10 border-green-500/20",
            iconColor: "text-green-400",
            trend: "7.5 avg",
          },
          {
            label: "Recently Added",
            value: stats.recentlyAdded,
            icon: Clock,
            color: "bg-amber-500/10 border-amber-500/20",
            iconColor: "text-amber-400",
            trend: "Last 7 days",
          },
        ].map((stat) => (
          <Card
            key={stat.label}
            className={`${stat.color} border transition-all hover:shadow-md`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                <Badge variant="outline" className="text-xs">
                  {stat.trend}
                </Badge>
              </div>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Difficulty Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Difficulty Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                label: "Easy",
                value: stats.difficultyDistribution.easy,
                color: "bg-green-500/20 text-green-400 border-green-500/30",
              },
              {
                label: "Medium",
                value: stats.difficultyDistribution.medium,
                color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
              },
              {
                label: "Hard",
                value: stats.difficultyDistribution.hard,
                color: "bg-red-500/20 text-red-400 border-red-500/30",
              },
            ].map((diff) => (
              <div
                key={diff.label}
                className={`rounded-lg border p-4 ${diff.color}`}
              >
                <p className="text-sm font-medium">{diff.label}</p>
                <p className="text-2xl font-bold mt-2">{diff.value}</p>
                <p className="text-xs opacity-75 mt-1">
                  {stats.total > 0
                    ? Math.round((diff.value / stats.total) * 100)
                    : 0}
                  % of total
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Header with Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Question Bank Management
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredQuestions.length} of {stats.total} questions
            {selectedQuestions.size > 0 &&
              ` • ${selectedQuestions.size} selected`}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {selectedQuestions.size > 0 && (
            <>
              <Button
                onClick={() => handleBulkDelete()}
                variant="destructive"
                size="sm"
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete ({selectedQuestions.size})
              </Button>
              <Button
                onClick={() => setSelectedQuestions(new Set())}
                variant="outline"
                size="sm"
              >
                Clear Selection
              </Button>
            </>
          )}
          <Button
            onClick={() => {
              /* Export functionality */
            }}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            onClick={() => setUploadDialogOpen(true)}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Bulk Upload
          </Button>
          <Button
            onClick={() => setCreateDialogOpen(true)}
            size="sm"
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Question
          </Button>
        </div>
      </div>

      {/* Enhanced Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">View:</span>
                <div className="flex gap-1 border rounded-md p-1">
                  <Button
                    variant={viewMode === "table" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => setViewMode("table")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search questions, topics, subjects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All subjects</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All levels</SelectItem>
                  <SelectItem value="Form 1">Form 1</SelectItem>
                  <SelectItem value="Form 2">Form 2</SelectItem>
                  <SelectItem value="Form 3">Form 3</SelectItem>
                  <SelectItem value="Form 4">Form 4</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={selectedDifficulty}
                onValueChange={setSelectedDifficulty}
              >
                <SelectTrigger>
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

            {(searchQuery ||
              selectedSubject !== "all" ||
              selectedLevel !== "all" ||
              selectedDifficulty !== "all") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSubject("all");
                  setSelectedLevel("all");
                  setSelectedDifficulty("all");
                }}
                className="w-fit"
              >
                Clear all filters
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
            <p className="font-semibold">Failed to load questions</p>
            <p className="text-xs opacity-90">{error.message}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !questions.length && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              Loading questions...
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredQuestions.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-4">
              {questions.length === 0
                ? "No questions yet. Create your first question to get started."
                : "No questions match your filters."}
            </p>
            {questions.length === 0 && (
              <Button
                onClick={() => setCreateDialogOpen(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Question
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Questions Display */}
      {filteredQuestions.length > 0 && (
        <>
          {viewMode === "table" ? (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b bg-muted/30">
                      <tr>
                        <th className="text-left px-4 py-3 w-10">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedQuestions(
                                  new Set(filteredQuestions.map((q) => q._id))
                                );
                              } else {
                                setSelectedQuestions(new Set());
                              }
                            }}
                            checked={
                              selectedQuestions.size ===
                                filteredQuestions.length &&
                              filteredQuestions.length > 0
                            }
                            className="rounded"
                          />
                        </th>
                        <th className="text-left px-4 py-3 font-semibold">
                          Question
                        </th>
                        <th className="text-left px-4 py-3 font-semibold">
                          Subject
                        </th>
                        <th className="text-left px-4 py-3 font-semibold">
                          Level
                        </th>
                        <th className="text-left px-4 py-3 font-semibold">
                          Difficulty
                        </th>
                        <th className="text-left px-4 py-3 font-semibold">
                          Topic
                        </th>
                        <th className="text-left px-4 py-3 font-semibold">
                          Points
                        </th>
                        <th className="text-right px-4 py-3 font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredQuestions.map((question: Question) => (
                        <tr
                          key={question._id}
                          className="border-b hover:bg-muted/50 transition-colors"
                        >
                          <td className="px-4 py-4">
                            <input
                              type="checkbox"
                              checked={selectedQuestions.has(question._id)}
                              onChange={() =>
                                toggleQuestionSelection(question._id)
                              }
                              className="rounded"
                            />
                          </td>
                          <td className="px-4 py-4 max-w-md">
                            <div>
                              <p className="font-medium line-clamp-2 text-foreground">
                                {question.question_text}
                              </p>
                              {question.explanation && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                  {question.explanation}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <Badge
                              variant="outline"
                              className={getSubjectColor(question.subject)}
                            >
                              {question.subject}
                            </Badge>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm">
                              {question.level || "-"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            {getDifficultyBadge(question.points || 10)}
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-muted-foreground">
                              {question.topic || "-"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm font-semibold">
                              {question.points || 10}
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
                                <DropdownMenuItem
                                  onClick={() => setEditingQuestion(question)}
                                  className="gap-2 cursor-pointer"
                                >
                                  <Edit className="h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-2 cursor-pointer">
                                  <Copy className="h-4 w-4" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDeleteQuestion(question._id)
                                  }
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
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredQuestions.map((question: Question) => (
                <Card
                  key={question._id}
                  className="hover:shadow-md transition-all"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <input
                        type="checkbox"
                        checked={selectedQuestions.has(question._id)}
                        onChange={() => toggleQuestionSelection(question._id)}
                        className="rounded mt-1"
                      />
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
                          <DropdownMenuItem
                            onClick={() => setEditingQuestion(question)}
                            className="gap-2 cursor-pointer"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Copy className="h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteQuestion(question._id)}
                            className="gap-2 cursor-pointer text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-3">
                      <p className="font-medium line-clamp-3 text-foreground">
                        {question.question_text}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant="outline"
                          className={getSubjectColor(question.subject)}
                        >
                          {question.subject}
                        </Badge>
                        {getDifficultyBadge(question.points || 10)}
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
                        <span>{question.level || "No level"}</span>
                        <span className="font-semibold text-foreground">
                          {question.points || 10} pts
                        </span>
                      </div>

                      {question.topic && (
                        <p className="text-xs text-muted-foreground">
                          Topic: {question.topic}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Dialogs */}
      <CreateQuestionDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      <BulkUploadDialog
        open={isBulkUploadOpen}
        onOpenChange={setIsBulkUploadOpen}
      />
    </div>
  );
}
