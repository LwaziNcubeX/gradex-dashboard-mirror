"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Search,
  Loader2,
  ChevronRight,
  ChevronLeft,
  GripVertical,
  Check,
  Save,
  X,
  AlertTriangle,
} from "lucide-react";
import {
  levelService,
  type LevelType,
  type CreateLevelPayload,
} from "@/lib/api/levels";
import { quizService, type QuizType } from "@/lib/api/quizzes";
import { toast } from "sonner";
import { debounce } from "@/lib/utils";

const SUBJECTS = [
  "Mathematics",
  "English",
  "Geography",
  "History",
  "Combined Science",
];
const FORM_LEVELS = ["Form 1", "Form 2", "Form 3", "Form 4"] as const;

const DRAFT_KEY = "gradex_level_draft";

// ─── Types ───────────────────────────────────────────────
interface LevelFormState {
  level_number: string;
  title: string;
  description: string;
  form_level: (typeof FORM_LEVELS)[number];
  subject: string;
  xp_required: string;
  total_xp_reward: string;
  is_starter_level: boolean;
}

interface WizardDraft {
  step: number;
  form: LevelFormState;
  selectedQuizIds: string[];
  timestamp: number;
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

// ─── Draft helpers ───────────────────────────────────────
function saveDraft(draft: WizardDraft) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {}
}

function loadDraft(): WizardDraft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw) as WizardDraft;
    if (Date.now() - draft.timestamp > 24 * 60 * 60 * 1000) {
      localStorage.removeItem(DRAFT_KEY);
      return null;
    }
    return draft;
  } catch {
    return null;
  }
}

function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {}
}

