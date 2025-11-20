/**
 * Questions API Service
 * Handles all question-related API calls
 */

import { apiPost, apiGet, apiPut, apiDelete } from "@/lib/api";

export interface QuestionCreateRequest {
  question_text: string;
  answers: string[];
  correct_answer: string;
  subject: string;
  topic?: string;
  level?: string;
  explanation?: string;
  hint?: string;
  tags?: string[];
  points?: number;
  time_limit_seconds?: number;
}

export interface Question extends QuestionCreateRequest {
  _id: string;
  difficulty_score?: number;
  created_at?: string;
}

export interface QuestionListResponse {
  success: boolean;
  data: Question[];
  count?: number;
  total?: number;
}

export interface QuestionResponse {
  success: boolean;
  data: Question;
}

export interface BulkUploadResponse {
  success: boolean;
  message: string;
  data: {
    imported_count: number;
    failed_count: number;
  };
}

/**
 * Create a new question
 */
export async function createQuestion(
  payload: QuestionCreateRequest
): Promise<{ question_id: string }> {
  const response = await apiPost<{ question_id: string }>(
    "/questions/create",
    payload
  );
  return response;
}

/**
 * Get all questions with pagination and filtering
 */
export async function listQuestions(
  page: number = 1,
  pageSize: number = 20,
  filters?: {
    subject?: string;
    topic?: string;
    level?: string;
    tags?: string[];
  }
): Promise<{
  items: Question[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}> {
  const params: Record<string, any> = {
    page,
    page_size: pageSize,
  };

  if (filters?.subject) params.subject = filters.subject;
  if (filters?.topic) params.topic = filters.topic;
  if (filters?.level) params.level = filters.level;
  if (filters?.tags?.length) {
    params.tags = filters.tags.join(",");
  }

  try {
    // The apiGet already extracts the `data` field, so we get the array directly
    const items = await apiGet<Question[]>("/questions", { params });

    // For now, assume all items are returned (simple list)
    // TODO: Update when backend pagination is implemented
    const total = Array.isArray(items) ? items.length : 0;

    return {
      items: Array.isArray(items) ? items : [],
      total,
      page,
      page_size: pageSize,
      total_pages: Math.ceil(total / pageSize),
    };
  } catch (err) {
    console.error("Failed to list questions:", err);
    return {
      items: [],
      total: 0,
      page,
      page_size: pageSize,
      total_pages: 0,
    };
  }
}

/**
 * Get a single question by ID
 */
export async function getQuestion(questionId: string): Promise<Question> {
  const response = await apiGet<Question>(`/questions/${questionId}`);
  return response;
}

/**
 * Update a question
 */
export async function updateQuestion(
  questionId: string,
  payload: Partial<QuestionCreateRequest>
): Promise<Question> {
  const response = await apiPut<Question>(`/questions/${questionId}`, payload);
  return response;
}

/**
 * Delete a question
 */
export async function deleteQuestion(questionId: string): Promise<void> {
  await apiDelete<void>(`/questions/${questionId}`);
}

/**
 * Bulk upload questions via CSV file
 */
export async function bulkUploadQuestions(
  file: File
): Promise<BulkUploadResponse["data"]> {
  const formData = new FormData();
  formData.append("file", file);

  const url = `${
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
  }/questions/bulk-upload`;
  const token =
    typeof window !== "undefined"
      ? document.cookie.split("gradex_access_token=")[1]?.split(";")[0]
      : null;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload questions");
  }

  const data = (await response.json()) as BulkUploadResponse;
  return data.data;
}

export const questionsService = {
  createQuestion,
  listQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion,
  bulkUploadQuestions,
};
