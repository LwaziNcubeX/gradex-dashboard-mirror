"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Layers,
  FileQuestion,
  HelpCircle,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Star,
  Loader2,
} from "lucide-react";
import {
  levelService,
  type LevelType,
  type CreateLevelPayload,
} from "@/lib/api/levels";
import { adminService } from "@/lib/api/admin";
import { toast } from "sonner";

const SUBJECTS = [
  "Mathematics",
  "English",
  "Geography",
  "History",
  "Combined Science",
];
const FORM_LEVELS = ["Form 1", "Form 2", "Form 3", "Form 4"] as const;

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

interface LevelFormState {
  level_number: string;
  title: string;
  description: string;
  form_level: "Form 1" | "Form 2" | "Form 3" | "Form 4";
  subject: string;
  xp_required: string;
  total_xp_reward: string;
  is_starter_level: boolean;
}

const DEFAULT_FORM: LevelFormState = {
  level_number: "1",
  title: "",
  description: "",
  form_level: "Form 1",
  subject: "Mathematics",
  xp_required: "0",
  total_xp_reward: "200",
  is_starter_level: false,
};

export default function LevelsTab() {
  const [levels, setLevels] = useState<LevelType[]>([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    total: 0,
    quizzes: 0,
    questions: 0,
  });

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<LevelType | null>(null);
  const [formState, setFormState] = useState<LevelFormState>(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchLevels = useCallback(async () => {
    setLoading(true);
    try {
      const data = await levelService.getLevels();
      setLevels(data);
    } catch {
      toast.error("Failed to load levels");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLevels();
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
  }, [fetchLevels]);

  const openCreate = () => {
    setEditingLevel(null);
    setFormState(DEFAULT_FORM);
    setDialogOpen(true);
  };

  const openEdit = (level: LevelType) => {
    setEditingLevel(level);
    setFormState({
      level_number: String(level.level_number),
      title: level.title,
      description: level.description || "",
      form_level: level.form_level,
      subject: level.subject,
      xp_required: String(level.xp_required ?? 0),
      total_xp_reward: String(level.total_xp_reward ?? 200),
      is_starter_level: level.is_starter_level ?? false,
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
      if (editingLevel) {
        const payload: Partial<CreateLevelPayload> = {
          title: formState.title.trim(),
          description: formState.description.trim() || undefined,
          xp_required: Number(formState.xp_required) || 0,
          total_xp_reward: Number(formState.total_xp_reward) || 200,
          is_starter_level: formState.is_starter_level,
        };
        await levelService.updateLevel(editingLevel._id, payload);
        toast.success("Level updated");
      } else {
        const payload: CreateLevelPayload = {
          level_number: Number(formState.level_number) || 1,
          title: formState.title.trim(),
          description: formState.description.trim() || undefined,
          form_level: formState.form_level,
          subject: formState.subject,
          xp_required: Number(formState.xp_required) || 0,
          total_xp_reward: Number(formState.total_xp_reward) || 200,
          is_starter_level: formState.is_starter_level,
        };
        await levelService.createLevel(payload);
        toast.success("Level created");
      }
      setDialogOpen(false);
      fetchLevels();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save level");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await levelService.deleteLevel(id);
      toast.success("Level deleted");
      setDeleteConfirmId(null);
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
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Structured learning paths containing multiple quizzes.
        </p>
        <Button
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={openCreate}
        >
          <Plus className="h-4 w-4 mr-1.5" /> Create Level
        </Button>
      </div>

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

      <Card className="rounded-xl">
        <CardHeader className="px-4 pt-4 pb-3">
          <CardTitle className="text-sm font-medium text-foreground">
            All Levels
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-medium text-xs">
                    Level Name
                  </TableHead>
                  <TableHead className="text-muted-foreground font-medium text-xs hidden sm:table-cell">
                    Subject
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
                  <TableHead className="w-8" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="border-border">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <TableCell key={j} className="py-2.5">
                          <div className="h-4 w-full bg-secondary rounded animate-pulse" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : levels.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground text-sm"
                    >
                      No levels found
                    </TableCell>
                  </TableRow>
                ) : (
                  levels.map((level) => (
                    <TableRow key={level._id} className="border-border group">
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
                              onClick={() => setDeleteConfirmId(level._id)}
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
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingLevel ? "Edit Level" : "Create Level"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-2">
            {!editingLevel && (
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">
                  Level Number *
                </Label>
                <Input
                  type="number"
                  value={formState.level_number}
                  onChange={(e) =>
                    setFormState((p) => ({
                      ...p,
                      level_number: e.target.value,
                    }))
                  }
                  placeholder="1"
                  className="bg-secondary border-border h-9 text-sm"
                />
              </div>
            )}
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Title *
              </Label>
              <Input
                value={formState.title}
                onChange={(e) =>
                  setFormState((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="e.g. Math Fundamentals"
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
                  setFormState((p) => ({
                    ...p,
                    description: e.target.value,
                  }))
                }
                placeholder="Short description..."
                className="bg-secondary border-border h-9 text-sm"
              />
            </div>
            {!editingLevel && (
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
                    value={formState.form_level}
                    onValueChange={(v) =>
                      setFormState((p) => ({
                        ...p,
                        form_level: v as (typeof FORM_LEVELS)[number],
                      }))
                    }
                  >
                    <SelectTrigger className="bg-secondary border-border h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {FORM_LEVELS.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">
                  XP Required
                </Label>
                <Input
                  type="number"
                  value={formState.xp_required}
                  onChange={(e) =>
                    setFormState((p) => ({
                      ...p,
                      xp_required: e.target.value,
                    }))
                  }
                  placeholder="0"
                  className="bg-secondary border-border h-9 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">
                  XP Reward
                </Label>
                <Input
                  type="number"
                  value={formState.total_xp_reward}
                  onChange={(e) =>
                    setFormState((p) => ({
                      ...p,
                      total_xp_reward: e.target.value,
                    }))
                  }
                  placeholder="200"
                  className="bg-secondary border-border h-9 text-sm"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="starter"
                checked={formState.is_starter_level}
                onChange={(e) =>
                  setFormState((p) => ({
                    ...p,
                    is_starter_level: e.target.checked,
                  }))
                }
                className="rounded border-border"
              />
              <Label
                htmlFor="starter"
                className="text-sm text-foreground cursor-pointer"
              >
                Starter level (auto-unlocked)
              </Label>
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
              {editingLevel ? "Save Changes" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={!!deleteConfirmId}
        onOpenChange={() => setDeleteConfirmId(null)}
      >
        <DialogContent className="bg-card border-border sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground">Delete Level</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this level? This action cannot be
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
