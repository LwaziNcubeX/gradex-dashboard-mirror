"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  FileQuestion,
  HelpCircle,
  Edit,
  MoreHorizontal,
  Trash2,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Filter,
  X,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getDifficultyColor,
  getStatusColor,
  QuestionType,
  SubjectsList,
} from "@/constants/types";
import {
  questionService,
  type CreateQuestionPayload,
  type UpdateQuestionPayload,
  type QuestionFilters,
} from "@/lib/api/questions";
import { adminService } from "@/lib/api/admin";
import { toast } from "sonner";
import { readableDate } from "@/lib/utils";

// ─── Metric Card ─────────────────────────────────────────
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

// ─── Question Form Defaults ──────────────────────────────
const DIFFICULTIES = ["Form 1", "Form 2", "Form 3", "Form 4"] as const;
const STATUSES = ["draft", "active", "archive", "flagged"] as const;

interface QuestionFormState {
  question_text: string;
  answers: string[];
  correct_answer: string;
  subject: string;
  topic: string;
  difficulty: string;
  explanation: string;
  status: string;
}

const DEFAULT_FORM: QuestionFormState = {
  question_text: "",
  answers: ["", "", "", ""],
  correct_answer: "",
  subject: "Mathematics",
  topic: "",
  difficulty: "Form 1",
  explanation: "",
  status: "active",
};

