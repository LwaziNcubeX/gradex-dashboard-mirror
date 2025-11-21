"use client";

import React, { useState, useMemo } from "react";
import { useAllLevels, useAvailableLevels } from "@/hooks/use-levels";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  Loader2,
  BookOpen,
  Trophy,
  ArrowRight,
  Zap,
  Star,
  Lock,
} from "lucide-react";
import { Level } from "@/types/api";

export function LevelsContent() {
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const availableFormLevels = useAvailableLevels();
  const { levels, isLoading, error } = useAllLevels();

  // Get unique subjects from levels
  const subjects = useMemo(() => {
    const uniqueSubjects = Array.from(new Set(levels.map((l) => l.subject)));
    return uniqueSubjects.sort();
  }, [levels]);

  // Set default selected subject
  const activeSubject = selectedSubject || subjects[0] || "";

  // Filter levels by selected subject
  const subjectLevels = levels.filter(
    (level) => level.subject === activeSubject
  );

  // Get subject statistics for cards
  const getSubjectStats = (subject: string) => {
    const subjectData = levels.filter((level) => level.subject === subject);
    return {
      levelCount: subjectData.filter((l) => l.status === "active").length,
      totalXp: subjectData.reduce(
        (sum, level) => sum + level.total_xp_reward,
        0
      ),
      formLevels: Array.from(new Set(subjectData.map((l) => l.form_level))),
    };
  };

  return (
    <div className="space-y-6">
      {/* Subjects Overview */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {subjects.map((subject) => {
          const stats = getSubjectStats(subject);
          return (
            <Card
              key={subject}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                activeSubject === subject
                  ? "border-primary shadow-lg"
                  : "hover:border-primary"
              }`}
              onClick={() => setSelectedSubject(subject)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-base truncate">{subject}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Levels</span>
                  <span className="text-lg font-bold">
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      stats.levelCount
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total XP
                  </span>
                  <span className="text-lg font-bold text-amber-600">
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      stats.totalXp
                    )}
                  </span>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {stats.formLevels.slice(0, 2).map((form) => (
                    <span
                      key={form}
                      className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded"
                    >
                      {form}
                    </span>
                  ))}
                  {stats.formLevels.length > 2 && (
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                      +{stats.formLevels.length - 2}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Levels for Selected Subject */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {activeSubject} Levels
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <div>
                <p className="font-semibold">Failed to load levels</p>
                <p className="text-xs">{error?.message || "Unknown error"}</p>
              </div>
            </div>
          )}

          {isLoading && !subjectLevels.length && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {!isLoading && subjectLevels.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <BookOpen className="mb-3 h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">
                No levels available for {activeSubject}
              </p>
            </div>
          )}

          {subjectLevels.length > 0 && (
            <div className="space-y-4">
              {subjectLevels
                .sort((a: Level, b: Level) => a.level_number - b.level_number)
                .map((level: Level) => (
                  <Card
                    key={level._id}
                    className="transition-all hover:shadow-md hover:border-primary cursor-pointer"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <span className="text-lg font-bold text-primary">
                              {level.level_number}
                            </span>
                          </div>
                          <div>
                            <CardTitle className="text-base">
                              {level.title}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">
                              {level.form_level}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {level.is_starter_level && (
                            <div className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
                              <Star className="h-3 w-3" />
                              Starter
                            </div>
                          )}
                          {level.status === "active" ? (
                            <div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                              <span className="h-2 w-2 rounded-full bg-green-600" />
                              Active
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">
                              {level.status}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {level.description && (
                        <p className="text-sm text-muted-foreground">
                          {level.description}
                        </p>
                      )}

                      {/* Difficulty and XP */}
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-700">
                          Difficulty: {level.difficulty_rating}/5
                        </span>
                        <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                          <Trophy className="h-3 w-3" />
                          {level.total_xp_reward} XP
                        </span>
                        {level.bonus_coins > 0 && (
                          <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700">
                            💎 {level.bonus_coins} coins
                          </span>
                        )}
                      </div>

                      {/* Requirements */}
                      <div className="grid gap-3 grid-cols-2 text-sm">
                        <div className="rounded-lg bg-muted p-3">
                          <p className="text-xs text-muted-foreground">
                            XP Required
                          </p>
                          <p className="flex items-center gap-1 font-semibold">
                            <Zap className="h-4 w-4" />
                            {level.xp_required}
                          </p>
                        </div>
                        <div className="rounded-lg bg-muted p-3">
                          <p className="text-xs text-muted-foreground">
                            Completion
                          </p>
                          <p className="font-semibold">
                            {level.completion_percentage_required}%
                          </p>
                        </div>
                      </div>

                      {/* Quizzes */}
                      <div className="rounded-lg bg-muted p-3">
                        <p className="text-xs text-muted-foreground">Quizzes</p>
                        <p className="font-semibold">
                          {level.quiz_ids.length} quiz(zes)
                        </p>
                      </div>

                      {/* Prerequisites */}
                      {level.prerequisites.length > 0 && (
                        <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
                          <p className="text-xs font-semibold text-orange-700 mb-1">
                            Prerequisites
                          </p>
                          <p className="text-xs text-orange-600">
                            {level.prerequisites.length} level(s) required
                          </p>
                        </div>
                      )}

                      {/* Tags */}
                      {level.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {level.tags.map((tag: string) => (
                            <span
                              key={tag}
                              className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <Button
                        className="w-full gap-2"
                        disabled={!level.is_active}
                      >
                        {level.prerequisites.length > 0 ? (
                          <>
                            <Lock className="h-4 w-4" />
                            Locked
                          </>
                        ) : (
                          <>
                            Start Level
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
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
