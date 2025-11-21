"use client";

import { useState, useEffect } from "react";
import { useQuizzes, type Quiz } from "@/hooks/use-quizzes";
import type { QuizCreateInput } from "@/types/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { AlertCircle, Loader2 } from "lucide-react";

interface CreateQuizDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quiz?: Quiz | null;
}

const SUBJECTS = ["Mathematics", "Geography", "English", "History", "Science"];

const CATEGORIES: Record<string, string[]> = {
  Mathematics: ["Algebra", "Geometry", "Trigonometry", "Calculus"],
  Geography: ["Physical Geography", "Human Geography", "Map Reading"],
  English: ["Literature", "Grammar", "Writing", "Reading"],
  History: ["Ancient", "Medieval", "Modern", "Contemporary"],
  Science: ["Physics", "Chemistry", "Biology"],
};

const FORM_LEVELS = ["Form 1", "Form 2", "Form 3", "Form 4"];

export function CreateQuizDialog({
  open,
  onOpenChange,
  quiz,
}: CreateQuizDialogProps) {
  const { createQuiz: createQuizMutation, updateQuiz: updateQuizMutation } =
    useQuizzes();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<QuizCreateInput>({
    title: "",
    description: "",
    subject: "",
    category: "",
    tags: [],
    duration: 1800,
    level: "Form 1",
    xp_reward: 50,
    difficulty_score: 1.5,
    status: "draft",
    is_active: true,
  });

  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (quiz) {
      setFormData({
        title: quiz.title,
        description: quiz.description,
        subject: quiz.subject,
        category: quiz.category || "",
        tags: quiz.tags || [],
        duration: quiz.duration,
        level: quiz.level,
        xp_reward: quiz.xp_reward,
        difficulty_score: quiz.difficulty_score,
        status: quiz.status,
        is_active: quiz.is_active,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        subject: "",
        category: "",
        tags: [],
        duration: 1800,
        level: "Form 1",
        xp_reward: 50,
        difficulty_score: 1.5,
        status: "draft",
        is_active: true,
      });
    }
    setError(null);
  }, [quiz, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError("Quiz title is required");
      return;
    }

    if (!formData.description.trim()) {
      setError("Quiz description is required");
      return;
    }

    if (!formData.subject) {
      setError("Subject is required");
      return;
    }

    try {
      setIsLoading(true);
      if (quiz) {
        await updateQuizMutation(quiz._id, formData);
      } else {
        await createQuizMutation(formData);
      }
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save quiz");
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag)) {
      setFormData((prev: QuizCreateInput) => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev: QuizCreateInput) => ({
      ...prev,
      tags: (prev.tags || []).filter((t: string) => t !== tag),
    }));
  };

  const categories = formData.subject ? CATEGORIES[formData.subject] || [] : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{quiz ? "Edit Quiz" : "Create New Quiz"}</DialogTitle>
          <DialogDescription>
            {quiz
              ? "Update the quiz details below"
              : "Fill in the quiz details to create a new quiz"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex gap-3 rounded-lg border border-destructive/50 bg-destructive/5 p-3 text-sm">
              <AlertCircle className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
              <p className="text-destructive">{error}</p>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Quiz Title *
              </Label>
              <Input
                id="title"
                placeholder="e.g., Algebra Fundamentals"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev: QuizCreateInput) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject" className="text-sm font-medium">
                Subject *
              </Label>
              <Select
                value={formData.subject}
                onValueChange={(value) =>
                  setFormData((prev: QuizCreateInput) => ({
                    ...prev,
                    subject: value,
                    category: "",
                  }))
                }
                disabled={isLoading}
              >
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description *
            </Label>
            <Input
              id="description"
              placeholder="Enter quiz description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev: QuizCreateInput) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Category
              </Label>
              <Select
                value={formData.category || ""}
                onValueChange={(value) =>
                  setFormData((prev: QuizCreateInput) => ({
                    ...prev,
                    category: value,
                  }))
                }
                disabled={isLoading || !formData.subject}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level" className="text-sm font-medium">
                Form Level
              </Label>
              <Select
                value={formData.level}
                onValueChange={(value) =>
                  setFormData((prev: QuizCreateInput) => ({
                    ...prev,
                    level: value as any,
                  }))
                }
                disabled={isLoading}
              >
                <SelectTrigger id="level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FORM_LEVELS.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium">
                Duration (seconds)
              </Label>
              <Input
                id="duration"
                type="number"
                min="60"
                max="7200"
                value={formData.duration}
                onChange={(e) =>
                  setFormData((prev: QuizCreateInput) => ({
                    ...prev,
                    duration: parseInt(e.target.value),
                  }))
                }
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="xp_reward" className="text-sm font-medium">
                XP Reward
              </Label>
              <Input
                id="xp_reward"
                type="number"
                min="1"
                max="500"
                value={formData.xp_reward}
                onChange={(e) =>
                  setFormData((prev: QuizCreateInput) => ({
                    ...prev,
                    xp_reward: parseInt(e.target.value),
                  }))
                }
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty" className="text-sm font-medium">
                Difficulty (0.1-5.0)
              </Label>
              <Input
                id="difficulty"
                type="number"
                min="0.1"
                max="5.0"
                step="0.1"
                value={formData.difficulty_score}
                onChange={(e) =>
                  setFormData((prev: QuizCreateInput) => ({
                    ...prev,
                    difficulty_score: parseFloat(e.target.value),
                  }))
                }
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags" className="text-sm font-medium">
              Tags
            </Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Add a tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addTag}
                disabled={isLoading || !newTag.trim()}
              >
                Add
              </Button>
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {formData.tags.map((tag: string) => (
                  <div
                    key={tag}
                    className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-primary hover:text-primary/80"
                      disabled={isLoading}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {quiz ? "Update Quiz" : "Create Quiz"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
