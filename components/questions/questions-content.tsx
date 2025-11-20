"use client";

import React, { useState } from "react";
import { useQuestions } from "@/hooks/use-questions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Question
          </Button>
          <Button
            onClick={() => setUploadDialogOpen(true)}
            variant="outline"
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Bulk Upload
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger id="subject">
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
              <Label htmlFor="level">Level</Label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger id="level">
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
              <Label htmlFor="pageSize">Items per page</Label>
              <Select
                value={String(pageSize)}
                onValueChange={(v) => setPageSize(Number(v))}
              >
                <SelectTrigger id="pageSize">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">
                Total Questions
              </Label>
              <div className="rounded border border-slate-200 bg-slate-50 p-2 text-center">
                <p className="text-lg font-semibold">{total}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Questions</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-800">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>
                {error instanceof Error
                  ? error.message
                  : "Failed to load questions"}
              </span>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <p className="text-sm text-muted-foreground">
                  Loading questions...
                </p>
              </div>
            </div>
          ) : questions.length === 0 ? (
            <div className="flex justify-center py-8 text-muted-foreground">
              <p>No questions found. Create one to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((question) => (
                <div
                  key={question._id}
                  className="flex flex-col gap-3 rounded-lg border border-slate-200 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900">
                        {question.question_text}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {question.subject && (
                          <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                            {question.subject}
                          </span>
                        )}
                        {question.level && (
                          <span className="inline-block rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
                            {question.level}
                          </span>
                        )}
                        {question.points && (
                          <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                            {question.points} pts
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          // TODO: Implement edit
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteQuestion(question._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {question.explanation && (
                    <p className="text-sm text-slate-600">
                      <span className="font-medium">Explanation:</span>{" "}
                      {question.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
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

      {/* Create Question Dialog */}
      <CreateQuestionDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      {/* Bulk Upload Dialog */}
      <BulkUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
      />
    </div>
  );
}
