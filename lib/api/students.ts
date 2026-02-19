import { API_URL, ApiError, getHeaders, handleApiResponse } from "./common";
import { ResponseType, StudentType } from "@/constants/types";

export interface StudentDetail {
  profile: StudentType & {
    total_xp: number;
    current_level: number;
    streak_days: number;
    quizzes_completed: number;
    last_login_at: string;
    created_at: string;
    email: string;
  };
  recent_attempts: {
    _id: string;
    quiz_id: string;
    total_score: number;
    max_score: number;
    submitted_at: string;
  }[];
  level_progress: {
    level_id: string;
    level_status: string;
    completion_percentage: number;
    xp_earned: number;
  }[];
}

export interface PaginatedStudents {
  success: boolean;
  data: StudentType[];
  pagination: {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface FetchStudentsParams {
  page?: number;
  page_size?: number;
  search?: string;
  status?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

class StudentService {
  public async getAllStudents(
    params: FetchStudentsParams = {},
    token?: string,
  ): Promise<PaginatedStudents> {
    try {
      const qs = new URLSearchParams();
      if (params.page) qs.set("page", String(params.page));
      if (params.page_size) qs.set("page_size", String(params.page_size));
      if (params.search) qs.set("search", params.search);
      if (params.status) qs.set("status", params.status);
      if (params.sort_by) qs.set("sort_by", params.sort_by);
      if (params.sort_order) qs.set("sort_order", params.sort_order);

      const query = qs.toString() ? `?${qs.toString()}` : "";
      const response = await fetch(`${API_URL}/students${query}`, {
        method: "GET",
        headers: getHeaders(token),
        cache: "no-store",
      });

      return await handleApiResponse<PaginatedStudents>(response);
    } catch (error) {
      console.error("Failed to fetch students:", error);
      if (error instanceof ApiError) throw error;
      throw new Error("Failed to fetch students");
    }
  }

  public async getStudent(userId: string): Promise<StudentDetail> {
    try {
      const response = await fetch(`${API_URL}/students/${userId}`, {
        method: "GET",
        headers: getHeaders(),
        cache: "no-store",
      });
      const data = await handleApiResponse<{
        success: boolean;
        data: StudentDetail;
      }>(response);
      return data.data;
    } catch (error) {
      console.error(`Failed to fetch student ${userId}:`, error);
      if (error instanceof ApiError) throw error;
      throw new Error("Failed to fetch student");
    }
  }

  public async getStudentActivity(userId: string, limit = 20) {
    try {
      const response = await fetch(
        `${API_URL}/students/${userId}/activity?limit=${limit}`,
        {
          method: "GET",
          headers: getHeaders(),
          cache: "no-store",
        },
      );
      const data = await handleApiResponse<{ success: boolean; data: any[] }>(
        response,
      );
      return data.data;
    } catch (error) {
      console.error(`Failed to fetch activity for ${userId}:`, error);
      return [];
    }
  }

  public async updateStudentStatus(
    userId: string,
    status: string,
  ): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/students/${userId}/status`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({ status }),
      });
      const data = await handleApiResponse<ResponseType>(response);
      return data.success;
    } catch (error) {
      console.error(`Failed to update status for ${userId}:`, error);
      if (error instanceof ApiError) throw error;
      throw new Error("Failed to update student status");
    }
  }
}

export const studentService = new StudentService();
