"use client";

import { useState, useCallback, useEffect } from "react";
import useSWR from "swr";
import * as quizzesService from "@/services/quizzes";
import type {
  Quiz,
  QuizDetail,
  QuizCreateInput,
  AdminQuizzesQueryParams,
  AdminQuizzesListResponse,
} from "@/types/api";

export type { Quiz, QuizDetail };

interface UseQuizzesOptions {
  page?: number;
  pageSize?: number;
  subject?: string;
  category?: string;
  status?: string;
  onError?: (error: Error) => void;
}

/**
 * Main hook for managing quizzes with CRUD operations
 * Uses useState + useCallback for reliable state management
 */
export function useQuizzes(options: UseQuizzesOptions = {}) {
  const {
    page: providedPage,
    pageSize: providedPageSize,
    subject,
    category,
    status,
    onError,
  } = options;

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const pageSize = providedPageSize ?? 20;
  const page = providedPage ?? 1;

  // Fetch quizzes on mount and when options change
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params: AdminQuizzesQueryParams = {
          page,
          per_page: pageSize,
          subject,
          category,
          status: status as any,
        };

        const response = await quizzesService.getAdminQuizzes(params);
        setQuizzes(response.data || []);
        setTotal(response.pagination?.total_items || 0);
        setTotalPages(response.pagination?.total_pages || 1);
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to fetch quizzes");
        setError(error);
        if (onError) onError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizzes();
  }, [page, pageSize, subject, category, status, onError]);

  // Create quiz
  const createQuiz = useCallback(async (data: QuizCreateInput) => {
    try {
      const newQuiz = await quizzesService.createQuiz(data);
      setQuizzes((prev) => [newQuiz, ...prev]);
      return newQuiz;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to create quiz");
      setError(error);
      throw error;
    }
  }, []);

  // Update quiz
  const updateQuiz = useCallback(
    async (quizId: string, data: Partial<QuizCreateInput>) => {
      try {
        const updatedQuiz = await quizzesService.updateQuiz(quizId, data);
        setQuizzes((prev) =>
          prev.map((q) => (q._id === quizId ? updatedQuiz : q))
        );
        return updatedQuiz;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to update quiz");
        setError(error);
        throw error;
      }
    },
    []
  );

  // Delete quiz
  const deleteQuiz = useCallback(async (quizId: string) => {
    try {
      await quizzesService.deleteQuiz(quizId);
      setQuizzes((prev) => prev.filter((q) => q._id !== quizId));
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to delete quiz");
      setError(error);
      throw error;
    }
  }, []);

  // Change status
  const changeStatus = useCallback(
    async (quizId: string, status: "draft" | "active" | "archived") => {
      try {
        const updated = await quizzesService.changeQuizStatus(quizId, status);
        setQuizzes((prev) => prev.map((q) => (q._id === quizId ? updated : q)));
        return updated;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to change status");
        setError(error);
        throw error;
      }
    },
    []
  );

  // Bulk upload
  const bulkUpload = useCallback(
    async (file: File) => {
      try {
        const result = await quizzesService.bulkUploadQuizzes(file);
        // Refresh the list after bulk upload
        const params: AdminQuizzesQueryParams = {
          page,
          per_page: pageSize,
          subject,
        };
        const response = await quizzesService.getAdminQuizzes(params);
        setQuizzes(response.data || []);
        return result;
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error("Failed to bulk upload quizzes");
        setError(error);
        throw error;
      }
    },
    [page, pageSize, subject]
  );

  return {
    quizzes,
    isLoading,
    error,
    total,
    totalPages,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    changeStatus,
    bulkUpload,
  };
}

/**
 * Hook for fetching all quizzes with SWR (for browsing)
 */
export function useAllQuizzes(
  subject?: string,
  options?: { revalidateOnFocus?: boolean }
) {
  const { data, error, isLoading } = useSWR(
    `/quizzes/all${subject ? `?subject=${subject}` : ""}`,
    async () => {
      return quizzesService.getAllQuizzes(subject);
    },
    {
      revalidateOnFocus: options?.revalidateOnFocus ?? true,
      dedupingInterval: 60000,
    }
  );

  return {
    quizzes: data || [],
    isLoading: !error && !data,
    error: error instanceof Error ? error : null,
  };
}

/**
 * Hook for fetching single quiz detail
 */
export function useQuizDetail(
  quizId?: string,
  options?: { revalidateOnFocus?: boolean }
) {
  const { data, error, isLoading } = useSWR(
    quizId ? `/quiz/${quizId}` : null,
    async () => {
      if (!quizId) return null;
      return quizzesService.getQuizDetail(quizId);
    },
    {
      revalidateOnFocus: options?.revalidateOnFocus ?? false,
      dedupingInterval: 60000,
    }
  );

  return {
    quiz: data || null,
    isLoading: !error && !data && !!quizId,
    error: error instanceof Error ? error : null,
  };
}

/**
 * Hook for fetching admin quiz list with pagination/filtering
 */
export function useAdminQuizzes(
  params?: AdminQuizzesQueryParams,
  options?: { revalidateOnFocus?: boolean }
) {
  const queryString = params
    ? `?${Object.entries(params)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => `${k}=${v}`)
        .join("&")}`
    : "";

  const { data, error, isLoading } = useSWR(
    `/admin/quizzes${queryString}`,
    async () => {
      return quizzesService.getAdminQuizzes(params);
    },
    {
      revalidateOnFocus: options?.revalidateOnFocus ?? false,
      dedupingInterval: 60000,
    }
  );

  return {
    response: data || {
      success: true,
      data: [],
      pagination: {
        page: 1,
        page_size: 20,
        total_items: 0,
        total_pages: 0,
        has_next: false,
        has_prev: false,
      },
    },
    isLoading: !error && !data,
    error: error instanceof Error ? error : null,
  };
}

/**
 * Legacy hook for backward compatibility
 */
export function useQuiz(quizId?: string) {
  return useQuizDetail(quizId);
}
