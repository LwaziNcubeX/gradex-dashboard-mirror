"use client";

import { useState, useCallback, useEffect } from "react";
import useSWR, { mutate } from "swr";
import {
  getAllLevels,
  getLevelDetail,
  getAdminLevels,
  AVAILABLE_LEVELS,
  unlockLevel,
  createLevel as createLevelAPI,
  updateLevel as updateLevelAPI,
} from "@/services/levels";
import {
  AdminLevelsQueryParams,
  Level as APILevel,
  LevelCreateInput,
} from "@/types/api";

export interface UseLevelsOptions {
  skipFetch?: boolean;
  subject?: string;
}

export interface UseAdminLevelsOptions extends AdminLevelsQueryParams {
  skipFetch?: boolean;
}

// Type definitions
export interface Level {
  _id: string;
  level_number: number;
  title: string;
  form_level: string;
  subject: string;
  description?: string;
  status: "active" | "inactive" | "draft";
  difficulty_rating: number;
  total_xp_reward: number;
  bonus_coins: number;
  xp_required: number;
  completion_percentage_required: number;
  quiz_ids: string[];
  prerequisites: string[];
  tags: string[];
  is_starter_level: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface LevelCreateRequest {
  level_number: number;
  title: string;
  form_level: string;
  subject: string;
  description?: string;
  status: "active" | "inactive" | "draft";
  difficulty_rating: number;
  total_xp_reward: number;
  bonus_coins?: number;
  xp_required: number;
  completion_percentage_required: number;
  quiz_ids?: string[];
  prerequisites?: string[];
  tags?: string[];
  is_starter_level?: boolean;
}

export interface LevelUpdateRequest extends Partial<LevelCreateRequest> {}

/**
 * Main hook for fetching all levels with state management
 * Uses improved fetching logic with local state and API caching
 */
export function useLevels(options: UseLevelsOptions = {}) {
  const [levels, setLevels] = useState<Level[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchLevels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAllLevels(options.subject);
      const typedLevels: Level[] = (response as any[]).map((level: any) => ({
        _id: level._id,
        level_number: level.level_number,
        title: level.title,
        form_level: level.form_level,
        subject: level.subject,
        description: level.description,
        status: level.status || "draft",
        difficulty_rating: level.difficulty_rating,
        total_xp_reward: level.total_xp_reward,
        bonus_coins: level.bonus_coins || 0,
        xp_required: level.xp_required,
        completion_percentage_required: level.completion_percentage_required,
        quiz_ids: level.quiz_ids || [],
        prerequisites: level.prerequisites || [],
        tags: level.tags || [],
        is_starter_level: level.is_starter_level,
        is_active: level.is_active,
        created_at: level.created_at,
        updated_at: level.updated_at,
      }));
      setLevels(typedLevels);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch levels")
      );
    } finally {
      setIsLoading(false);
    }
  }, [options.subject]);

  // Initial fetch
  useEffect(() => {
    fetchLevels();
  }, [fetchLevels]);

  const createLevel = useCallback(
    async (data: LevelCreateRequest) => {
      try {
        const apiData: LevelCreateInput = {
          level_number: data.level_number,
          title: data.title,
          form_level: data.form_level as any,
          subject: data.subject,
          description: data.description || "",
          status: data.status as any,
          difficulty_rating: data.difficulty_rating,
          total_xp_reward: data.total_xp_reward,
          bonus_coins: data.bonus_coins,
          xp_required: data.xp_required,
          completion_percentage_required: data.completion_percentage_required,
          quiz_ids: data.quiz_ids,
          prerequisites: data.prerequisites,
          tags: data.tags,
          is_starter_level: data.is_starter_level,
        };
        await createLevelAPI(apiData);
        await fetchLevels();
      } catch (err) {
        throw err instanceof Error ? err : new Error("Failed to create level");
      }
    },
    [fetchLevels]
  );

  const updateLevel = useCallback(
    async (id: string, data: LevelUpdateRequest) => {
      try {
        const apiData: Partial<LevelCreateInput> = {};
        if (data.title !== undefined) apiData.title = data.title;
        if (data.description !== undefined)
          apiData.description = data.description;
        if (data.status !== undefined) apiData.status = data.status as any;
        if (data.difficulty_rating !== undefined)
          apiData.difficulty_rating = data.difficulty_rating;
        if (data.total_xp_reward !== undefined)
          apiData.total_xp_reward = data.total_xp_reward;
        if (data.bonus_coins !== undefined)
          apiData.bonus_coins = data.bonus_coins;
        if (data.xp_required !== undefined)
          apiData.xp_required = data.xp_required;
        if (data.completion_percentage_required !== undefined)
          apiData.completion_percentage_required =
            data.completion_percentage_required;
        if (data.quiz_ids !== undefined) apiData.quiz_ids = data.quiz_ids;
        if (data.prerequisites !== undefined)
          apiData.prerequisites = data.prerequisites;
        if (data.tags !== undefined) apiData.tags = data.tags;
        if (data.is_starter_level !== undefined)
          apiData.is_starter_level = data.is_starter_level;

        await updateLevelAPI(id, apiData);
        await fetchLevels();
      } catch (err) {
        throw err instanceof Error ? err : new Error("Failed to update level");
      }
    },
    [fetchLevels]
  );

  const deleteLevel = useCallback(
    async (id: string) => {
      try {
        // TODO: Implement delete endpoint in API
        // await deleteLevel(id);
        await fetchLevels();
      } catch (err) {
        throw err instanceof Error ? err : new Error("Failed to delete level");
      }
    },
    [fetchLevels]
  );

  return {
    levels,
    isLoading,
    error,
    createLevel,
    updateLevel,
    deleteLevel,
    refetch: fetchLevels,
  };
}

