"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { QuestionSelector } from "@/components/question-selector";
import type { Question } from "@/app/dashboard/questions/page";
import { getQuestionId } from "@/app/dashboard/questions/page";
import { apiClient } from "@/lib/api-client";
import { CONFIG } from "@/lib/config";

export function QuizForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    category: "",
    duration: 30,
    level: "",
    level_id: "",
    xp_reward: 10,
    difficulty_score: 1,
  });

  // Hardcoded levels like before
  const levels = ["Form 1", "Form 2", "Form 3", "Form 4"];

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setQuestionsLoading(true);
      console.log("Fetching questions..."); // Debug log
      const data = await apiClient.get<{
        success: boolean;
        questions: Question[];
      }>(CONFIG.ENDPOINTS.QUESTIONS.LIST);
      console.log("Fetched questions response:", data); // Debug log
      console.log("Questions array:", data.questions); // Debug log
      console.log("Questions count:", data.questions?.length || 0); // Debug log

      if (data.success) {
        console.log("🔍 First question structure:", data.questions?.[0]);
        setQuestions(data.questions || []);
      } else {
        console.error("Failed to fetch questions: API returned success: false");
        setError("Failed to load questions from server.");
      }
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      setError(
        "Failed to load questions. Please check your connection and try again."
      );
    } finally {
      setQuestionsLoading(false);
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (selectedQuestions.length === 0) {
      setError("Please select at least one question");
      return;
    }

    if (!formData.level) {
      setError("Please select a level");
      return;
    }

    setLoading(true);

    try {
      const data = await apiClient.post<{ success: boolean; message?: string }>(
        CONFIG.ENDPOINTS.QUIZZES.CREATE,
        {
          ...formData,
          tags,
          questions: selectedQuestions,
        }
      );

      if (data.success) {
        router.push("/dashboard/quizzes");
        router.refresh();
      } else {
        setError(data.message || "Failed to create quiz");
      }
    } catch (err) {
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
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="e.g., Science, Math, Languages"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="level">Level *</Label>
              <Select
                value={formData.level}
                onValueChange={(value) => {
                  setFormData({
                    ...formData,
                    level: value,
                    level_id: value, // Use the same value for level_id
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="300"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration: parseInt(e.target.value) || 30,
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty (1-5) *</Label>
              <Select
                value={formData.difficulty_score.toString()}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    difficulty_score: parseInt(value),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Very Easy</SelectItem>
                  <SelectItem value="2">2 - Easy</SelectItem>
                  <SelectItem value="3">3 - Medium</SelectItem>
                  <SelectItem value="4">4 - Hard</SelectItem>
                  <SelectItem value="5">5 - Very Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="xp_reward">XP Reward *</Label>
            <Input
              id="xp_reward"
              type="number"
              min="1"
              max="1000"
              value={formData.xp_reward}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  xp_reward: parseInt(e.target.value) || 10,
                })
              }
              placeholder="Experience points awarded for completion"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add tags (press Enter to add)"
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <QuestionSelector
        questions={questions}
        selectedQuestions={selectedQuestions}
        onSelectionChange={setSelectedQuestions}
        isLoading={questionsLoading}
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