// ─── Question Form Dialog ────────────────────────────────
function QuestionFormDialog({
  open,
  onOpenChange,
  editingQuestion,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingQuestion: QuestionType | null;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<QuestionFormState>(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    if (editingQuestion) {
      setForm({
        question_text: editingQuestion.question_text,
        answers: editingQuestion.answers.length >= 2 ? editingQuestion.answers : ["", "", "", ""],
        correct_answer: editingQuestion.correct_answer,
        subject: editingQuestion.subject,
        topic: editingQuestion.topic || "",
        difficulty: editingQuestion.difficulty,
        explanation: editingQuestion.explanation || "",
        status: editingQuestion.status || "active",
      });
    } else {
      setForm(DEFAULT_FORM);
    }
    setErrors({});
  }, [open, editingQuestion]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.question_text.trim()) errs.question_text = "Question text is required";
    const validAnswers = form.answers.filter((a) => a.trim());
    if (validAnswers.length < 2) errs.answers = "At least 2 answer options required";
    if (!form.correct_answer.trim()) errs.correct_answer = "Select a correct answer";
    else if (!validAnswers.includes(form.correct_answer)) errs.correct_answer = "Correct answer must be one of the options";
    if (!form.subject) errs.subject = "Subject is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const validAnswers = form.answers.filter((a) => a.trim());
      if (editingQuestion) {
        const payload: UpdateQuestionPayload = {
          question_text: form.question_text.trim(),
          answers: validAnswers,
          correct_answer: form.correct_answer,
          subject: form.subject,
          topic: form.topic.trim() || undefined,
          difficulty: form.difficulty as CreateQuestionPayload["difficulty"],
          explanation: form.explanation.trim() || undefined,
          status: form.status as CreateQuestionPayload["status"],
        };
        await questionService.updateQuestion(editingQuestion._id, payload);
        toast.success("Question updated successfully");
      } else {
        const payload: CreateQuestionPayload = {
          question_text: form.question_text.trim(),
          answers: validAnswers,
          correct_answer: form.correct_answer,
          subject: form.subject,
          topic: form.topic.trim() || undefined,
          difficulty: form.difficulty as CreateQuestionPayload["difficulty"],
          explanation: form.explanation.trim() || undefined,
          status: form.status as CreateQuestionPayload["status"],
        };
        await questionService.createQuestion(payload);
        toast.success("Question created successfully");
      }
      onOpenChange(false);
      onSaved();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save question");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground">
            {editingQuestion ? "Edit Question" : "Create Question"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 px-1 py-2">
          {/* Question Text */}
          <div className="space-y-1.5">
            <Label className="text-sm text-foreground font-medium">Question Text *</Label>
            <textarea
              value={form.question_text}
              onChange={(e) => setForm((p) => ({ ...p, question_text: e.target.value }))}
              placeholder="Enter the question..."
              rows={3}
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            {errors.question_text && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> {errors.question_text}
              </p>
            )}
          </div>

          {/* Answer Options */}
          <div className="space-y-2">
            <Label className="text-sm text-foreground font-medium">Answer Options *</Label>
            <p className="text-xs text-muted-foreground">Click the radio to mark the correct answer.</p>
            {form.answers.map((ans, i) => (
              <div key={i} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => ans.trim() && setForm((p) => ({ ...p, correct_answer: ans }))}
                  className={`h-4 w-4 rounded-full border-2 flex-shrink-0 transition-colors ${
                    form.correct_answer === ans && ans.trim()
                      ? "border-primary bg-primary"
                      : "border-muted-foreground"
                  }`}
                />
                <Input
                  value={ans}
                  onChange={(e) => {
                    const updated = [...form.answers];
                    const oldAns = updated[i];
                    updated[i] = e.target.value;
                    setForm((p) => ({
                      ...p,
                      answers: updated,
                      correct_answer: p.correct_answer === oldAns ? e.target.value : p.correct_answer,
                    }));
                  }}
                  placeholder={`Option ${String.fromCharCode(65 + i)}`}
                  className="bg-secondary border-border h-9 text-sm flex-1"
                />
                {form.answers.length > 2 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={() => {
                      const updated = form.answers.filter((_, idx) => idx !== i);
                      setForm((p) => ({
                        ...p,
                        answers: updated,
                        correct_answer: p.correct_answer === ans ? "" : p.correct_answer,
                      }));
                    }}
                  >
                    <X className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                )}
              </div>
            ))}
            {form.answers.length < 6 && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setForm((p) => ({ ...p, answers: [...p.answers, ""] }))}
              >
                <Plus className="h-3 w-3 mr-1" /> Add Option
              </Button>
            )}
            {errors.answers && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> {errors.answers}
              </p>
            )}
            {errors.correct_answer && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> {errors.correct_answer}
              </p>
            )}
          </div>

          {/* Subject & Difficulty */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm text-foreground font-medium">Subject *</Label>
              <Select value={form.subject} onValueChange={(v) => setForm((p) => ({ ...p, subject: v }))}>
                <SelectTrigger className="bg-secondary border-border h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {SubjectsList.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-foreground font-medium">Difficulty</Label>
              <Select value={form.difficulty} onValueChange={(v) => setForm((p) => ({ ...p, difficulty: v }))}>
                <SelectTrigger className="bg-secondary border-border h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {DIFFICULTIES.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Topic & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm text-foreground font-medium">Topic</Label>
              <Input
                value={form.topic}
                onChange={(e) => setForm((p) => ({ ...p, topic: e.target.value }))}
                placeholder="e.g. Algebra"
                className="bg-secondary border-border h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-foreground font-medium">Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}>
                <SelectTrigger className="bg-secondary border-border h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Explanation */}
          <div className="space-y-1.5">
            <Label className="text-sm text-foreground font-medium">Explanation</Label>
            <textarea
              value={form.explanation}
              onChange={(e) => setForm((p) => ({ ...p, explanation: e.target.value }))}
              placeholder="Explain the correct answer..."
              rows={2}
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 border-t border-border pt-3">
          <Button variant="secondary" size="sm" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
            {editingQuestion ? "Save Changes" : "Create Question"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Questions Component ────────────────────────────
const ITEMS_PER_PAGE = 20;

const Questions = () => {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({ questions: 0, multi_choice: 0, other: 0 });

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<QuestionFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState<QuestionFilters>({});

  // Pagination (client-side since backend returns all)
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting
  const [sortField, setSortField] = useState<"created_at" | "subject" | "difficulty">("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // CRUD dialogs
  const [formOpen, setFormOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionType | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  // ─── Fetch ─────────────────────────────────────────────
  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await questionService.fetchQuestions(filters);
      setQuestions(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load questions";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  useEffect(() => {
    adminService
      .getOverview()
      .then((d) => {
        setMetrics({
          questions: d.content?.questions ?? 0,
          multi_choice: d.content?.questions ?? 0,
          other: 0,
        });
      })
      .catch(() => {});
  }, []);

  // ─── Sorting & Filtering ──────────────────────────────
  const filteredQuestions = questions.filter((q) => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        q.question_text.toLowerCase().includes(query) ||
        q.subject?.toLowerCase().includes(query) ||
        q.topic?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    let cmp = 0;
    if (sortField === "created_at") {
      cmp = new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
    } else if (sortField === "subject") {
      cmp = (a.subject || "").localeCompare(b.subject || "");
    } else if (sortField === "difficulty") {
      cmp = (a.difficulty || "").localeCompare(b.difficulty || "");
    }
    return sortDir === "asc" ? cmp : -cmp;
  });

  const totalPages = Math.max(1, Math.ceil(sortedQuestions.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedQuestions = sortedQuestions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters, sortField, sortDir]);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  // ─── CRUD Handlers ────────────────────────────────────
  const handleCreate = () => {
    setEditingQuestion(null);
    setFormOpen(true);
  };

  const handleEdit = (question: QuestionType) => {
    setEditingQuestion(question);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    setDeleting(true);
    try {
      await questionService.deleteQuestion(deleteConfirmId);
      toast.success("Question deleted successfully");
      setDeleteConfirmId(null);
      setDeleteConfirmText("");
      fetchQuestions();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete question");
    } finally {
      setDeleting(false);
    }
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setTempFilters({});
    setFilters({});
    setShowFilters(false);
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Manage individual questions that can be used across quizzes.
        </p>
        <Button size="sm" onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-1.5" /> Create Question
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <MetricCard
          icon={FileQuestion}
          label="Total Questions"
          value={loading ? "—" : String(metrics.questions)}
          color="primary"
        />
        <MetricCard
          icon={HelpCircle}
          label="Multiple Choice"
          value={loading ? "—" : String(metrics.multi_choice)}
          color="chart-2"
        />
        <MetricCard
          icon={Edit}
          label="Loaded"
          value={loading ? "—" : String(questions.length)}
          color="chart-5"
        />
      </div>

      {/* Table Card */}
      <Card className="rounded-xl">
        <CardHeader className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-sm font-medium text-foreground">
              All Questions
            </CardTitle>
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-8 pl-9 pr-3 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              {/* Filter button */}
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs relative"
                onClick={() => {
                  setTempFilters(filters);
                  setShowFilters(true);
                }}
              >
                <Filter className="h-3.5 w-3.5 mr-1.5" /> Filters
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-4 pb-4">
          {error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertTriangle className="h-8 w-8 text-destructive mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">Failed to load questions</p>
              <p className="text-xs text-muted-foreground mb-3">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchQuestions}>
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground font-medium text-xs">
                        Question
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs hidden sm:table-cell">
                        Topic
                      </TableHead>
                      <TableHead
                        className="text-muted-foreground font-medium text-xs cursor-pointer select-none hidden sm:table-cell"
                        onClick={() => toggleSort("subject")}
                      >
                        <div className="flex items-center gap-1">
                          Subject
                          <ArrowUpDown className={`h-3 w-3 ${sortField === "subject" ? "text-primary" : ""}`} />
                        </div>
                      </TableHead>
                      <TableHead
                        className="text-muted-foreground font-medium text-xs cursor-pointer select-none hidden md:table-cell"
                        onClick={() => toggleSort("difficulty")}
                      >
                        <div className="flex items-center gap-1">
                          Difficulty
                          <ArrowUpDown className={`h-3 w-3 ${sortField === "difficulty" ? "text-primary" : ""}`} />
                        </div>
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs hidden lg:table-cell">
                        Status
                      </TableHead>
                      <TableHead
                        className="text-muted-foreground font-medium text-xs cursor-pointer select-none hidden lg:table-cell"
                        onClick={() => toggleSort("created_at")}
                      >
                        <div className="flex items-center gap-1">
                          Created
                          <ArrowUpDown className={`h-3 w-3 ${sortField === "created_at" ? "text-primary" : ""}`} />
                        </div>
                      </TableHead>
                      <TableHead className="w-8" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 8 }).map((_, i) => (
                        <TableRow key={i} className="border-border">
                          {Array.from({ length: 7 }).map((_, j) => (
                            <TableCell key={j} className="py-2.5">
                              <div className="h-4 w-full bg-secondary rounded animate-pulse" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : paginatedQuestions.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-8 text-muted-foreground text-sm"
                        >
                          {searchQuery || activeFilterCount > 0
                            ? "No questions match your search or filters."
                            : "No questions yet. Create your first question."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedQuestions.map((q) => (
                        <TableRow key={q._id} className="border-border group">
                          <TableCell className="py-2.5 font-medium text-foreground text-sm max-w-[280px] truncate">
                            {q.question_text}
                          </TableCell>
                          <TableCell className="py-2.5 text-muted-foreground text-sm hidden sm:table-cell">
                            {q.topic || "—"}
                          </TableCell>
                          <TableCell className="py-2.5 text-muted-foreground text-sm hidden sm:table-cell">
                            {q.subject}
                          </TableCell>
                          <TableCell className="py-2.5 hidden md:table-cell">
                            <Badge
                              variant="secondary"
                              className={`text-[10px] px-1.5 py-0 ${getDifficultyColor(q.difficulty)}`}
                            >
                              {q.difficulty}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-2.5 hidden lg:table-cell">
                            <Badge
                              variant="outline"
                              className={`text-[10px] cursor-default px-1.5 py-0 ${getStatusColor(q.status)}`}
                            >
                              {q.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-2.5 text-muted-foreground text-xs hidden lg:table-cell tabular-nums">
                            {q.created_at ? readableDate(q.created_at) : "—"}
                          </TableCell>
                          <TableCell className="py-2.5">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-card border-border">
                                <DropdownMenuItem className="cursor-pointer" onClick={() => handleEdit(q)}>
                                  <Edit className="h-3.5 w-3.5 mr-2" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive cursor-pointer"
                                  onClick={() => {
                                    setDeleteConfirmId(q._id);
                                    setDeleteConfirmText(q.question_text);
                                  }}
                                >
                                  <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {!loading && totalPages >= 1 && (
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    Showing {sortedQuestions.length === 0 ? 0 : startIndex + 1} to{" "}
                    {Math.min(startIndex + ITEMS_PER_PAGE, sortedQuestions.length)} of{" "}
                    {sortedQuestions.length} questions
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let page: number;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }
                      return (
                        <Button
                          key={page}
                          variant="outline"
                          size="sm"
                          className={`h-7 w-7 text-xs ${page === currentPage ? "bg-primary/10 text-primary border-primary/20" : ""}`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      );
                    })}
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <QuestionFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editingQuestion={editingQuestion}
        onSaved={fetchQuestions}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent className="bg-card border-border sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground">Delete Question</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this question? This action cannot be undone.
            </p>
            {deleteConfirmText && (
              <p className="text-sm text-foreground font-medium bg-secondary/50 p-2 rounded-lg truncate">
                &ldquo;{deleteConfirmText}&rdquo;
              </p>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="secondary" size="sm" onClick={() => setDeleteConfirmId(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
              {deleting && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={showFilters} onOpenChange={setShowFilters}>
        <DialogContent className="bg-card border-border sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground">Filter Questions</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">Subject</Label>
              <Select
                value={tempFilters.subject || "all"}
                onValueChange={(v) => setTempFilters((p) => ({ ...p, subject: v === "all" ? undefined : v }))}
              >
                <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="All Subjects" /></SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">All Subjects</SelectItem>
                  {SubjectsList.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">Difficulty</Label>
              <Select
                value={tempFilters.difficulty || "all"}
                onValueChange={(v) =>
                  setTempFilters((p) => ({
                    ...p,
                    difficulty: v === "all" ? undefined : (v as QuestionFilters["difficulty"]),
                  }))
                }
              >
                <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="All" /></SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">All Difficulties</SelectItem>
                  {DIFFICULTIES.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">Status</Label>
              <Select
                value={tempFilters.status || "all"}
                onValueChange={(v) =>
                  setTempFilters((p) => ({
                    ...p,
                    status: v === "all" ? undefined : (v as QuestionFilters["status"]),
                  }))
                }
              >
                <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="All" /></SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">All Statuses</SelectItem>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">Topic</Label>
              <Input
                value={tempFilters.topic || ""}
                onChange={(e) => setTempFilters((p) => ({ ...p, topic: e.target.value || undefined }))}
                placeholder="Enter topic..."
                className="bg-secondary border-border"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={clearFilters}>Clear All</Button>
            <Button size="sm" onClick={applyFilters}>Apply Filters</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Questions;
