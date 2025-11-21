"use client";

import { useState, useMemo } from "react";
import { useQuestions } from "@/hooks/use-questions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { CreateQuestionDialog } from "./create-question-dialog";
import { BulkUploadDialog } from "./bulk-upload-dialog";
import type { Question } from "@/hooks/use-questions";

export function QuestionsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [deletingQuestion, setDeletingQuestion] = useState<Question | null>(
    null
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
      return matchesSearch && matchesSubject && matchesLevel;
    });
  }, [questions, searchQuery, selectedSubject, selectedLevel]);

  const stats = useMemo(() => {
    return {
      total: questions.length,
      subjects: subjects.length,
      avgPoints: questions.length
        ? Math.round(
            questions.reduce((sum, q) => sum + (q.points || 0), 0) /
              questions.length
          )
        : 0,
    };
  }, [questions, subjects]);

  const getStatusColor = (subject: string) => {
    const colors: Record<string, string> = {
      Mathematics: "bg-blue-100 text-blue-800 hover:bg-blue-100",
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
      setDeletingQuestion(null);
    } catch (err) {
      console.error("Failed to delete question:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Questions", value: stats.total, color: "bg-blue-50" },
          {
            label: "Subjects",
            value: stats.subjects,
            color: "bg-purple-50",
          },
          { label: "Avg Points", value: stats.avgPoints, color: "bg-green-50" },
          {
            label: "Available Subjects",
            value: subjects.length,
            color: "bg-amber-50",
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
          <h2 className="text-2xl font-bold tracking-tight">
            Manage Questions
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Create, edit, and organize your question bank
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
            onClick={() => setCreateDialogOpen(true)}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Create Question
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
                  placeholder="Search by question text, subject, or topic..."
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
                  {subjects.map((subject) => (
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
                  <SelectItem value="Form 1">Form 1</SelectItem>
                  <SelectItem value="Form 2">Form 2</SelectItem>
                  <SelectItem value="Form 3">Form 3</SelectItem>
                  <SelectItem value="Form 4">Form 4</SelectItem>
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

      {/* Questions Table */}
      {filteredQuestions.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="text-left px-6 py-3 font-semibold">
                      Question
                    </th>
                    <th className="text-left px-6 py-3 font-semibold">
                      Subject
                    </th>
                    <th className="text-left px-6 py-3 font-semibold">Level</th>
                    <th className="text-left px-6 py-3 font-semibold">Topic</th>
                    <th className="text-left px-6 py-3 font-semibold">
                      Points
                    </th>
                    <th className="text-right px-6 py-3 font-semibold">
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
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium line-clamp-2">
                            {question.question_text}
                          </p>
                          {question.explanation && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {question.explanation.substring(0, 50)}...
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">{question.subject}</td>
                      <td className="px-6 py-4">{question.level || "-"}</td>
                      <td className="px-6 py-4">{question.topic || "-"}</td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold">
                          {question.points || 10}
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
                              onClick={() => setEditingQuestion(question)}
                              className="gap-2 cursor-pointer"
                            >
                              <Edit className="h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteQuestion(question._id)}
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
      <CreateQuestionDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <BulkUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
      />
    </div>
  );
}
