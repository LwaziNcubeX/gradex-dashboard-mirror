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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HelpCircle,
  Layers,
  FileQuestion,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Star,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  AlertTriangle,
  Filter,
} from "lucide-react";
import { levelService, type LevelType } from "@/lib/api/levels";
import { adminService } from "@/lib/api/admin";
import { toast } from "sonner";
import { LevelWizard } from "./level-wizard";
import { readableDate } from "@/lib/utils";

const SUBJECTS = [
  "Mathematics",
  "English",
  "Geography",
  "History",
  "Combined Science",
];

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

const ITEMS_PER_PAGE = 20;

export default function LevelsTab() {
  const [levels, setLevels] = useState<LevelType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({
    total: 0,
    quizzes: 0,
    questions: 0,
  });

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");

  // Sorting
  const [sortField, setSortField] = useState<
    "created_at" | "subject" | "level_number"
  >("level_number");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // Pagination (client-side since backend returns all)
  const [currentPage, setCurrentPage] = useState(1);

  // Wizard state
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<LevelType | null>(null);

  // Delete state
  const [deleteConfirmLevel, setDeleteConfirmLevel] =
    useState<LevelType | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchLevels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const subj = subjectFilter !== "all" ? subjectFilter : undefined;
      const data = await levelService.getLevels(subj);
      setLevels(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load levels";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [subjectFilter]);

  useEffect(() => {
    fetchLevels();
  }, [fetchLevels]);

  useEffect(() => {
    adminService
      .getOverview()
      .then((d) => {
        setMetrics({
          total: d.content.levels,
          quizzes: d.content.quizzes,
          questions: d.content.questions,
        });
      })
      .catch(() => {});
  }, []);

  // Filtering & sorting
  const filteredLevels = levels.filter((l) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        l.title.toLowerCase().includes(q) ||
        l.subject?.toLowerCase().includes(q) ||
        l.description?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const sortedLevels = [...filteredLevels].sort((a, b) => {
    let cmp = 0;
    if (sortField === "created_at") {
      cmp =
        new Date(a.created_at || 0).getTime() -
        new Date(b.created_at || 0).getTime();
    } else if (sortField === "subject") {
      cmp = (a.subject || "").localeCompare(b.subject || "");
    } else if (sortField === "level_number") {
      cmp = (a.level_number ?? 0) - (b.level_number ?? 0);
    }
    return sortDir === "asc" ? cmp : -cmp;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(sortedLevels.length / ITEMS_PER_PAGE),
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLevels = sortedLevels.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, subjectFilter, sortField, sortDir]);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const openCreate = () => {
    setEditingLevel(null);
    setWizardOpen(true);
  };

  const openEdit = (level: LevelType) => {
    setEditingLevel(level);
    setWizardOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteConfirmLevel) return;
    setDeleting(true);
    try {
      await levelService.deleteLevel(deleteConfirmLevel._id);
      toast.success("Level deleted successfully");
      setDeleteConfirmLevel(null);
      fetchLevels();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete level",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Structured learning paths containing multiple quizzes.
        </p>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4 mr-1.5" /> Create Level
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <MetricCard
          icon={Layers}
          label="Total Levels"
          value={loading ? "—" : String(metrics.total)}
          color="primary"
        />
        <MetricCard
          icon={HelpCircle}
          label="Total Quizzes"
          value={loading ? "—" : String(metrics.quizzes)}
          color="chart-2"
        />
        <MetricCard
          icon={FileQuestion}
          label="Total Questions"
          value={loading ? "—" : metrics.questions.toLocaleString()}
          color="chart-5"
        />
      </div>

      {/* Table Card */}
      <Card className="rounded-xl">
        <CardHeader className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-sm font-medium text-foreground">
              All Levels
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search levels..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-8 pl-9 pr-3 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="h-8 w-40 bg-secondary border-border text-xs">
                  <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">All Subjects</SelectItem>
                  {SUBJECTS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertTriangle className="h-8 w-8 text-destructive mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">
                Failed to load levels
              </p>
              <p className="text-xs text-muted-foreground mb-3">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchLevels}>
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead
                        className="text-muted-foreground font-medium text-xs cursor-pointer select-none"
                        onClick={() => toggleSort("level_number")}
                      >
                        <div className="flex items-center gap-1">
                          Level Name
                          <ArrowUpDown
                            className={`h-3 w-3 ${sortField === "level_number" ? "text-primary" : ""}`}
                          />
                        </div>
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
                        Form
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs text-right">
                        Quizzes
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-xs text-right hidden md:table-cell">
                        XP Req.
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
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i} className="border-border">
                          {Array.from({ length: 8 }).map((_, j) => (
                            <TableCell key={j} className="py-2.5">
                              <div className="h-4 w-full bg-secondary rounded animate-pulse" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : paginatedLevels.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center py-8 text-muted-foreground text-sm"
                        >
                          {searchQuery || subjectFilter !== "all"
                            ? "No levels match your search or filter."
                            : "No levels yet. Create your first level."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedLevels.map((level) => (
                        <TableRow
                          key={level._id}
                          className="border-border group"
                        >
                          <TableCell className="py-2.5 font-medium text-foreground text-sm">
                            <div className="flex items-center gap-1.5">
                              {level.is_starter_level && (
                                <Star className="h-3.5 w-3.5 text-chart-3 flex-shrink-0" />
                              )}
                              {level.title}
                            </div>
                          </TableCell>
                          <TableCell className="py-2.5 text-muted-foreground text-sm hidden sm:table-cell">
                            {level.subject}
                          </TableCell>
                          <TableCell className="py-2.5 text-muted-foreground text-sm hidden sm:table-cell">
                            {level.form_level}
                          </TableCell>
                          <TableCell className="py-2.5 text-right text-foreground text-sm tabular-nums">
                            {level.quiz_ids?.length ?? 0}
                          </TableCell>
                          <TableCell className="py-2.5 text-right text-foreground text-sm tabular-nums hidden md:table-cell">
                            {(level.xp_required ?? 0).toLocaleString()}
                          </TableCell>
                          <TableCell className="py-2.5 hidden lg:table-cell">
                            <Badge
                              variant="secondary"
                              className={`text-[10px] px-1.5 py-0 ${
                                level.is_active
                                  ? "bg-chart-1/10 text-chart-1 border-chart-1/20"
                                  : "bg-muted text-muted-foreground border-border"
                              }`}
                            >
                              {level.is_active ? "active" : "inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-2.5 text-muted-foreground text-xs hidden lg:table-cell tabular-nums">
                            {level.created_at
                              ? readableDate(level.created_at)
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
                                  onClick={() => openEdit(level)}
                                >
                                  <Edit className="h-3.5 w-3.5 mr-2" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive cursor-pointer"
                                  onClick={() => setDeleteConfirmLevel(level)}
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
              {!loading && totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    Showing {sortedLevels.length === 0 ? 0 : startIndex + 1} to{" "}
                    {Math.min(startIndex + ITEMS_PER_PAGE, sortedLevels.length)}{" "}
                    of {sortedLevels.length} levels
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

      {/* Level Wizard (Create/Edit) */}
      <LevelWizard
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        editingLevel={editingLevel}
        onSaved={fetchLevels}
      />

      {/* Delete Confirmation */}
      <Dialog
        open={!!deleteConfirmLevel}
        onOpenChange={() => setDeleteConfirmLevel(null)}
      >
        <DialogContent className="bg-card border-border sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground">Delete Level</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this level? This action cannot be
              undone.
            </p>
            {deleteConfirmLevel && (
              <p className="text-sm text-foreground font-medium bg-secondary/50 p-2 rounded-lg truncate">
                &ldquo;{deleteConfirmLevel.title}&rdquo;
              </p>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDeleteConfirmLevel(null)}
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
