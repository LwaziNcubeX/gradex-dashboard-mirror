"use client";

import useSWR, { mutate } from "swr";
import {
  questionsService,
  Question,
  QuestionCreateRequest,
} from "@/services/questions";

export interface UseQuestionsOptions {
  page?: number;
  pageSize?: number;
  subject?: string;
  topic?: string;
  level?: string;
  tags?: string[];
  skipFetch?: boolean;
}

export function useQuestions(options: UseQuestionsOptions = {}) {
  const {
    page = 1,
    pageSize = 20,
    subject,
    topic,
    level,
    tags,
    skipFetch = false,
  } = options;

  // Build a stable cache key
  const cacheKey = skipFetch
    ? null
    : `questions:list:${page}:${pageSize}:${subject || ""}:${topic || ""}:${
        level || ""
      }:${tags?.join(",") || ""}`;

  const { data, error, isLoading } = useSWR(
    cacheKey,
    async () =>
      await questionsService.listQuestions(page, pageSize, {
        subject,
        topic,
        level,
        tags,
      }),
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000 * 60 * 5, // 5 minutes
    }
  );

  const createQuestion = async (payload: QuestionCreateRequest) => {
    const result = await questionsService.createQuestion(payload);
    // Revalidate the questions list
    mutate(cacheKey);
    return result;
  };

  const deleteQuestion = async (questionId: string) => {
    await questionsService.deleteQuestion(questionId);
    // Revalidate the questions list
    mutate(cacheKey);
  };

  const updateQuestion = async (
    questionId: string,
    payload: Partial<QuestionCreateRequest>
  ) => {
    const result = await questionsService.updateQuestion(questionId, payload);
    // Revalidate the questions list
    mutate(cacheKey);
    return result;
  };

  const bulkUpload = async (file: File) => {
    const result = await questionsService.bulkUploadQuestions(file);
    // Revalidate the questions list
    mutate(cacheKey);
    return result;
  };

  return {
    questions: data?.items || [],
    total: data?.total || 0,
    page: data?.page || 1,
    pageSize: data?.page_size || 20,
    totalPages: data?.total_pages || 1,
    isLoading,
    error,
    createQuestion,
    deleteQuestion,
    updateQuestion,
    bulkUpload,
    refetch: () => mutate(cacheKey),
  };
}

/**
 * Hook to fetch a single question
 */
export function useQuestion(questionId: string | null) {
  const { data, error, isLoading } = useSWR(
    questionId ? `questions:${questionId}` : null,
    async () => await questionsService.getQuestion(questionId!),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    question: data || null,
    isLoading,
    error,
    refetch: () => mutate(`questions:${questionId}`),
  };
}
