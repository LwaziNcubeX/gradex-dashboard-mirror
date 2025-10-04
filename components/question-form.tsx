"use client";

import type React from "react";

import { useState } from "react";
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

export function QuestionForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    subtopics: [""],
    question_text: "",
    answers: ["", "", "", ""],
    correct_answer: "",
    hint: "",
    level: "Form 1" as "Form 1" | "Form 2" | "Form 3" | "Form 4",
  });

  const handleSubtopicChange = (index: number, value: string) => {
    const newSubtopics = [...formData.subtopics];
    newSubtopics[index] = value;
    setFormData({ ...formData, subtopics: newSubtopics });
  };

  const addSubtopic = () => {
    setFormData({ ...formData, subtopics: [...formData.subtopics, ""] });
  };

  const removeSubtopic = (index: number) => {
    const newSubtopics = formData.subtopics.filter((_, i) => i !== index);
    setFormData({ ...formData, subtopics: newSubtopics });
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...formData.answers];
    newAnswers[index] = value;
    setFormData({ ...formData, answers: newAnswers });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://api-gradex.rapidshyft.com/question/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            ...formData,
            subtopics: formData.subtopics.filter((s) => s.trim() !== ""),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        router.push("/dashboard/questions");
        router.refresh();
      } else {
        setError(data.message || "Failed to create question");
      }
    } catch (err) {
      setError("Network error. Please try again.");
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
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                placeholder="e.g., Geography"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Level *</Label>
              <Select
                value={formData.level}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, level: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Form 1">Form 1</SelectItem>
                  <SelectItem value="Form 2">Form 2</SelectItem>
                  <SelectItem value="Form 3">Form 3</SelectItem>
                  <SelectItem value="Form 4">Form 4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">Topic *</Label>
            <Input
              id="topic"
              value={formData.topic}
              onChange={(e) =>
                setFormData({ ...formData, topic: e.target.value })
              }
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
                setFormData({ ...formData, question_text: e.target.value })
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
                setFormData({ ...formData, correct_answer: value })
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
              onChange={(e) =>
                setFormData({ ...formData, hint: e.target.value })
              }
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
