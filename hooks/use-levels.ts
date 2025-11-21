"use client";

import useSWR, { mutate } from "swr";
import {
  getAllLevels,
  getLevelDetail,
  getAdminLevels,
  AVAILABLE_LEVELS,
} from "@/services/levels";
import {
  Level,
  LevelDetail,
  AdminLevelsListResponse,
  AdminLevelsQueryParams,
} from "@/types/api";

export interface UseLevelsOptions {
  skipFetch?: boolean;
}

export interface UseAdminLevelsOptions extends AdminLevelsQueryParams {
  skipFetch?: boolean;
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
 * Hook to get available form levels
 */
export function useAvailableLevels() {
  return AVAILABLE_LEVELS;
}