// ─── Step Indicator ──────────────────────────────────────
function StepIndicator({
  currentStep,
  steps,
}: {
  currentStep: number;
  steps: string[];
}) {
  return (
    <div className="flex items-center gap-1 px-1 pb-3">
      {steps.map((label, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isDone = step < currentStep;
        return (
          <div key={label} className="flex items-center gap-1 flex-1">
            <div
              className={`flex items-center justify-center h-7 w-7 rounded-full text-xs font-semibold flex-shrink-0 transition-colors ${
                isDone
                  ? "bg-chart-1 text-white"
                  : isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
              }`}
            >
              {isDone ? <Check className="h-3.5 w-3.5" /> : step}
            </div>
            <span
              className={`text-xs truncate ${isActive ? "text-foreground font-medium" : "text-muted-foreground"}`}
            >
              {label}
            </span>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-px mx-1 ${isDone ? "bg-chart-1" : "bg-border"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Level Wizard ──────────────────────────────────
interface LevelWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingLevel?: LevelType | null;
  onSaved: () => void;
}

export function LevelWizard({
  open,
  onOpenChange,
  editingLevel,
  onSaved,
}: LevelWizardProps) {
  const [step, setStep] = useState(1);
  const [formState, setFormState] = useState<LevelFormState>(DEFAULT_FORM);
  const [selectedQuizzes, setSelectedQuizzes] = useState<QuizType[]>([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Confirmation dialog
  const [showConfirm, setShowConfirm] = useState(false);

  // Step 2: quiz search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<QuizType[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchSubjectFilter, setSearchSubjectFilter] = useState<string>("all");
  const [searchLevelFilter, setSearchLevelFilter] = useState<string>("all");

  // Draft auto-save
  const autoSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load on open
  useEffect(() => {
    if (!open) return;
    if (editingLevel) {
      setFormState({
        level_number: String(editingLevel.level_number),
        title: editingLevel.title,
        description: editingLevel.description || "",
        form_level: editingLevel.form_level,
        subject: editingLevel.subject,
        xp_required: String(editingLevel.xp_required ?? 0),
        total_xp_reward: String(editingLevel.total_xp_reward ?? 200),
        is_starter_level: editingLevel.is_starter_level ?? false,
      });
      if (editingLevel.quiz_ids?.length) {
        loadExistingQuizzes(editingLevel.quiz_ids);
      }
      setStep(1);
    } else {
      const draft = loadDraft();
      if (draft) {
        setFormState(draft.form);
        setStep(draft.step);
        if (draft.selectedQuizIds.length > 0) {
          loadExistingQuizzes(draft.selectedQuizIds);
        }
        toast.info("Draft restored");
      } else {
        setFormState(DEFAULT_FORM);
        setSelectedQuizzes([]);
        setStep(1);
      }
    }
    setSearchQuery("");
    setSearchResults([]);
    setErrors({});
    setShowConfirm(false);
  }, [open, editingLevel]);

  // Auto-save
  useEffect(() => {
    if (!open || editingLevel) return;
    if (autoSaveRef.current) clearInterval(autoSaveRef.current);
    autoSaveRef.current = setInterval(() => {
      if (formState.title.trim() || selectedQuizzes.length > 0) {
        saveDraft({
          step,
          form: formState,
          selectedQuizIds: selectedQuizzes.map((q) => q._id),
          timestamp: Date.now(),
        });
      }
    }, 5000);
    return () => {
      if (autoSaveRef.current) clearInterval(autoSaveRef.current);
    };
  }, [open, editingLevel, step, formState, selectedQuizzes]);

  async function loadExistingQuizzes(ids: string[]) {
    try {
      const quizzes = await Promise.all(
        ids.map((id) => quizService.getQuiz(id).catch(() => null)),
      );
      setSelectedQuizzes(quizzes.filter((q): q is QuizType => q !== null));
    } catch {}
  }

  // Debounced search
  const debouncedSearch = useCallback(
    debounce(async (query: string, subject: string, level: string) => {
      if (!query.trim() && subject === "all" && level === "all") {
        setSearchResults([]);
        return;
      }
      setSearching(true);
      try {
        const results = query.trim()
          ? await quizService.searchQuizzes(query, {
              subject: subject !== "all" ? subject : undefined,
              level: level !== "all" ? level : undefined,
            })
          : (
              await quizService.fetchQuizzes({
                subject: subject !== "all" ? subject : undefined,
                level: level !== "all" ? level : undefined,
                page_size: 50,
              })
            ).data;
        setSearchResults(results);
      } catch {
        toast.error("Search failed");
      } finally {
        setSearching(false);
      }
    }, 400),
    [],
  );

  useEffect(() => {
    if (step === 2) {
      debouncedSearch(searchQuery, searchSubjectFilter, searchLevelFilter);
    }
  }, [
    searchQuery,
    searchSubjectFilter,
    searchLevelFilter,
    step,
    debouncedSearch,
  ]);

  const toggleQuiz = (quiz: QuizType) => {
    setSelectedQuizzes((prev) => {
      const exists = prev.find((q) => q._id === quiz._id);
      if (exists) return prev.filter((q) => q._id !== quiz._id);
      return [...prev, quiz];
    });
  };

  const removeQuiz = (id: string) => {
    setSelectedQuizzes((prev) => prev.filter((q) => q._id !== id));
  };

  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formState.title.trim()) errs.title = "Title is required";
    if (
      !editingLevel &&
      (!formState.level_number || Number(formState.level_number) < 1)
    ) {
      errs.level_number = "Level number must be at least 1";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (!validateStep1()) return;
    }
    setStep((s) => s + 1);
  };

  const handleConfirmSubmit = () => {
    setShowConfirm(true);
  };

  const handleSubmit = async () => {
    setShowConfirm(false);
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
          quiz_ids: selectedQuizzes.map((q) => q._id),
        };
        await levelService.updateLevel(editingLevel._id, payload);
        toast.success("Level updated successfully");
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
          quiz_ids: selectedQuizzes.map((q) => q._id),
        };
        await levelService.createLevel(payload);
        toast.success("Level created successfully");
        clearDraft();
      }
      onOpenChange(false);
      onSaved();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save level");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = () => {
    saveDraft({
      step,
      form: formState,
      selectedQuizIds: selectedQuizzes.map((q) => q._id),
      timestamp: Date.now(),
    });
    toast.success("Draft saved");
  };

  const canProceedStep1 = formState.title.trim().length > 0;
  const STEPS = ["Basic Info", "Quizzes", "Review"];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-card border-border sm:max-w-2xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground">
              {editingLevel ? "Edit Level" : "Create Level"}
            </DialogTitle>
          </DialogHeader>

          <StepIndicator currentStep={step} steps={STEPS} />

          <div className="flex-1 overflow-y-auto min-h-0 px-1">
            {/* ─── Step 1: Basic Info ─── */}
            {step === 1 && (
              <div className="flex flex-col gap-4">
                {!editingLevel && (
                  <div>
                    <Label className="text-sm text-foreground font-medium mb-1.5 block">
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
                    {errors.level_number && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />{" "}
                        {errors.level_number}
                      </p>
                    )}
                  </div>
                )}
                <div>
                  <Label className="text-sm text-foreground font-medium mb-1.5 block">
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
                  {errors.title && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> {errors.title}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-sm text-foreground font-medium mb-1.5 block">
                    Description
                  </Label>
                  <textarea
                    value={formState.description}
                    onChange={(e) =>
                      setFormState((p) => ({
                        ...p,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Short description..."
                    rows={2}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
                {!editingLevel && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm text-foreground font-medium mb-1.5 block">
                        Subject *
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
                      <Label className="text-sm text-foreground font-medium mb-1.5 block">
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
                    <Label className="text-sm text-foreground font-medium mb-1.5 block">
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
                    <Label className="text-sm text-foreground font-medium mb-1.5 block">
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
                  <Checkbox
                    id="starter"
                    checked={formState.is_starter_level}
                    onCheckedChange={(c) =>
                      setFormState((p) => ({ ...p, is_starter_level: !!c }))
                    }
                  />
                  <Label
                    htmlFor="starter"
                    className="text-sm text-foreground cursor-pointer"
                  >
                    Starter level (auto-unlocked for students)
                  </Label>
                </div>
              </div>
            )}

            {/* ─── Step 2: Quizzes ─── */}
            {step === 2 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {selectedQuizzes.length} quiz
                    {selectedQuizzes.length !== 1 ? "zes" : ""} selected
                  </p>
                </div>

                {/* Search bar */}
                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search quizzes by title..."
                      className="bg-secondary border-border h-9 text-sm pl-9"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={searchSubjectFilter}
                      onValueChange={setSearchSubjectFilter}
                    >
                      <SelectTrigger className="bg-secondary border-border h-8 text-xs flex-1">
                        <SelectValue placeholder="Subject" />
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
                    <Select
                      value={searchLevelFilter}
                      onValueChange={setSearchLevelFilter}
                    >
                      <SelectTrigger className="bg-secondary border-border h-8 text-xs flex-1">
                        <SelectValue placeholder="Level" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="all">All Levels</SelectItem>
                        {FORM_LEVELS.map((l) => (
                          <SelectItem key={l} value={l}>
                            {l}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Search results */}
                <div className="flex flex-col gap-1.5 max-h-[250px] overflow-y-auto">
                  {searching ? (
                    <div className="flex justify-center py-6">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((q) => {
                      const isSelected = selectedQuizzes.some(
                        (sq) => sq._id === q._id,
                      );
                      return (
                        <div
                          key={q._id}
                          className={`flex items-start gap-2.5 p-2.5 rounded-lg cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-primary/10 border border-primary/30"
                              : "bg-secondary/50 hover:bg-secondary border border-transparent"
                          }`}
                          onClick={() => toggleQuiz(q)}
                        >
                          <Checkbox
                            checked={isSelected}
                            className="mt-0.5 h-4 w-4"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground leading-snug truncate">
                              {q.title}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <Badge
                                variant="secondary"
                                className="text-[10px] px-1.5 py-0"
                              >
                                {q.subject}
                              </Badge>
                              <Badge
                                variant="secondary"
                                className="text-[10px] px-1.5 py-0"
                              >
                                {q.level}
                              </Badge>
                              <span className="text-[10px] text-muted-foreground">
                                {q.questions?.length ?? 0} Qs
                              </span>
                            </div>
                          </div>
                          {isSelected && (
                            <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          )}
                        </div>
                      );
                    })
                  ) : searchQuery.trim() ||
                    searchSubjectFilter !== "all" ||
                    searchLevelFilter !== "all" ? (
                    <p className="text-sm text-muted-foreground text-center py-6">
                      No quizzes found.
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-6">
                      Search for quizzes to add to this level.
                    </p>
                  )}
                </div>

                {/* Selected list */}
                {selectedQuizzes.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Selected ({selectedQuizzes.length})
                    </p>
                    <div className="flex flex-col gap-1.5 max-h-[150px] overflow-y-auto">
                      {selectedQuizzes.map((q, i) => (
                        <div
                          key={q._id}
                          className="flex items-center gap-2 p-2 bg-secondary/50 rounded-lg"
                        >
                          <GripVertical className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                          <span className="text-xs text-muted-foreground w-5 flex-shrink-0 tabular-nums">
                            {i + 1}.
                          </span>
                          <p className="text-sm text-foreground flex-1 truncate">
                            {q.title}
                          </p>
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {q.questions?.length ?? 0} Qs
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeQuiz(q._id)}
                          >
                            <X className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─── Step 3: Review ─── */}
            {step === 3 && (
              <div className="flex flex-col gap-4">
                <Card className="rounded-lg bg-secondary/30 border-border/50">
                  <CardContent className="p-4 flex flex-col gap-2.5">
                    {!editingLevel && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Level #
                        </span>
                        <span className="text-sm font-medium text-foreground tabular-nums">
                          {formState.level_number}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Title
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {formState.title}
                      </span>
                    </div>
                    {formState.description && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Description
                        </span>
                        <span className="text-sm text-foreground max-w-[60%] text-right">
                          {formState.description}
                        </span>
                      </div>
                    )}
                    {!editingLevel && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Subject
                          </span>
                          <Badge
                            variant="secondary"
                            className="text-xs px-2 py-0.5"
                          >
                            {formState.subject}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Form Level
                          </span>
                          <Badge
                            variant="secondary"
                            className="text-xs px-2 py-0.5"
                          >
                            {formState.form_level}
                          </Badge>
                        </div>
                      </>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        XP Required
                      </span>
                      <span className="text-sm text-foreground tabular-nums">
                        {Number(formState.xp_required).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        XP Reward
                      </span>
                      <span className="text-sm font-medium text-foreground tabular-nums">
                        {Number(formState.total_xp_reward).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Type
                      </span>
                      <Badge
                        variant="secondary"
                        className="text-xs px-2 py-0.5"
                      >
                        {formState.is_starter_level ? "Starter" : "Standard"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Quizzes ({selectedQuizzes.length})
                  </p>
                  {selectedQuizzes.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6 bg-secondary/30 rounded-lg">
                      No quizzes attached. You can still save without quizzes.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-1.5 max-h-[200px] overflow-y-auto">
                      {selectedQuizzes.map((q, i) => (
                        <div
                          key={q._id}
                          className="flex items-start gap-2 p-2.5 bg-secondary/30 rounded-lg"
                        >
                          <span className="text-xs text-muted-foreground mt-0.5 w-5 flex-shrink-0 tabular-nums">
                            {i + 1}.
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground leading-snug">
                              {q.title}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <Badge
                                variant="secondary"
                                className="text-[10px] px-1.5 py-0"
                              >
                                {q.subject}
                              </Badge>
                              <span className="text-[10px] text-muted-foreground">
                                {q.questions?.length ?? 0} questions
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex items-center justify-between gap-2 border-t border-border pt-3 mt-2">
            <div className="flex items-center gap-2">
              {step > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep((s) => s - 1)}
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Back
                </Button>
              )}
              {!editingLevel && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-8"
                  onClick={handleSaveDraft}
                >
                  <Save className="h-3.5 w-3.5 mr-1" /> Save Draft
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              {step < 3 ? (
                <Button
                  size="sm"
                  onClick={handleNext}
                  disabled={step === 1 && !canProceedStep1}
                >
                  Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={handleConfirmSubmit}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                  ) : null}
                  {editingLevel ? "Save Changes" : "Create Level"}
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="bg-card border-border sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingLevel ? "Confirm Update" : "Confirm Creation"}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {editingLevel
              ? `Are you sure you want to update "${formState.title}"? This will overwrite the existing level.`
              : `Are you sure you want to create level "${formState.title}" with ${selectedQuizzes.length} quiz${selectedQuizzes.length !== 1 ? "zes" : ""}?`}
          </p>
          <DialogFooter className="gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowConfirm(false)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
              {editingLevel ? "Update Level" : "Create Level"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
