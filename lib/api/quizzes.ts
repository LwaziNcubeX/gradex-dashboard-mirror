import { API_URL, getHeaders, handleApiResponse, ApiError } from "./common";
import { ResponseType } from "@/constants/types";

export interface QuizType {
  _id: string;
  title: string;
  description: string;
  subject: string;
  questions: string[];
  timeLimit: number;
  totalPoints: number;
  status: "draft" | "published" | "archived";
  created_at: string;
  updated_at: string;
  created_by: string;
}

interface FetchQuizzesResponse extends ResponseType {
  data: QuizType[];
}

class QuizService {
  public async fetchQuizzes(): Promise<QuizType[]> {
    try {
      const response = await fetch(`${API_URL}/quizzes`, {
        method: "GET",
        headers: getHeaders(),
        cache: "no-store",
      });

      const data = await handleApiResponse<FetchQuizzesResponse>(response);
      return data.data || [];
    } catch (error) {
      console.error("Failed to fetch quizzes:", error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error("Failed to fetch quizzes");
    }
  }

  public async getQuiz(quizId: string): Promise<QuizType> {
    if (!quizId) {
      throw new Error("Quiz ID is required");
    }

    try {
      const response = await fetch(`${API_URL}/quizzes/${quizId}`, {
        method: "GET",
        headers: getHeaders(),
        cache: "no-store",
      });

      const data = await handleApiResponse<{ data: QuizType }>(response);
      return data.data;
    } catch (error) {
      console.error(`Failed to fetch quiz ${quizId}:`, error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error("Failed to fetch quiz");
    }
  }
}

export const quizService = new QuizService();
