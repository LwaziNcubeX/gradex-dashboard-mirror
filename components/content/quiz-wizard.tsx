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
  Plus,
  X,
  ChevronRight,
  ChevronLeft,
  GripVertical,
  Check,
  Save,
  AlertTriangle,
} from "lucide-react";
import {
  quizService,
  type QuizType,
  type CreateQuizPayload,
} from "@/lib/api/quizzes";
import {
  questionService,
  type CreateQuestionPayload,
} from "@/lib/api/questions";
import { QuestionType } from "@/constants/types";
import { toast } from "sonner";
import { debounce } from "@/lib/utils";

const SUBJECTS = [
  "Mathematics",
  "English",
  "Geography",
  "History",
  "Combined Science",
];
const LEVELS = ["Form 1", "Form 2", "Form 3", "Form 4"] as const;

const DRAFT_KEY = "gradex_quiz_draft";

// ─── Types ───────────────────────────────────────────────
interface QuizFormState {
  title: string;
  description: string;
  subject: string;
  level: (typeof LEVELS)[number];
  duration: string;
  xp_reward: string;
}

interface NewQuestionForm {
  question_text: string;
  answers: string[];
  correct_answer: string;
  subject: string;
  difficulty: (typeof LEVELS)[number];
  explanation: string;
}

interface WizardDraft {
  step: number;
  form: QuizFormState;
  selectedQuestionIds: string[];
  timestamp: number;
}

const DEFAULT_FORM: QuizFormState = {
  title: "",
  description: "",
  subject: "Mathematics",
  level: "Form 1",
  duration: "600",
  xp_reward: "50",
};

const DEFAULT_NEW_QUESTION: NewQuestionForm = {
  question_text: "",
  answers: ["", "", "", ""],
  correct_answer: "",
  subject: "Mathematics",
  difficulty: "Form 1",
  explanation: "",
};

// ─── Helpers ─────────────────────────────────────────────
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

// ─── Main Wizard Component ──────────────────────────────
interface QuizWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingQuiz?: QuizType | null;
  onSaved: () => void;
}

