/**
 * Questions API Service
 * Handles all question-related API calls using the latest API v1.0
 */

import { apiPost, apiGet, apiPut, apiDelete } from "@/lib/api";
import {
  Question,
  QuestionCreateInput,
  QuestionsListResponse,
  AdminQuestionsListResponse,
  AdminQuestionsQueryParams,
  QuestionStatus,
  BulkUploadQuestionsResponse,
} from "@/types/api";

/**
 * Get all active questions (user-facing)
 * GET /questions
 */
export async function getAllQuestions(subject?: string): Promise<Question[]> {
  const params: Record<string, string> = {};
  if (subject) params.subject = subject;

  const response = await apiGet<Question[]>("/questions", {
    params,
  });
  return response;
}

/**
 * Get a single question by ID
 * GET /questions/{question_id}
 */
export async function getQuestionDetail(questionId: string): Promise<Question> {
  const response = await apiGet<Question>(`/questions/${questionId}`);
  return response;
}

/**
 * Get admin paginated list of questions with filters and sorting
 * GET /admin/questions
 * Requires teacher or admin role
 */
export async function getAdminQuestions(
  queryParams?: AdminQuestionsQueryParams
): Promise<AdminQuestionsListResponse> {
  const params: Record<string, any> = {
    page: queryParams?.page || 1,
    per_page: queryParams?.per_page || 20,
  };

  if (queryParams?.subject) params.subject = queryParams.subject;
  if (queryParams?.level) params.level = queryParams.level;
  if (queryParams?.topic) params.topic = queryParams.topic;
  if (queryParams?.status) params.status = queryParams.status;
  if (queryParams?.search) params.search = queryParams.search;
  if (queryParams?.sort_by) params.sort_by = queryParams.sort_by;
  if (queryParams?.sort_order) params.sort_order = queryParams.sort_order;
  if (queryParams?.tags?.length) params.tags = queryParams.tags.join(",");

  const response = await apiGet<AdminQuestionsListResponse>(
    "/admin/questions",
    { params }
  );
  return response;
}

/**
 * Create a new question (admin or teacher only)
 * POST /questions/create
 */
export async function createQuestion(
  data: QuestionCreateInput
): Promise<Question> {
  const response = await apiPost<Question>("/questions/create", data);
  return response;
}

/**
 * Update an existing question (admin or teacher only)
 * PUT /questions/{question_id}
 */
export async function updateQuestion(
  questionId: string,
  data: Partial<QuestionCreateInput>
): Promise<Question> {
  const response = await apiPut<Question>(`/questions/${questionId}`, data);
  return response;
}

/**
 * Delete a question
 * DELETE /questions/{question_id}
 */
export async function deleteQuestion(questionId: string): Promise<void> {
  await apiDelete<void>(`/questions/${questionId}`);
}

/**
 * Change question status
 * PATCH /questions/{question_id}/status
 */
export async function changeQuestionStatus(
  questionId: string,
  status: QuestionStatus
): Promise<Question> {
  const response = await apiPut<Question>(`/questions/${questionId}/status`, {
    status,
  });
  return response;
}

/**
 * Bulk upload questions via CSV
 * POST /questions/bulk-upload
 * Admin or teacher only
 */
export async function bulkUploadQuestions(
  file: File
): Promise<BulkUploadQuestionsResponse["data"]> {
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

  const data = (await response.json()) as BulkUploadQuestionsResponse;
  return data.data;
}
