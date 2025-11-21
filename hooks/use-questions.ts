"use client";

import { useState, useCallback, useEffect } from "react";
import useSWR, { mutate } from "swr";
import {
  getAllQuestions,
  getQuestionDetail,
  getAdminQuestions,
  createQuestion as createQuestionAPI,
  updateQuestion as updateQuestionAPI,
  deleteQuestion as deleteQuestionAPI,
  bulkUploadQuestions as bulkUploadQuestionsAPI,
} from "@/services/questions";
import {
  Question,
  QuestionCreateInput,
  AdminQuestionsQueryParams,
} from "@/types/api";

export interface UseQuestionsOptions {
  page?: number;
  pageSize?: number;
  subject?: string;
  topic?: string;
  level?: string;
  tags?: string[];
  skipFetch?: boolean;
}

export interface UseAdminQuestionsOptions extends AdminQuestionsQueryParams {
  skipFetch?: boolean;
}

// Export Question type for components
export type { Question };

/**
 * Main hook for fetching all questions with state management
 * Uses state-based fetching with local state and API caching
 */
export function useQuestions(options: UseQuestionsOptions = {}) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchQuestions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAllQuestions(options.subject);
      const typedQuestions: Question[] = (response as any[]).map(
        (question: any) => ({
          _id: question._id,
          question_text: question.question_text,
          answers: question.answers,
          correct_answer: question.correct_answer,
          subject: question.subject,
          topic: question.topic,
          level: question.level,
          explanation: question.explanation,
          hint: question.hint,
          tags: question.tags || [],
          points: question.points || 10,
          time_limit_seconds: question.time_limit_seconds || 60,
          difficulty_score: question.difficulty_score,
          status: question.status || "draft",
          created_at: question.created_at,
          updated_at: question.updated_at,
        })
      );
      setQuestions(typedQuestions);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch questions")
      );
    } finally {
      setIsLoading(false);
    }
  }, [options.subject]);

  // Initial fetch
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const createQuestion = useCallback(
    async (data: QuestionCreateInput) => {
      try {
        await createQuestionAPI(data);
        await fetchQuestions();
      } catch (err) {
        throw err instanceof Error
          ? err
          : new Error("Failed to create question");
      }
    },
    [fetchQuestions]
  );

  const updateQuestion = useCallback(
    async (id: string, data: Partial<QuestionCreateInput>) => {
      try {
        await updateQuestionAPI(id, data);
        await fetchQuestions();
      } catch (err) {
        throw err instanceof Error
          ? err
          : new Error("Failed to update question");
      }
    },
    [fetchQuestions]
  );

  const deleteQuestion = useCallback(
    async (id: string) => {
      try {
        await deleteQuestionAPI(id);
        await fetchQuestions();
      } catch (err) {
        throw err instanceof Error
          ? err
          : new Error("Failed to delete question");
      }
    },
    [fetchQuestions]
  );

  const bulkUpload = useCallback(
    async (file: File) => {
      try {
        const result = await bulkUploadQuestionsAPI(file);
        await fetchQuestions();
        return result;
      } catch (err) {
        throw err instanceof Error
          ? err
          : new Error("Failed to bulk upload questions");
      }
    },
    [fetchQuestions]
  );

  // Filter questions based on options for pagination simulation
  const filtered = questions.filter((q) => {
    if (options.topic && q.topic !== options.topic) return false;
    if (options.level && q.level !== options.level) return false;
    if (options.tags?.length && !options.tags.some((t) => q.tags?.includes(t)))
      return false;
    return true;
  });

  const page = options.page || 1;
  const pageSize = options.pageSize || 20;
  const start = (page - 1) * pageSize;
  const paginatedQuestions = filtered.slice(start, start + pageSize);

  return {
    questions: paginatedQuestions,
    total: filtered.length,
    page,
    pageSize,
    totalPages: Math.ceil(filtered.length / pageSize),
    isLoading,
    error,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    bulkUpload,
    refetch: fetchQuestions,
  };
}

/**
 * Hook to fetch all active questions for the user
 */
export function useAllQuestions(
  subject?: string,
  options: { skipFetch?: boolean } = {}
) {
  const { skipFetch = false } = options;
  const cacheKey = skipFetch ? null : `questions:all:${subject || "all"}`;

  const { data, error, isLoading } = useSWR(
    cacheKey,
    async () => await getAllQuestions(subject),
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000 * 60 * 5, // 5 minutes
    }
  );

  const refetch = () => mutate(cacheKey);

  return {
    questions: data || [],
    isLoading,
    error: error as Error | undefined,
    refetch,
  };
}

/**
 * Hook to fetch a single question with details
 */
export function useQuestionDetail(
  questionId: string | null,
  options: { skipFetch?: boolean } = {}
) {
  const { skipFetch = false } = options;
  const cacheKey =
    skipFetch || !questionId ? null : `question:detail:${questionId}`;

  const { data, error, isLoading } = useSWR(
    cacheKey,
    async () => questionId && (await getQuestionDetail(questionId)),
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000 * 60 * 5, // 5 minutes
    }
  );

  const refetch = () => mutate(cacheKey);

  return {
    question: data || null,
    isLoading,
    error: error as Error | undefined,
    refetch,
  };
}

/**
 * Hook to fetch paginated admin questions list with filters and sorting
 */
export function useAdminQuestions(options: UseAdminQuestionsOptions = {}) {
  const {
    skipFetch = false,
    page = 1,
    per_page = 20,
    subject,
    level,
    topic,
    status,
    search,
    sort_by,
    sort_order,
    tags,
  } = options;

  const cacheKey = skipFetch
    ? null
    : `admin:questions:${page}:${per_page}:${subject || ""}:${level || ""}:${
        topic || ""
      }:${status || ""}:${search || ""}:${sort_by || ""}:${sort_order || ""}:${
        tags?.join(",") || ""
      }`;

  const { data, error, isLoading } = useSWR(
    cacheKey,
    async () =>
      await getAdminQuestions({
        page,
        per_page,
        subject,
        level,
        topic,
        status,
        search,
        sort_by,
        sort_order,
        tags,
      }),
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000 * 60 * 5, // 5 minutes
    }
  );

  const refetch = () => mutate(cacheKey);

  return {
    questions: data?.data || [],
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
 * Legacy hook - kept for backward compatibility
 */
export function useQuestion(questionId: string | null) {
  const { question, error, isLoading, refetch } = useQuestionDetail(questionId);

  return {
    question,
    isLoading,
    error,
    refetch,
  };
}
