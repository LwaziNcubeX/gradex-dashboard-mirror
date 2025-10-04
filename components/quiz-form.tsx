"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuestionSelector } from "@/components/question-selector";
import type { Question } from "@/app/dashboard/questions/page";

export function QuizForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    level: "",
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("http://0.0.0.0:8000/questions", {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setQuestions(data.questions);
      }
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (selectedQuestions.length === 0) {
      setError("Please select at least one question");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://0.0.0.0:8000/quiz/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          questions: selectedQuestions,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/dashboard/quizzes");
        router.refresh();
      } else {
        setError(data.message || "Failed to create quiz");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quiz Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., Form 1 Geography Quiz"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe what this quiz covers..."
              rows={3}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
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
              <Input
                id="level"
                value={formData.level}
                onChange={(e) =>
                  setFormData({ ...formData, level: e.target.value })
                }
                placeholder="e.g., Form 1"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <QuestionSelector
        questions={questions}
        selectedQuestions={selectedQuestions}
        onSelectionChange={setSelectedQuestions}
      />

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Quiz"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
