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
} from "lucide-react";
import {
  quizService,
  type QuizType,
  type CreateQuizPayload,
} from "@/lib/api/quizzes";
import { adminService } from "@/lib/api/admin";
import { toast } from "sonner";

const SUBJECTS = [
  "Mathematics",
  "English",
  "Geography",
  "History",
  "Combined Science",
];
const LEVELS = ["Form 1", "Form 2", "Form 3", "Form 4"] as const;

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

interface QuizFormState {
  title: string;
  description: string;
  subject: string;
  level: "Form 1" | "Form 2" | "Form 3" | "Form 4";
  duration: string;
  xp_reward: string;
}

const DEFAULT_FORM: QuizFormState = {
  title: "",
  description: "",
  subject: "Mathematics",
  level: "Form 1",
  duration: "600",
  xp_reward: "50",
};

export default function QuizzesTab() {
  const [quizzes, setQuizzes] = useState<QuizType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    total_items: 0,
    total_pages: 1,
    has_next: false,
    has_prev: false,
  });
  const [metrics, setMetrics] = useState({ total: 0, active: 0 });

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<QuizType | null>(null);
  const [formState, setFormState] = useState<QuizFormState>(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchQuizzes = useCallback(async (page = 1, search?: string) => {
    setLoading(true);
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
    } catch {
      toast.error("Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuizzes(1);
    // Fetch metrics from overview
    adminService
      .getOverview()
      .then((d) => {
        setMetrics({ total: d.content.quizzes, active: d.content.quizzes });
      })
      .catch(() => {});
  }, [fetchQuizzes]);

  const openCreate = () => {
    setEditingQuiz(null);
    setFormState(DEFAULT_FORM);
    setDialogOpen(true);
  };

  const openEdit = (quiz: QuizType) => {
    setEditingQuiz(quiz);
    setFormState({
      title: quiz.title,
      description: quiz.description || "",
      subject: quiz.subject,
      level: quiz.level,
      duration: String(quiz.duration || 600),
      xp_reward: String(quiz.xp_reward || 50),
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formState.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      const payload: CreateQuizPayload = {
        title: formState.title.trim(),
        description: formState.description.trim() || undefined,
        subject: formState.subject,
        level: formState.level,
        duration: Number(formState.duration) || 600,
        xp_reward: Number(formState.xp_reward) || 50,
        is_active: true,
      };
      if (editingQuiz) {
        await quizService.updateQuiz(editingQuiz._id, payload);
        toast.success("Quiz updated");
      } else {
        await quizService.createQuiz(payload);
        toast.success("Quiz created");
      }
      setDialogOpen(false);
      fetchQuizzes(pagination.page);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save quiz");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await quizService.deleteQuiz(id);
      toast.success("Quiz deleted");
      setDeleteConfirmId(null);
      fetchQuizzes(pagination.page);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete quiz");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Collections of questions that can be standalone or part of a level.
        </p>
        <Button
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={openCreate}
        >
          <Plus className="h-4 w-4 mr-1.5" /> Create Quiz
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <MetricCard
          icon={HelpCircle}
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
                  <TableHead className="w-8" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i} className="border-border">
                      {Array.from({ length: 7 }).map((_, j) => (
                        <TableCell key={j} className="py-2.5">
                          <div className="h-4 w-full bg-secondary rounded animate-pulse" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : quizzes.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-muted-foreground text-sm"
                    >
                      No quizzes found
                    </TableCell>
                  </TableRow>
                ) : (
                  quizzes.map((quiz) => (
                    <TableRow key={quiz._id} className="border-border group">
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
                            (quiz.average_score ?? 0) >= 80
                              ? "text-chart-1"
                              : (quiz.average_score ?? 0) >= 70
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
                              onClick={() => setDeleteConfirmId(quiz._id)}
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
                  (_, i) => i + 1,
                ).map((p) => (
                  <Button
                    key={p}
                    variant="outline"
                    size="sm"
                    className={`h-7 w-7 ${p === pagination.page ? "bg-primary/10 text-primary border-primary/20" : ""}`}
                    onClick={() => fetchQuizzes(p)}
                  >
                    {p}
                  </Button>
                ))}
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
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingQuiz ? "Edit Quiz" : "Create Quiz"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-2">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Title *
              </Label>
              <Input
                value={formState.title}
                onChange={(e) =>
                  setFormState((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="e.g. Algebra Basics"
                className="bg-secondary border-border h-9 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Description
              </Label>
              <Input
                value={formState.description}
                onChange={(e) =>
                  setFormState((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Short description..."
                className="bg-secondary border-border h-9 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">
                  Subject
                </Label>
                <Select
                  value={formState.subject}
                  onValueChange={(v) =>
                    setFormState((p) => ({ ...p, subject: v }))
                  }
                >
                  <SelectTrigger className="bg-secondary border-border h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {SUBJECTS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">
                  Form Level
                </Label>
                <Select
                  value={formState.level}
                  onValueChange={(v) =>
                    setFormState((p) => ({
                      ...p,
                      level: v as (typeof LEVELS)[number],
                    }))
                  }
                >
                  <SelectTrigger className="bg-secondary border-border h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {LEVELS.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">
                  Duration (seconds)
                </Label>
                <Input
                  type="number"
                  value={formState.duration}
                  onChange={(e) =>
                    setFormState((p) => ({ ...p, duration: e.target.value }))
                  }
                  placeholder="600"
                  className="bg-secondary border-border h-9 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">
                  XP Reward
                </Label>
                <Input
                  type="number"
                  value={formState.xp_reward}
                  onChange={(e) =>
                    setFormState((p) => ({ ...p, xp_reward: e.target.value }))
                  }
                  placeholder="50"
                  className="bg-secondary border-border h-9 text-sm"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDialogOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
              ) : null}
              {editingQuiz ? "Save Changes" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteConfirmId}
        onOpenChange={() => setDeleteConfirmId(null)}
      >
        <DialogContent className="bg-card border-border sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground">Delete Quiz</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this quiz? This action cannot be
            undone.
          </p>
          <DialogFooter className="gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDeleteConfirmId(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
              ) : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
