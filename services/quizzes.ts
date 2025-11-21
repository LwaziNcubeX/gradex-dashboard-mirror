import { apiGet, apiPost, apiPatch, apiPut, apiDelete } from "@/lib/api";
import type {
  Quiz,
  QuizDetail,
  QuizCreateInput,
  AdminQuizzesQueryParams,
  AdminQuizzesListResponse,
  QuizzesListResponse,
  BulkUploadQuizzesResponse,
} from "@/types/api";

/**
 * Get all quizzes (user-facing, paginated)
 * Optionally filter by subject
 */
export async function getAllQuizzes(subject?: string): Promise<Quiz[]> {
  const params = new URLSearchParams();
  if (subject) params.append("subject", subject);

  const response = await apiGet<QuizzesListResponse>(
    `/quiz/list${params.toString() ? "?" + params.toString() : ""}`
  );
  return response.data || [];
}

/**
 * Get a single quiz by ID with details
 */
export async function getQuizDetail(quizId: string): Promise<QuizDetail> {
  const response = await apiGet<QuizDetail>(`/quiz/${quizId}`);
  return response;
}

/**
 * Get admin paginated list of quizzes with filtering and sorting
 */
export async function getAdminQuizzes(
  queryParams?: AdminQuizzesQueryParams
): Promise<AdminQuizzesListResponse> {
  const params = new URLSearchParams();

  if (queryParams) {
    if (queryParams.page) params.append("page", String(queryParams.page));
    if (queryParams.per_page)
      params.append("per_page", String(queryParams.per_page));
    if (queryParams.subject) params.append("subject", queryParams.subject);
    if (queryParams.level) params.append("level", queryParams.level);
    if (queryParams.category) params.append("category", queryParams.category);
    if (queryParams.status) params.append("status", queryParams.status);
    if (queryParams.search) params.append("search", queryParams.search);
    if (queryParams.sort_by) params.append("sort_by", queryParams.sort_by);
    if (queryParams.sort_order)
      params.append("sort_order", queryParams.sort_order);
    if (queryParams.tags && queryParams.tags.length > 0)
      params.append("tags", queryParams.tags.join(","));
  }

  const response = await apiGet<AdminQuizzesListResponse>(`/quiz/list`);
  return response;

  // ${params.toString() ? "?" + params.toString() : ""}
}

/**
 * Create a new quiz
 */
export async function createQuiz(data: QuizCreateInput): Promise<Quiz> {
  const response = await apiPost<Quiz>("/quiz/create", data);
  return response;
}

/**
 * Update an existing quiz
 */
export async function updateQuiz(
  quizId: string,
  data: Partial<QuizCreateInput>
): Promise<Quiz> {
  const response = await apiPut<Quiz>(`/quiz/${quizId}`, data);
  return response;
}

/**
 * Delete a quiz
 */
export async function deleteQuiz(quizId: string): Promise<void> {
  await apiDelete(`/quiz/${quizId}`);
}

/**
 * Change quiz status (draft, active, archived)
 */
export async function changeQuizStatus(
  quizId: string,
  status: "draft" | "active" | "archived"
): Promise<Quiz> {
  const response = await apiPut<Quiz>(`/quiz/${quizId}/status`, { status });
  return response;
}

/**
 * Bulk upload quizzes from file
 */
export async function bulkUploadQuizzes(
  file: File
): Promise<BulkUploadQuizzesResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL || "https://api-gradex.rapidshyft.com/v1"
    }/quiz/bulk-upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to upload quizzes");
  }

  const result = await response.json();
  return result.data;
}