export function QuizWizard({
  open,
  onOpenChange,
  editingQuiz,
  onSaved,
}: QuizWizardProps) {
  const [step, setStep] = useState(1);
  const [formState, setFormState] = useState<QuizFormState>(DEFAULT_FORM);
  const [selectedQuestions, setSelectedQuestions] = useState<QuestionType[]>([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Confirmation dialog
  const [showConfirm, setShowConfirm] = useState(false);

  // Step 2: question search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<QuestionType[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchSubjectFilter, setSearchSubjectFilter] = useState<string>("all");
  const [searchLevelFilter, setSearchLevelFilter] = useState<string>("all");

  // Step 2: inline new question
  const [showNewQuestion, setShowNewQuestion] = useState(false);
  const [newQuestionForm, setNewQuestionForm] =
    useState<NewQuestionForm>(DEFAULT_NEW_QUESTION);
  const [creatingQuestion, setCreatingQuestion] = useState(false);

  // Draft auto-save ref
  const autoSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load draft or editing quiz on open
  useEffect(() => {
    if (!open) return;
    if (editingQuiz) {
      setFormState({
        title: editingQuiz.title,
        description: editingQuiz.description || "",
        subject: editingQuiz.subject,
        level: editingQuiz.level,
        duration: String(editingQuiz.duration || 600),
        xp_reward: String(editingQuiz.xp_reward || 50),
      });
      if (editingQuiz.questions?.length) {
        loadExistingQuestions(editingQuiz.questions);
      }
      setStep(1);
    } else {
      const draft = loadDraft();
      if (draft) {
        setFormState(draft.form);
        setStep(draft.step);
        if (draft.selectedQuestionIds.length > 0) {
          loadExistingQuestions(draft.selectedQuestionIds);
        }
        toast.info("Draft restored");
      } else {
        setFormState(DEFAULT_FORM);
        setSelectedQuestions([]);
        setStep(1);
      }
    }
    setSearchQuery("");
    setSearchResults([]);
    setShowNewQuestion(false);
    setErrors({});
    setShowConfirm(false);
  }, [open, editingQuiz]);

  // Auto-save draft every 5 seconds (only for new quizzes)
  useEffect(() => {
    if (!open || editingQuiz) return;
    if (autoSaveRef.current) clearInterval(autoSaveRef.current);
    autoSaveRef.current = setInterval(() => {
      if (formState.title.trim() || selectedQuestions.length > 0) {
        saveDraft({
          step,
          form: formState,
          selectedQuestionIds: selectedQuestions.map((q) => q._id),
          timestamp: Date.now(),
        });
      }
    }, 5000);
    return () => {
      if (autoSaveRef.current) clearInterval(autoSaveRef.current);
    };
  }, [open, editingQuiz, step, formState, selectedQuestions]);

  async function loadExistingQuestions(ids: string[]) {
    try {
      const questions = await Promise.all(
        ids.map((id) => questionService.getQuestion(id).catch(() => null)),
      );
      setSelectedQuestions(
        questions.filter((q): q is QuestionType => q !== null),
      );
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
        const filters: Record<string, string> = {};
        if (subject !== "all") filters.subject = subject;
        if (level !== "all") filters.difficulty = level;
        const results = query.trim()
          ? await questionService.searchQuestions(query, filters)
          : await questionService.fetchQuestions(
              filters as import("@/lib/api/questions").QuestionFilters,
            );
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
  }, [searchQuery, searchSubjectFilter, searchLevelFilter, step, debouncedSearch]);

  const toggleQuestion = (question: QuestionType) => {
    setSelectedQuestions((prev) => {
      const exists = prev.find((q) => q._id === question._id);
      if (exists) return prev.filter((q) => q._id !== question._id);
      return [...prev, question];
    });
  };

  const removeQuestion = (id: string) => {
    setSelectedQuestions((prev) => prev.filter((q) => q._id !== id));
  };

  const handleCreateInlineQuestion = async () => {
    if (!newQuestionForm.question_text.trim()) {
      toast.error("Question text is required");
      return;
    }
    const validAnswers = newQuestionForm.answers.filter((a) => a.trim());
    if (validAnswers.length < 2) {
      toast.error("At least 2 answers required");
      return;
    }
    if (!newQuestionForm.correct_answer) {
      toast.error("Select a correct answer");
      return;
    }
    setCreatingQuestion(true);
    try {
      const payload: CreateQuestionPayload = {
        question_text: newQuestionForm.question_text.trim(),
        answers: validAnswers,
        correct_answer: newQuestionForm.correct_answer,
        subject: newQuestionForm.subject,
        difficulty: newQuestionForm.difficulty,
        explanation: newQuestionForm.explanation.trim() || undefined,
        status: "active",
      };
      const created = await questionService.createQuestion(payload);
      setSelectedQuestions((prev) => [...prev, created]);
      setNewQuestionForm(DEFAULT_NEW_QUESTION);
      setShowNewQuestion(false);
      toast.success("Question created & added");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create question",
      );
    } finally {
      setCreatingQuestion(false);
    }
  };

  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formState.title.trim()) errs.title = "Title is required";
    if (!formState.subject) errs.subject = "Subject is required";
    if (Number(formState.duration) < 30) errs.duration = "Duration must be at least 30 seconds";
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
      const payload: CreateQuizPayload = {
        title: formState.title.trim(),
        description: formState.description.trim() || undefined,
        subject: formState.subject,
        level: formState.level,
        duration: Number(formState.duration) || 600,
        xp_reward: Number(formState.xp_reward) || 50,
        questions: selectedQuestions.map((q) => q._id),
        is_active: true,
      };
      if (editingQuiz) {
        await quizService.updateQuiz(editingQuiz._id, payload);
        toast.success("Quiz updated successfully");
      } else {
        await quizService.createQuiz(payload);
        toast.success("Quiz created successfully");
        clearDraft();
      }
      onOpenChange(false);
      onSaved();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save quiz");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = () => {
    saveDraft({
      step,
      form: formState,
      selectedQuestionIds: selectedQuestions.map((q) => q._id),
      timestamp: Date.now(),
    });
    toast.success("Draft saved");
  };

  const canProceedStep1 = formState.title.trim().length > 0;
  const STEPS = ["Basic Info", "Questions", "Review"];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-card border-border sm:max-w-2xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground">
              {editingQuiz ? "Edit Quiz" : "Create Quiz"}
            </DialogTitle>
          </DialogHeader>

          <StepIndicator currentStep={step} steps={STEPS} />

          <div className="flex-1 overflow-y-auto min-h-0 px-1">
            {/* ─── Step 1: Basic Info ─── */}
            {step === 1 && (
              <div className="flex flex-col gap-4">
                <div>
                  <Label className="text-sm text-foreground font-medium mb-1.5 block">
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
                      setFormState((p) => ({ ...p, description: e.target.value }))
                    }
                    placeholder="Brief quiz description..."
                    rows={2}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm text-foreground font-medium mb-1.5 block">
                      Subject *
                    </Label>
                    <Select
                      value={formState.subject}
                      onValueChange={(v) => setFormState((p) => ({ ...p, subject: v }))}
                    >
                      <SelectTrigger className="bg-secondary border-border h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {SUBJECTS.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm text-foreground font-medium mb-1.5 block">
                      Form Level
                    </Label>
                    <Select
                      value={formState.level}
                      onValueChange={(v) =>
                        setFormState((p) => ({ ...p, level: v as (typeof LEVELS)[number] }))
                      }
                    >
                      <SelectTrigger className="bg-secondary border-border h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {LEVELS.map((l) => (
                          <SelectItem key={l} value={l}>{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm text-foreground font-medium mb-1.5 block">
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
                    {errors.duration && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> {errors.duration}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm text-foreground font-medium mb-1.5 block">
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
            )}

            {/* ─── Step 2: Questions ─── */}
            {step === 2 && (
              <div className="flex flex-col gap-3">
                {/* Selected questions summary */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {selectedQuestions.length} question
                    {selectedQuestions.length !== 1 ? "s" : ""} selected
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs"
                    onClick={() => {
                      setShowNewQuestion(true);
                      setNewQuestionForm({
                        ...DEFAULT_NEW_QUESTION,
                        subject: formState.subject,
                        difficulty: formState.level,
                      });
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" /> Create New
                  </Button>
                </div>

                {/* Inline create question */}
                {showNewQuestion && (
                  <Card className="rounded-lg border-primary/30 bg-primary/5">
                    <CardContent className="p-3 flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">
                          New Question
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => setShowNewQuestion(false)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <Input
                        value={newQuestionForm.question_text}
                        onChange={(e) =>
                          setNewQuestionForm((p) => ({
                            ...p,
                            question_text: e.target.value,
                          }))
                        }
                        placeholder="Question text..."
                        className="bg-secondary border-border h-9 text-sm"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        {newQuestionForm.answers.map((ans, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <Checkbox
                              checked={newQuestionForm.correct_answer === ans && ans !== ""}
                              onCheckedChange={() =>
                                setNewQuestionForm((p) => ({ ...p, correct_answer: ans }))
                              }
                              disabled={!ans.trim()}
                              className="h-4 w-4"
                            />
                            <Input
                              value={ans}
                              onChange={(e) => {
                                const updated = [...newQuestionForm.answers];
                                updated[i] = e.target.value;
                                setNewQuestionForm((p) => ({
                                  ...p,
                                  answers: updated,
                                  correct_answer:
                                    p.correct_answer === ans
                                      ? e.target.value
                                      : p.correct_answer,
                                }));
                              }}
                              placeholder={`Option ${String.fromCharCode(65 + i)}`}
                              className="bg-secondary border-border h-8 text-sm flex-1"
                            />
                          </div>
                        ))}
                      </div>
                      <Input
                        value={newQuestionForm.explanation}
                        onChange={(e) =>
                          setNewQuestionForm((p) => ({
                            ...p,
                            explanation: e.target.value,
                          }))
                        }
                        placeholder="Explanation (optional)"
                        className="bg-secondary border-border h-8 text-sm"
                      />
                      <div className="flex gap-2">
                        <Select
                          value={newQuestionForm.subject}
                          onValueChange={(v) =>
                            setNewQuestionForm((p) => ({ ...p, subject: v }))
                          }
                        >
                          <SelectTrigger className="bg-secondary border-border h-8 text-xs flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            {SUBJECTS.map((s) => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          value={newQuestionForm.difficulty}
                          onValueChange={(v) =>
                            setNewQuestionForm((p) => ({
                              ...p,
                              difficulty: v as (typeof LEVELS)[number],
                            }))
                          }
                        >
                          <SelectTrigger className="bg-secondary border-border h-8 text-xs flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            {LEVELS.map((l) => (
                              <SelectItem key={l} value={l}>{l}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        size="sm"
                        className="h-8 text-xs w-full"
                        onClick={handleCreateInlineQuestion}
                        disabled={creatingQuestion}
                      >
                        {creatingQuestion ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                        ) : (
                          <Plus className="h-3.5 w-3.5 mr-1" />
                        )}
                        Add Question
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Search bar */}
                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search questions by text..."
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
                          <SelectItem key={s} value={s}>{s}</SelectItem>
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
                        {LEVELS.map((l) => (
                          <SelectItem key={l} value={l}>{l}</SelectItem>
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
                      const isSelected = selectedQuestions.some(
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
                          onClick={() => toggleQuestion(q)}
                        >
                          <Checkbox
                            checked={isSelected}
                            className="mt-0.5 h-4 w-4"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground leading-snug truncate">
                              {q.question_text}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                {q.subject}
                              </Badge>
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                {q.difficulty}
                              </Badge>
                            </div>
                          </div>
                          {isSelected && (
                            <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          )}
                        </div>
                      );
                    })
                  ) : searchQuery.trim() || searchSubjectFilter !== "all" || searchLevelFilter !== "all" ? (
                    <p className="text-sm text-muted-foreground text-center py-6">
                      No questions found. Try creating a new one.
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-6">
                      Search for existing questions or create new ones above.
                    </p>
                  )}
                </div>

                {/* Selected list */}
                {selectedQuestions.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Selected ({selectedQuestions.length})
                    </p>
                    <div className="flex flex-col gap-1.5 max-h-[150px] overflow-y-auto">
                      {selectedQuestions.map((q, i) => (
                        <div
                          key={q._id}
                          className="flex items-center gap-2 p-2 bg-secondary/50 rounded-lg"
                        >
                          <GripVertical className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                          <span className="text-xs text-muted-foreground w-5 flex-shrink-0 tabular-nums">
                            {i + 1}.
                          </span>
                          <p className="text-sm text-foreground flex-1 truncate">
                            {q.question_text}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeQuestion(q._id)}
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
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Title</span>
                      <span className="text-sm font-medium text-foreground">
                        {formState.title}
                      </span>
                    </div>
                    {formState.description && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Description</span>
                        <span className="text-sm text-foreground max-w-[60%] text-right">
                          {formState.description}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Subject</span>
                      <Badge variant="secondary" className="text-xs px-2 py-0.5">
                        {formState.subject}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Level</span>
                      <Badge variant="secondary" className="text-xs px-2 py-0.5">
                        {formState.level}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Duration</span>
                      <span className="text-sm text-foreground tabular-nums">
                        {Math.floor(Number(formState.duration) / 60)}m{" "}
                        {Number(formState.duration) % 60}s
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">XP Reward</span>
                      <span className="text-sm font-medium text-foreground tabular-nums">
                        {formState.xp_reward} XP
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Questions ({selectedQuestions.length})
                  </p>
                  {selectedQuestions.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6 bg-secondary/30 rounded-lg">
                      No questions attached. You can still save without questions.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-1.5 max-h-[200px] overflow-y-auto">
                      {selectedQuestions.map((q, i) => (
                        <div
                          key={q._id}
                          className="flex items-start gap-2 p-2.5 bg-secondary/30 rounded-lg"
                        >
                          <span className="text-xs text-muted-foreground mt-0.5 w-5 flex-shrink-0 tabular-nums">
                            {i + 1}.
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground leading-snug">
                              {q.question_text}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                {q.subject}
                              </Badge>
                              <span className="text-[10px] text-chart-1">
                                ✓ {q.correct_answer}
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
              {!editingQuiz && (
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
                <Button size="sm" onClick={handleConfirmSubmit} disabled={saving}>
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                  ) : null}
                  {editingQuiz ? "Save Changes" : "Create Quiz"}
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
              {editingQuiz ? "Confirm Update" : "Confirm Creation"}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {editingQuiz
              ? `Are you sure you want to update "${formState.title}"? This will overwrite the existing quiz.`
              : `Are you sure you want to create the quiz "${formState.title}" with ${selectedQuestions.length} question${selectedQuestions.length !== 1 ? "s" : ""}?`}
          </p>
          <DialogFooter className="gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
              {editingQuiz ? "Update Quiz" : "Create Quiz"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
