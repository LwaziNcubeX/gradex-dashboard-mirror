import { API_URL, getHeaders, handleApiResponse, ApiError } from "./common";
import { ResponseType } from "@/constants/types";

export interface QuizType {
  _id: string;
  title: string;
  description: string;
  subject: string;
  level: "Form 1" | "Form 2" | "Form 3" | "Form 4";
  questions: string[];
  duration: number;
  xp_reward: number;
  completion_count: number;
  average_score: number;
  status: "draft" | "active" | "archived";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginatedQuizzes {
  success: boolean;
  data: QuizType[];
  pagination: {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface CreateQuizPayload {
  title: string;
  description?: string;
  subject: string;
  level: "Form 1" | "Form 2" | "Form 3" | "Form 4";
  duration?: number;
  questions?: string[];
  xp_reward?: number;
  level_id?: string;
  tags?: string[];
  is_active?: boolean;
}

export type UpdateQuizPayload = Partial<
  CreateQuizPayload & { status: "draft" | "active" | "archived" }
>;

export interface QuizFilters {
  subject?: string;
  level?: string;
  status?: string;
  page?: number;
  page_size?: number;
}

class QuizService {
  public async fetchQuizzes(
    filters: QuizFilters = {},
  ): Promise<PaginatedQuizzes> {
    try {
      const qs = new URLSearchParams();
      if (filters.page) qs.set("page", String(filters.page));
      if (filters.page_size) qs.set("page_size", String(filters.page_size));
      if (filters.subject) qs.set("subject", filters.subject);
      if (filters.level) qs.set("level", filters.level);
      if (filters.status) qs.set("status", filters.status);
      const query = qs.toString() ? `?${qs.toString()}` : "";

      const response = await fetch(`${API_URL}/quizzes${query}`, {
        method: "GET",
        headers: getHeaders(),
        cache: "no-store",
      });
      return await handleApiResponse<PaginatedQuizzes>(response);
    } catch (error) {
      console.error("Failed to fetch quizzes:", error);
      if (error instanceof ApiError) throw error;
      throw new Error("Failed to fetch quizzes");
    }
  }

  public async getQuiz(
    quizId: string,
    includeQuestions = false,
  ): Promise<QuizType> {
    if (!quizId) throw new Error("Quiz ID is required");
    try {
      const query = includeQuestions ? "?include_questions=true" : "";
      const response = await fetch(`${API_URL}/quizzes/${quizId}${query}`, {
        method: "GET",
        headers: getHeaders(),
        cache: "no-store",
      });
      const data = await handleApiResponse<{
        success: boolean;
        data: QuizType;
      }>(response);
      return data.data;
    } catch (error) {
      console.error(`Failed to fetch quiz ${quizId}:`, error);
      if (error instanceof ApiError) throw error;
      throw new Error("Failed to fetch quiz");
    }
  }

  public async createQuiz(payload: CreateQuizPayload): Promise<QuizType> {
    try {
      const response = await fetch(`${API_URL}/quizzes`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await handleApiResponse<{
        success: boolean;
        data: QuizType;
      }>(response);
      return data.data;
    } catch (error) {
      console.error("Failed to create quiz:", error);
      if (error instanceof ApiError) throw error;
      throw new Error("Failed to create quiz");
    }
  }

  public async updateQuiz(
    quizId: string,
    payload: UpdateQuizPayload,
  ): Promise<QuizType> {
    if (!quizId) throw new Error("Quiz ID is required");
    try {
      const response = await fetch(`${API_URL}/quizzes/${quizId}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await handleApiResponse<{
        success: boolean;
        data: QuizType;
      }>(response);
      return data.data;
    } catch (error) {
      console.error(`Failed to update quiz ${quizId}:`, error);
      if (error instanceof ApiError) throw error;
      throw new Error("Failed to update quiz");
    }
  }

  public async deleteQuiz(quizId: string): Promise<boolean> {
    if (!quizId) throw new Error("Quiz ID is required");
    try {
      const response = await fetch(`${API_URL}/quizzes/${quizId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      const data = await handleApiResponse<ResponseType>(response);
      return data.success;
    } catch (error) {
      console.error(`Failed to delete quiz ${quizId}:`, error);
      if (error instanceof ApiError) throw error;
      throw new Error("Failed to delete quiz");
    }
  }
}

export const quizService = new QuizService();
