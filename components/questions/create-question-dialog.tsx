"use client";

import React, { useState } from "react";
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
import { Loader2, X } from "lucide-react";
import { QuestionCreateRequest } from "@/services/questions";

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
      // Validate
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

      const payload: QuestionCreateRequest = {
        question_text: formData.question_text,
        answers: validAnswers,
        correct_answer: formData.correct_answer,
        subject: formData.subject,
        level: formData.level || undefined,
        points: parseInt(formData.points),
        explanation: formData.explanation || undefined,
        hint: formData.hint || undefined,
      };

      await createQuestion(payload);

      // Reset form
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
          <DialogTitle>Create New Question</DialogTitle>
          <DialogDescription>
            Add a new question to your question bank
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          {/* Question Text */}
          <div className="space-y-2">
            <Label htmlFor="question_text">Question Text *</Label>
            <textarea
              id="question_text"
              placeholder="Enter your question..."
              value={formData.question_text}
              onChange={(e) =>
                setFormData({ ...formData, question_text: e.target.value })
              }
              className="w-full rounded border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={3}
            />
          </div>

          {/* Subject and Level */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Select
                value={formData.subject}
                onValueChange={(value) =>
                  setFormData({ ...formData, subject: value })
                }
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

            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Select
                value={formData.level}
                onValueChange={(value) =>
                  setFormData({ ...formData, level: value })
                }
              >
                <SelectTrigger id="level">
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
            <Label htmlFor="points">Points</Label>
            <Input
              id="points"
              type="number"
              min="1"
              max="100"
              value={formData.points}
              onChange={(e) =>
                setFormData({ ...formData, points: e.target.value })
              }
            />
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            <Label>Answer Options *</Label>
            {answers.map((answer, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Option ${index + 1}`}
                  value={answer}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                />
                <Button
                  type="button"
                  variant={
                    formData.correct_answer === answer ? "default" : "outline"
                  }
                  size="sm"
                  className="w-32"
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
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveAnswer(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            {answers.length < 6 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddAnswer}
              >
                Add Option
              </Button>
            )}
          </div>

          {/* Explanation */}
          <div className="space-y-2">
            <Label htmlFor="explanation">Explanation</Label>
            <textarea
              id="explanation"
              placeholder="Explain the correct answer..."
              value={formData.explanation}
              onChange={(e) =>
                setFormData({ ...formData, explanation: e.target.value })
              }
              className="w-full rounded border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={2}
            />
          </div>

          {/* Hint */}
          <div className="space-y-2">
            <Label htmlFor="hint">Hint (optional)</Label>
            <Input
              id="hint"
              placeholder="Provide a helpful hint..."
              value={formData.hint}
              onChange={(e) =>
                setFormData({ ...formData, hint: e.target.value })
              }
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Creating..." : "Create Question"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
