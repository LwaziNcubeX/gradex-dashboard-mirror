"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuizSelector } from "@/components/quiz-selector";
import type { Quiz } from "@/app/dashboard/quizzes/page";

export function LevelForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuizzes, setSelectedQuizzes] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch("http://0.0.0.0:8000/quizzes", {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setQuizzes(data.quizzes);
      }
    } catch (error) {
      console.error("Failed to fetch quizzes:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (selectedQuizzes.length === 0) {
      setError("Please select at least one quiz");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://0.0.0.0:8000/level/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          quizzes: selectedQuizzes,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/dashboard/levels");
        router.refresh();
      } else {
        setError(data.message || "Failed to create level");
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
          <CardTitle>Level Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Beginner Geography"
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
              placeholder="Describe what students will learn in this level..."
              rows={3}
              required
            />
          </div>
        </CardContent>
      </Card>

      <QuizSelector
        quizzes={quizzes}
        selectedQuizzes={selectedQuizzes}
        onSelectionChange={setSelectedQuizzes}
      />

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Level"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
