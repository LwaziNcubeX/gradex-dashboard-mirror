"use client";

import type React from "react";
import { useState } from "react";
import { useQuestions } from "@/hooks/use-questions";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, X, BookOpen } from "lucide-react";
import type { QuestionCreateInput, FormLevel } from "@/types/api";

const SUBJECTS = ["Mathematics", "Geography", "English", "History", "Science"];
const LEVELS = ["Form 1", "Form 2", "Form 3", "Form 4"];

interface CreateQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateQuestionDialog({
  open,
  onOpenChange,
}: CreateQuestionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<string[]>(["", "", "", ""]);
  const [formData, setFormData] = useState({
    question_text: "",
    correct_answer: "",
    subject: "",
    level: "",
    points: "10",
    explanation: "",
    hint: "",
  });

  const { createQuestion } = useQuestions();

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleAddAnswer = () => {
    if (answers.length < 6) {
      setAnswers([...answers, ""]);
    }
  };

  const handleRemoveAnswer = (index: number) => {
    if (answers.length > 2) {
      setAnswers(answers.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!formData.question_text.trim()) {
        throw new Error("Question text is required");
      }
      if (!formData.subject) {
        throw new Error("Subject is required");
      }
      if (!formData.correct_answer) {
        throw new Error("Correct answer is required");
      }
      const validAnswers = answers.filter((a) => a.trim());
      if (validAnswers.length < 2) {
        throw new Error("At least 2 answer options are required");
      }
      if (!validAnswers.includes(formData.correct_answer)) {
        throw new Error("Correct answer must be one of the options");
      }

      const payload: QuestionCreateInput = {
        question_text: formData.question_text,
        answers: validAnswers,
        correct_answer: formData.correct_answer,
        subject: formData.subject,
        ...(formData.level && { level: formData.level as FormLevel }),
        points: Number.parseInt(formData.points),
        explanation: formData.explanation || undefined,
        hint: formData.hint || undefined,
      };

      await createQuestion(payload);

      setFormData({
        question_text: "",
        correct_answer: "",
        subject: "",
        level: "",
        points: "10",
        explanation: "",
        hint: "",
      });
      setAnswers(["", "", "", ""]);
      onOpenChange(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create question"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <DialogTitle>Create New Question</DialogTitle>
              <DialogDescription className="mt-1">
                Add a new question to your question bank
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Question Text */}
          <div className="space-y-2">
            <Label htmlFor="question_text" className="font-medium">
              Question Text *
            </Label>
            <textarea
              id="question_text"
              placeholder="Enter your question here..."
              value={formData.question_text}
              onChange={(e) =>
                setFormData({ ...formData, question_text: e.target.value })
              }
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              rows={3}
            />
          </div>

          {/* Subject and Level */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="subject" className="font-medium">
                Subject *
              </Label>
              <Select
                value={formData.subject}
                onValueChange={(value) =>
                  setFormData({ ...formData, subject: value })
                }
              >
                <SelectTrigger id="subject" className="bg-background">
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

            <div className="space-y-2">
              <Label htmlFor="level" className="font-medium">
                Level
              </Label>
              <Select
                value={formData.level}
                onValueChange={(value) =>
                  setFormData({ ...formData, level: value })
                }
              >
                <SelectTrigger id="level" className="bg-background">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Points */}
          <div className="space-y-2">
            <Label htmlFor="points" className="font-medium">
              Points
            </Label>
            <Input
              id="points"
              type="number"
              min="1"
              max="100"
              value={formData.points}
              onChange={(e) =>
                setFormData({ ...formData, points: e.target.value })
              }
              className="bg-background"
            />
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            <Label className="font-medium">Answer Options *</Label>
            <div className="space-y-2">
              {answers.map((answer, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={answer}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    className="bg-background"
                  />
                  <Button
                    type="button"
                    variant={
                      formData.correct_answer === answer ? "default" : "outline"
                    }
                    size="sm"
                    className="w-28 shrink-0"
                    onClick={() =>
                      setFormData({ ...formData, correct_answer: answer })
                    }
                    disabled={!answer.trim()}
                  >
                    {formData.correct_answer === answer ? "✓ Correct" : "Mark"}
                  </Button>
                  {answers.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleRemoveAnswer(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {answers.length < 6 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddAnswer}
                className="w-full bg-transparent"
              >
                + Add Option
              </Button>
            )}
          </div>

          {/* Explanation */}
          <div className="space-y-2">
            <Label htmlFor="explanation" className="font-medium">
              Explanation
            </Label>
            <textarea
              id="explanation"
              placeholder="Explain why this is the correct answer..."
              value={formData.explanation}
              onChange={(e) =>
                setFormData({ ...formData, explanation: e.target.value })
              }
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              rows={2}
            />
          </div>

          {/* Hint */}
          <div className="space-y-2">
            <Label htmlFor="hint" className="font-medium">
              Hint (optional)
            </Label>
            <Input
              id="hint"
              placeholder="Provide a helpful hint for students..."
              value={formData.hint}
              onChange={(e) =>
                setFormData({ ...formData, hint: e.target.value })
              }
              className="bg-background"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Creating..." : "Create Question"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
