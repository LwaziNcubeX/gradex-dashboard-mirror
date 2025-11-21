/**
 * Levels API Service
 * Handles all level-based quiz related API calls
 */

import { apiGet } from "@/lib/api";
import { LevelQuiz, LevelQuizzesListResponse } from "@/types/api";

/**
 * Get all level-based quizzes with pagination
 * GET /level-quiz/list
 */
export async function getAllLevelQuizzes(
  page: number = 1,
  limit: number = 10
): Promise<LevelQuizzesListResponse> {
  const response = await apiGet<LevelQuizzesListResponse>("/level-quiz/list", {
    params: {
      page,
      limit,
    },
  });
  return response;
}

/**
 * Get quizzes filtered by difficulty level/form
 * GET /level-quiz/by-level/{level}
 */
export async function getQuizzesByLevel(
  level: string,
  page: number = 1,
  limit: number = 10,
  filters?: {
    subject?: string;
    category?: string;
  }
): Promise<LevelQuizzesListResponse> {
  const params: Record<string, any> = {
    page,
    limit,
  };

  if (filters?.subject) params.subject = filters.subject;
  if (filters?.category) params.category = filters.category;

  const response = await apiGet<LevelQuizzesListResponse>(
    `/level-quiz/by-level/${encodeURIComponent(level)}`,
    {
      params,
    }
  );
  return response;
}

/**
 * Get all available forms/levels
 * This is a convenience function that fetches from all levels
 */
export const AVAILABLE_LEVELS = ["Form 1", "Form 2", "Form 3", "Form 4"];

/**
 * Get summary of quizzes for all forms
 */
export async function getAllFormsSummary(): Promise<
  { level: string; quizCount: number; totalXp: number }[]
> {
  const summaries = await Promise.all(
    AVAILABLE_LEVELS.map(async (level) => {
      try {
        const data = await getQuizzesByLevel(level, 1, 100);
        const totalXp = data.quizzes.reduce(
          (sum, quiz) => sum + (quiz.xp_reward || 0),
          0
        );
        return {
          level,
          quizCount: data.total,
          totalXp,
        };
      } catch {
        return {
          level,
          quizCount: 0,
          totalXp: 0,
        };
      }
    })
  );
  return summaries;
}
