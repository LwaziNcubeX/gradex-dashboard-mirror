"use client";

import useSWR, { mutate } from "swr";
import {
  getAllLevelQuizzes,
  getQuizzesByLevel,
  getAllFormsSummary,
  AVAILABLE_LEVELS,
} from "@/services/levels";
import { LevelQuiz, LevelQuizzesListResponse } from "@/types/api";

export interface UseLevelsOptions {
  skipFetch?: boolean;
  page?: number;
  limit?: number;
}

/**
 * Hook to fetch all level-based quizzes
 */
export function useAllLevelQuizzes(options: UseLevelsOptions = {}) {
  const { skipFetch = false, page = 1, limit = 10 } = options;

  const cacheKey = skipFetch ? null : `levels:all:${page}:${limit}`;

  const { data, error, isLoading } = useSWR(
    cacheKey,
    async () => await getAllLevelQuizzes(page, limit),
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000 * 60 * 5, // 5 minutes
    }
  );

  const refetch = () => mutate(cacheKey);

  return {
    quizzes: data?.quizzes || [],
    total: data?.total || 0,
    page: data?.page || 1,
    limit: data?.limit || 10,
    totalPages: data?.total_pages || 1,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to fetch quizzes filtered by level/form
 */
export function useQuizzesByLevel(
  level: string | null,
  options: UseLevelsOptions = {}
) {
  const { skipFetch = false, page = 1, limit = 10 } = options;

  const cacheKey =
    skipFetch || !level ? null : `levels:${level}:${page}:${limit}`;

  const { data, error, isLoading } = useSWR(
    cacheKey,
    async () => level && (await getQuizzesByLevel(level, page, limit)),
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000 * 60 * 5, // 5 minutes
    }
  );

  const refetch = () => mutate(cacheKey);

  return {
    quizzes: (data as LevelQuizzesListResponse | undefined)?.quizzes || [],
    total: (data as LevelQuizzesListResponse | undefined)?.total || 0,
    page: (data as LevelQuizzesListResponse | undefined)?.page || 1,
    limit: (data as LevelQuizzesListResponse | undefined)?.limit || 10,
    totalPages:
      (data as LevelQuizzesListResponse | undefined)?.total_pages || 1,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to fetch summary of all forms
 */
export function useAllFormsSummary(skipFetch = false) {
  const cacheKey = skipFetch ? null : "levels:summary";

  const { data, error, isLoading } = useSWR(
    cacheKey,
    async () => await getAllFormsSummary(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000 * 60 * 5, // 5 minutes
    }
  );

  const refetch = () => mutate(cacheKey);

  return {
    summaries: data || [],
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to get available levels
 */
export function useAvailableLevels() {
  return AVAILABLE_LEVELS;
}
