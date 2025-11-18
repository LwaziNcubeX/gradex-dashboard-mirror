"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuizSelector } from "@/components/quiz-selector";
import type { Quiz } from "@/lib/interface";
import { apiClient } from "@/lib/api-client";
import { CONFIG } from "@/lib/config";

interface FormData {
  name: string;
  description: string;
}

const INITIAL_FORM_DATA: FormData = {
  name: "",
  description: "",
};

export function LevelForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuizzes, setSelectedQuizzes] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

  // Fetch quizzes on mount
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await apiClient.get<{
          success: boolean;
          quizzes: Quiz[];
        }>(CONFIG.ENDPOINTS.QUIZZES.LIST);
        if (data.success && Array.isArray(data.quizzes)) {
          setQuizzes(data.quizzes);
        } else {
          console.error("Failed to fetch quizzes: API returned invalid data");
          setQuizzes([]);
        }
      } catch (err) {
        console.error("Failed to fetch quizzes:", err);
        setError("Failed to load quizzes. Please refresh and try again.");
        setQuizzes([]);
      }
    };

    fetchQuizzes();
  }, []);

  const handleFormChange = useCallback((key: keyof FormData, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (selectedQuizzes.length === 0) {
      setError("Please select at least one quiz");
      return;
    }

    if (!formData.name.trim()) {
      setError("Please enter a level name");
      return;
    }

    if (!formData.description.trim()) {
      setError("Please enter a level description");
      return;
    }

    setLoading(true);

    try {
      const data = await apiClient.post<{ success: boolean; message?: string }>(
        CONFIG.ENDPOINTS.LEVELS.CREATE,
        {
          ...formData,
          quizzes: selectedQuizzes,
        }
      );

      if (data.success) {
        router.push("/dashboard/levels");
        router.refresh();
      } else {
        setError(data.message || "Failed to create level");
      }
    } catch (err) {
      console.error("Error creating level:", err);
      setError(
        err instanceof Error ? err.message : "Network error. Please try again."
      );
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
              onChange={(e) => handleFormChange("name", e.target.value)}
              placeholder="e.g., Beginner Geography"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleFormChange("description", e.target.value)}
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
