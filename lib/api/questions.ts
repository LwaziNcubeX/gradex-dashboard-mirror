import { API_URL, getHeaders, handleApiResponse, ApiError } from "./common";
import { ResponseType, QuestionType } from "@/constants/types";

interface FetchQuestionsResponse extends ResponseType {
  data: QuestionType[];
}

interface DeleteQuestionResponse extends ResponseType {
  data: { id: string; deleted: boolean };
}

export interface QuestionFilters {
  subject?: string;
  difficulty?: "Form 1" | "Form 2" | "Form 3" | "Form 4" | "Mixed";
  topic?: string;
  status?: "draft" | "active" | "archive" | "flagged";
}

class QuestionService {
  private buildQueryString(filters: QuestionFilters): string {
    const params = new URLSearchParams();

    if (filters.subject) params.append("subject", filters.subject);
    if (filters.difficulty) params.append("difficulty", filters.difficulty);
    if (filters.topic) params.append("topic", filters.topic);
    if (filters.status) params.append("status", filters.status);

    const queryString = params.toString();
    return queryString ? `?${queryString}` : "";
  }

  public async fetchQuestions(filters?: QuestionFilters): Promise<QuestionType[]> {
    try {
      const queryString = filters ? this.buildQueryString(filters) : "";
      const response = await fetch(`${API_URL}/questions${queryString}`, {
        method: "GET",
        headers: getHeaders(),
        cache: "no-store",
      });

      const data = await handleApiResponse<FetchQuestionsResponse>(response);
      return data.data || [];
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error("Failed to fetch questions");
    }
  }

  public async getQuestion(questionId: string): Promise<QuestionType> {
    if (!questionId) {
      throw new Error("Question ID is required");
    }

    try {
      const response = await fetch(`${API_URL}/questions/${questionId}`, {
        method: "GET",
        headers: getHeaders(),
        cache: "no-store",
      });

      const data = await handleApiResponse<{ data: QuestionType }>(response);
      return data.data;
    } catch (error) {
      console.error(`Failed to fetch question ${questionId}:`, error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error("Failed to fetch question");
    }
  }

  public async deleteQuestion(questionId: string): Promise<boolean> {
    if (!questionId) {
      throw new Error("Question ID is required");
    }

    try {
      const response = await fetch(`${API_URL}/questions/${questionId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      const data = await handleApiResponse<DeleteQuestionResponse>(response);
      return data.data?.deleted || false;
    } catch (error) {
      console.error(`Failed to delete question ${questionId}:`, error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error("Failed to delete question");
    }
  }
}

export const questionService = new QuestionService();
