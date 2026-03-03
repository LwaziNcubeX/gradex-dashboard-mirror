"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  HelpCircle,
  Layers,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  AlertTriangle,
  BookOpen,
} from "lucide-react";
import { quizService, type QuizType } from "@/lib/api/quizzes";
import { adminService } from "@/lib/api/admin";
import { toast } from "sonner";
import { QuizWizard } from "./quiz-wizard";
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
    "chart-3": { bg: "bg-chart-3/10", text: "text-chart-3" },
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

export default function QuizzesTab() {
  const [quizzes, setQuizzes] = useState<QuizType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    total_items: 0,
    total_pages: 1,
    has_next: false,
    has_prev: false,
  });
  const [metrics, setMetrics] = useState({ total: 0, active: 0 });

  // Sorting
  const [sortField, setSortField] = useState<"created_at" | "subject">(
    "created_at",
  );
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Wizard state
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<QuizType | null>(null);

  // Delete state
  const [deleteConfirmQuiz, setDeleteConfirmQuiz] = useState<QuizType | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);

  const fetchQuizzes = useCallback(async (page = 1, search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await quizService.fetchQuizzes({
        page,
        page_size: 20,
        ...(search ? { subject: search } : {}),
      });
      setQuizzes(result.data);
      setPagination({
        page: result.pagination.page,
        total_items: result.pagination.total_items,
        total_pages: result.pagination.total_pages,
        has_next: result.pagination.has_next,
        has_prev: result.pagination.has_prev,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load quizzes";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuizzes(1);
    adminService
      .getOverview()
      .then((d) => {
        setMetrics({ total: d.content.quizzes, active: d.content.quizzes });
      })
      .catch(() => {});
  }, [fetchQuizzes]);

  // Client-side sorting
  const sortedQuizzes = [...quizzes].sort((a, b) => {
    let cmp = 0;
    if (sortField === "created_at") {
      cmp =
        new Date(a.created_at || 0).getTime() -
        new Date(b.created_at || 0).getTime();
    } else if (sortField === "subject") {
      cmp = (a.subject || "").localeCompare(b.subject || "");
    }
    return sortDir === "asc" ? cmp : -cmp;
  });

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const openCreate = () => {
    setEditingQuiz(null);
    setWizardOpen(true);
  };

  const openEdit = (quiz: QuizType) => {
    setEditingQuiz(quiz);
    setWizardOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteConfirmQuiz) return;
    setDeleting(true);
    try {
      await quizService.deleteQuiz(deleteConfirmQuiz._id);
      toast.success("Quiz deleted successfully");
      setDeleteConfirmQuiz(null);
      fetchQuizzes(pagination.page);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete quiz");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Collections of questions that can be standalone or part of a level.
        </p>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4 mr-1.5" /> Create Quiz
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <MetricCard
          icon={BookOpen}
          label="Total Quizzes"
          value={loading ? "—" : String(metrics.total)}
          color="primary"
        />
        <MetricCard
          icon={Layers}
          label="Active"
          value={loading ? "—" : String(metrics.active)}
          color="chart-2"
        />
        <MetricCard
          icon={HelpCircle}
          label="Loaded"
          value={loading ? "—" : String(pagination.total_items)}
          color="chart-3"
        />
      </div>

      {/* Table Card */}
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
                placeholder="Filter by subject..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  fetchQuizzes(1, e.target.value || undefined);
                }}
                className="w-full h-8 pl-9 pr-3 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertTriangle className="h-8 w-8 text-destructive mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">
                Failed to load quizzes
              </p>
              <p className="text-xs text-muted-foreground mb-3">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchQuizzes(1)}
              >
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
                        Quiz Name
                      </TableHead>
                      <TableHead
                        className="text-muted-foreground font-medium text-xs hidden sm:table-cell cursor-pointer select-none"
                        onClick={() => toggleSort("subject")}
                      >
                        <div className="flex items-center gap-1">
                          Subject
                          <ArrowUpDown
                            className={`h-3 w-3 ${sortField === "subject" ? "text-primary" : ""}`}
                          />
                        </div>
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs hidden sm:table-cell">
                        Level
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs text-right">
                        Qs
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs text-right hidden md:table-cell">
                        Attempts
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs text-right hidden md:table-cell">
                        Avg Score
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs hidden lg:table-cell">
                        Status
                      </TableHead>
                      <TableHead
                        className="text-muted-foreground font-medium text-xs hidden lg:table-cell cursor-pointer select-none"
                        onClick={() => toggleSort("created_at")}
                      >
                        <div className="flex items-center gap-1">
                          Created
                          <ArrowUpDown
                            className={`h-3 w-3 ${sortField === "created_at" ? "text-primary" : ""}`}
                          />
                        </div>
                      </TableHead>
                      <TableHead className="w-8" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 6 }).map((_, i) => (
                        <TableRow key={i} className="border-border">
                          {Array.from({ length: 9 }).map((_, j) => (
                            <TableCell key={j} className="py-2.5">
                              <div className="h-4 w-full bg-secondary rounded animate-pulse" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : sortedQuizzes.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={9}
                          className="text-center py-8 text-muted-foreground text-sm"
                        >
                          No quizzes found
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedQuizzes.map((quiz) => (
                        <TableRow
                          key={quiz._id}
                          className="border-border group"
                        >
                          <TableCell className="py-2.5 font-medium text-foreground text-sm">
                            {quiz.title}
                          </TableCell>
                          <TableCell className="py-2.5 text-muted-foreground text-sm hidden sm:table-cell">
                            {quiz.subject}
                          </TableCell>
                          <TableCell className="py-2.5 text-muted-foreground text-sm hidden sm:table-cell">
                            {quiz.level}
                          </TableCell>
                          <TableCell className="py-2.5 text-right text-foreground text-sm tabular-nums">
                            {quiz.questions?.length ?? 0}
                          </TableCell>
                          <TableCell className="py-2.5 text-right text-foreground text-sm tabular-nums hidden md:table-cell">
                            {(quiz.completion_count ?? 0).toLocaleString()}
                          </TableCell>
                          <TableCell className="py-2.5 text-right hidden md:table-cell">
                            <span
                              className={`text-sm font-medium tabular-nums ${
                                (quiz.average_score ?? 0) >= 0.8
                                  ? "text-chart-1"
                                  : (quiz.average_score ?? 0) >= 0.7
                                    ? "text-chart-3"
                                    : "text-destructive"
                              }`}
                            >
                              {((quiz.average_score ?? 0) * 100).toFixed(0)}%
                            </span>
                          </TableCell>
                          <TableCell className="py-2.5 hidden lg:table-cell">
                            <Badge
                              variant="secondary"
                              className={`text-[10px] px-1.5 py-0 ${
                                quiz.is_active
                                  ? "bg-chart-1/10 text-chart-1 border-chart-1/20"
                                  : "bg-muted text-muted-foreground border-border"
                              }`}
                            >
                              {quiz.is_active ? "active" : "inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-2.5 text-muted-foreground text-xs hidden lg:table-cell tabular-nums">
                            {quiz.created_at
                              ? readableDate(quiz.created_at)
                              : "—"}
                          </TableCell>
                          <TableCell className="py-2.5">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                >
                                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="bg-card border-border"
                              >
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => openEdit(quiz)}
                                >
                                  <Edit className="h-3.5 w-3.5 mr-2" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive cursor-pointer"
                                  onClick={() => setDeleteConfirmQuiz(quiz)}
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
              {!loading && pagination.total_pages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    Showing {quizzes.length} of {pagination.total_items} quizzes
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      disabled={!pagination.has_prev}
                      onClick={() => fetchQuizzes(pagination.page - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from(
                      { length: Math.min(pagination.total_pages, 5) },
                      (_, i) => {
                        let page: number;
                        const tp = pagination.total_pages;
                        const cp = pagination.page;
                        if (tp <= 5) {
                          page = i + 1;
                        } else if (cp <= 3) {
                          page = i + 1;
                        } else if (cp >= tp - 2) {
                          page = tp - 4 + i;
                        } else {
                          page = cp - 2 + i;
                        }
                        return (
                          <Button
                            key={page}
                            variant="outline"
                            size="sm"
                            className={`h-7 w-7 text-xs ${page === cp ? "bg-primary/10 text-primary border-primary/20" : ""}`}
                            onClick={() => fetchQuizzes(page)}
                          >
                            {page}
                          </Button>
                        );
                      },
                    )}
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      disabled={!pagination.has_next}
                      onClick={() => fetchQuizzes(pagination.page + 1)}
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

      {/* Quiz Wizard (Create/Edit) */}
      <QuizWizard
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        editingQuiz={editingQuiz}
        onSaved={() => fetchQuizzes(pagination.page)}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteConfirmQuiz}
        onOpenChange={() => setDeleteConfirmQuiz(null)}
      >
        <DialogContent className="bg-card border-border sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground">Delete Quiz</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this quiz? This action cannot be
              undone.
            </p>
            {deleteConfirmQuiz && (
              <p className="text-sm text-foreground font-medium bg-secondary/50 p-2 rounded-lg truncate">
                &ldquo;{deleteConfirmQuiz.title}&rdquo;
              </p>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDeleteConfirmQuiz(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