/**
 * Hook to fetch all active levels for the user
 */
export function useAllLevels(subject?: string, options: UseLevelsOptions = {}) {
  const { skipFetch = false } = options;
  const cacheKey = skipFetch ? null : `levels:all:${subject || "all"}`;

  const { data, error, isLoading } = useSWR(
    cacheKey,
    async () => await getAllLevels(subject),
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000 * 60 * 5, // 5 minutes
    }
  );

  const refetch = () => mutate(cacheKey);

  return {
    levels: data || [],
    isLoading,
    error: error as Error | undefined,
    refetch,
  };
}

/**
 * Hook to fetch a single level with details and user progress
 */
export function useLevelDetail(
  levelId: string | null,
  options: UseLevelsOptions = {}
) {
  const { skipFetch = false } = options;
  const cacheKey = skipFetch || !levelId ? null : `level:detail:${levelId}`;

  const { data, error, isLoading } = useSWR(
    cacheKey,
    async () => levelId && (await getLevelDetail(levelId)),
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000 * 60 * 5, // 5 minutes
    }
  );

  const refetch = () => mutate(cacheKey);

  return {
    level: data || null,
    isLoading,
    error: error as Error | undefined,
    refetch,
  };
}

/**
 * Hook to fetch paginated admin levels list with filters and sorting
 */
export function useAdminLevels(options: UseAdminLevelsOptions = {}) {
  const {
    skipFetch = false,
    page = 1,
    per_page = 20,
    subject,
    form_level,
    status,
    search,
    sort_by,
    sort_order,
    include_archived,
  } = options;

  const cacheKey = skipFetch
    ? null
    : `admin:levels:${page}:${per_page}:${subject || ""}:${form_level || ""}:${
        status || ""
      }:${search || ""}:${sort_by || ""}:${sort_order || ""}:${
        include_archived || ""
      }`;

  const { data, error, isLoading } = useSWR(
    cacheKey,
    async () =>
      await getAdminLevels({
        page,
        per_page,
        subject,
        form_level,
        status,
        search,
        sort_by,
        sort_order,
        include_archived,
      }),
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000 * 60 * 5, // 5 minutes
    }
  );

  const refetch = () => mutate(cacheKey);

  return {
    levels: data?.data || [],
    total: data?.meta.total_items || 0,
    page: data?.meta.page || 1,
    pageSize: data?.meta.page_size || 20,
    totalPages: data?.meta.total_pages || 1,
    isLoading,
    error: error as Error | undefined,
    refetch,
  };
}

/**
 * Hook to unlock a level for the current user
 */
export function useUnlockLevel() {
  const handleUnlock = async (levelId: string) => {
    try {
      const result = await unlockLevel(levelId);
      // Invalidate all level caches after unlocking
      mutate((key) => typeof key === "string" && key.startsWith("levels:"));
      return result;
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("Failed to unlock level");
    }
  };

  return { unlock: handleUnlock };
}

/**
 * Hook to get available form levels
 */
export function useAvailableLevels() {
  return AVAILABLE_LEVELS;
}
