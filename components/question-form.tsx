"use client";

import type React from "react";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { CONFIG } from "@/lib/config";

type FormLevel = "Form 1" | "Form 2" | "Form 3" | "Form 4";

interface FormData {
  subject: string;
  topic: string;
  subtopics: string[];
  question_text: string;
  answers: string[];
  correct_answer: string;
  hint: string;
  level: FormLevel;
}

const INITIAL_FORM_DATA: FormData = {
  subject: "",
  topic: "",
  subtopics: [""],
  question_text: "",
  answers: ["", "", "", ""],
  correct_answer: "",
  hint: "",
  level: "Form 1",
};

const LEVELS: FormLevel[] = ["Form 1", "Form 2", "Form 3", "Form 4"];

export function QuestionForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

  const handleSubtopicChange = useCallback((index: number, value: string) => {
    setFormData((prevData) => {
      const newSubtopics = [...prevData.subtopics];
      newSubtopics[index] = value;
      return { ...prevData, subtopics: newSubtopics };
    });
  }, []);

  const addSubtopic = useCallback(() => {
    setFormData((prevData) => ({
      ...prevData,
      subtopics: [...prevData.subtopics, ""],
    }));
  }, []);

  const removeSubtopic = useCallback((index: number) => {
    setFormData((prevData) => ({
      ...prevData,
      subtopics: prevData.subtopics.filter((_, i) => i !== index),
    }));
  }, []);

  const handleAnswerChange = useCallback((index: number, value: string) => {
    setFormData((prevData) => {
      const newAnswers = [...prevData.answers];
      newAnswers[index] = value;
      return { ...prevData, answers: newAnswers };
    });
  }, []);

  const handleFormChange = useCallback(
    (key: keyof Omit<FormData, "subtopics" | "answers">, value: string) => {
      setFormData((prevData) => ({
        ...prevData,
        [key]: value,
      }));
    },
    []
  );

  const validateForm = (): boolean => {
    if (!formData.subject.trim()) {
      setError("Please enter a subject");
      return false;
    }
    if (!formData.topic.trim()) {
      setError("Please enter a topic");
      return false;
    }
    if (!formData.question_text.trim()) {
      setError("Please enter the question text");
      return false;
    }
    if (formData.answers.some((a) => !a.trim())) {
      setError("Please fill in all answers");
      return false;
    }
    if (!formData.correct_answer) {
      setError("Please select the correct answer");
      return false;
    }
    if (!formData.hint.trim()) {
      setError("Please enter a hint");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const data = await apiClient.post<{ success: boolean; message?: string }>(
        CONFIG.ENDPOINTS.QUESTIONS.CREATE,
        {
          ...formData,
          subtopics: formData.subtopics.filter((s) => s.trim() !== ""),
        }
      );

      if (data.success) {
        router.push("/dashboard/questions");
        router.refresh();
      } else {
        setError(data.message || "Failed to create question");
      }
    } catch (err) {
      console.error("Error creating question:", err);
      setError(
        err instanceof Error ? err.message : "Network error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Question Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => handleFormChange("subject", e.target.value)}
                placeholder="e.g., Geography"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Level *</Label>
              <Select
                value={formData.level}
                onValueChange={(value: FormLevel) =>
                  handleFormChange("level", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">Topic *</Label>
            <Input
              id="topic"
              value={formData.topic}
              onChange={(e) => handleFormChange("topic", e.target.value)}
              placeholder="e.g., Climate"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Subtopics *</Label>
            {formData.subtopics.map((subtopic, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={subtopic}
                  onChange={(e) => handleSubtopicChange(index, e.target.value)}
                  placeholder="e.g., Weather patterns"
                  required
                />
                {formData.subtopics.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSubtopic(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSubtopic}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Subtopic
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="question_text">Question Text *</Label>
            <Textarea
              id="question_text"
              value={formData.question_text}
              onChange={(e) =>
                handleFormChange("question_text", e.target.value)
              }
              placeholder="Enter your question here..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Answers *</Label>
            {formData.answers.map((answer, index) => (
              <Input
                key={index}
                value={answer}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                placeholder={`Answer ${index + 1}`}
                required
              />
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="correct_answer">Correct Answer *</Label>
            <Select
              value={formData.correct_answer}
              onValueChange={(value) =>
                handleFormChange("correct_answer", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select the correct answer" />
              </SelectTrigger>
              <SelectContent>
                {formData.answers
                  .filter((a) => a.trim() !== "")
                  .map((answer, index) => (
                    <SelectItem key={index} value={answer}>
                      {answer}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hint">Hint *</Label>
            <Textarea
              id="hint"
              value={formData.hint}
              onChange={(e) => handleFormChange("hint", e.target.value)}
              placeholder="Provide a helpful hint..."
              rows={2}
              required
            />
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Question"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
