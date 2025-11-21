"use client";

import { useState } from "react";
import { useQuestions } from "@/hooks/use-questions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
  Upload,
  Trash2,
  Edit2,
  BookOpen,
  Filter,
} from "lucide-react";
import { BulkUploadDialog } from "./bulk-upload-dialog";
import { CreateQuestionDialog } from "./create-question-dialog";

const SUBJECTS = ["Mathematics", "Geography", "English", "History", "Science"];
const LEVELS = ["Form 1", "Form 2", "Form 3", "Form 4"];

export function QuestionsContent() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [subject, setSubject] = useState<string>("all");
  const [level, setLevel] = useState<string>("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const { questions, total, totalPages, isLoading, error, deleteQuestion } =
    useQuestions({
      page,
      pageSize,
      subject: subject !== "all" ? subject : undefined,
      level: level !== "all" ? level : undefined,
    });

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    try {
      await deleteQuestion(questionId);
    } catch (err) {
      console.error("Failed to delete question:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Questions Bank
            </h1>
          </div>
          <p className="text-muted-foreground">
            Manage and organize your question collection
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
            <Button
              onClick={() => setCreateDialogOpen(true)}
              className="gap-2 bg-primary hover:bg-primary/90"
              size="lg"
            >
              <Plus className="h-5 w-5" />
              New Question
            </Button>
            <Button
              onClick={() => setUploadDialogOpen(true)}
              variant="outline"
              className="gap-2"
              size="lg"
            >
              <Upload className="h-5 w-5" />
              Bulk Upload
            </Button>
          </div>

          <div className="flex items-center gap-4 rounded-lg bg-secondary/30 px-4 py-3">
            <div className="text-right">
              <p className="text-sm font-medium text-muted-foreground">
                Total Questions
              </p>
              <p className="text-2xl font-bold text-foreground">{total}</p>
            </div>
          </div>
        </div>

        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              <CardTitle>Filters & Search</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm font-medium">
                  Subject
                </Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger id="subject" className="bg-background">
                    <SelectValue placeholder="All subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All subjects</SelectItem>
                    {SUBJECTS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level" className="text-sm font-medium">
                  Level
                </Label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger id="level" className="bg-background">
                    <SelectValue placeholder="All levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All levels</SelectItem>
                    {LEVELS.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pageSize" className="text-sm font-medium">
                  Per Page
                </Label>
                <Select
                  value={String(pageSize)}
                  onValueChange={(v) => setPageSize(Number(v))}
                >
                  <SelectTrigger id="pageSize" className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 items</SelectItem>
                    <SelectItem value="20">20 items</SelectItem>
                    <SelectItem value="50">50 items</SelectItem>
                    <SelectItem value="100">100 items</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Page Info</Label>
                <div className="flex h-10 items-center rounded-lg border border-border bg-background px-3 py-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {totalPages > 0 ? `${page} of ${totalPages}` : "No data"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="border-b border-border">
            <CardTitle>Questions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {error && (
              <div className="m-6 flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                <AlertCircle className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
                <span className="text-sm text-destructive">
                  {error instanceof Error
                    ? error.message
                    : "Failed to load questions"}
                </span>
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Loading questions...
                  </p>
                </div>
              </div>
            ) : questions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">No questions found</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Create a new question or adjust filters to get started
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {questions.map((question, idx) => (
                  <div
                    key={question._id}
                    className="p-6 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
                              {idx + 1 + (page - 1) * pageSize}
                            </div>
                            <h3 className="font-semibold text-foreground leading-relaxed">
                              {question.question_text}
                            </h3>
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-muted-foreground hover:text-foreground"
                            onClick={() => {
                              // TODO: Implement edit
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteQuestion(question._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 ml-11">
                        {question.subject && (
                          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                            {question.subject}
                          </span>
                        )}
                        {question.level && (
                          <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                            {question.level}
                          </span>
                        )}
                        {question.points && (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-400">
                            {question.points} pts
                          </span>
                        )}
                      </div>

                      {question.explanation && (
                        <p className="text-sm text-muted-foreground ml-11 border-l-2 border-border pl-4">
                          <span className="font-medium text-foreground">
                            Why:
                          </span>{" "}
                          {question.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="border-t border-border flex items-center justify-between px-6 py-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

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
    </div>
  );
}
