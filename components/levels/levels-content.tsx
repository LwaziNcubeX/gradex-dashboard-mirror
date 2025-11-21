"use client";

import React, { useState } from "react";
import { useAllFormsSummary, useQuizzesByLevel } from "@/hooks/use-levels";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  Loader2,
  BookOpen,
  Trophy,
  ArrowRight,
} from "lucide-react";
import { AVAILABLE_LEVELS } from "@/services/levels";

export function LevelsContent() {
  const [selectedLevel, setSelectedLevel] = useState<string>(
    AVAILABLE_LEVELS[0]
  );
  const { summaries, isLoading: summariesLoading } = useAllFormsSummary();
  const { quizzes, isLoading, error } = useQuizzesByLevel(selectedLevel, {
    limit: 50,
  });

  return (
    <div className="space-y-6">
      {/* Forms Overview */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {AVAILABLE_LEVELS.map((level) => {
          const summary = summaries.find((s) => s.level === level);
          return (
            <Card
              key={level}
              className="cursor-pointer transition-all hover:shadow-lg hover:border-primary"
              onClick={() => setSelectedLevel(level)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{level}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Quizzes</span>
                  <span className="text-lg font-bold">
                    {summariesLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      summary?.quizCount || 0
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total XP
                  </span>
                  <span className="text-lg font-bold text-amber-600">
                    {summariesLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      summary?.totalXp || 0
                    )}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant={selectedLevel === level ? "default" : "outline"}
                  className="w-full"
                >
                  {selectedLevel === level ? "Selected" : "Select"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quizzes for Selected Level */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {selectedLevel} Quizzes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <div>
                <p className="font-semibold">Failed to load quizzes</p>
                <p className="text-xs">{error?.message || "Unknown error"}</p>
              </div>
            </div>
          )}

          {isLoading && !quizzes.length && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {!isLoading && quizzes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <BookOpen className="mb-3 h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">
                No quizzes available for {selectedLevel}
              </p>
            </div>
          )}

          {quizzes.length > 0 && (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {quizzes.map((quiz) => (
                <Card
                  key={quiz._id}
                  className="transition-all hover:shadow-md hover:border-primary cursor-pointer"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base">{quiz.title}</CardTitle>
                      {quiz.xp_reward && (
                        <div className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
                          <Trophy className="h-3 w-3" />
                          {quiz.xp_reward}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {quiz.description && (
                      <p className="text-sm text-muted-foreground">
                        {quiz.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {quiz.subject && (
                        <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                          {quiz.subject}
                        </span>
                      )}
                      {quiz.category && (
                        <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700">
                          {quiz.category}
                        </span>
                      )}
                    </div>

                    {quiz.question_count && (
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{quiz.question_count} questions</span>
                      </div>
                    )}

                    <Button
                      className="w-full gap-2"
                      onClick={(e) => {
                        e.preventDefault();
                        // TODO: Navigate to quiz or start quiz
                      }}
                    >
                      Start Quiz
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
