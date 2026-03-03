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
    is_premium?: boolean;
    premium_expires_at?: string;
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

export interface PremiumUpgradeResponse {
  success: boolean;
  message: string;
  data: {
    user_id: string;
    is_premium: boolean;
    premium_expires_at: string;
    amount: number;
    days: number;
  };
}

export interface PremiumTransaction {
  _id: string;
  user_id: string;
  student_name: string;
  amount: number;
  days: number;
  transaction_id: string;
  admin_user_id: string;
  activated_at: string;
  expires_at: string;
}

export interface FinanceOverview {
  total_revenue: number;
  monthly_revenue: number;
  weekly_revenue: number;
  total_premium_users: number;
  active_premium_users: number;
  expired_premium_users: number;
  recent_transactions: PremiumTransaction[];
  monthly_chart: { month: string; revenue: number; upgrades: number }[];
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

  /** Upgrade a student to premium ($2 = 30 days) */
  public async upgradeToPremium(
    userId: string,
    amount: number,
    transactionId: string,
  ): Promise<PremiumUpgradeResponse> {
    try {
      const response = await fetch(`${API_URL}/students/${userId}/premium`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({
          amount,
          transaction_id: transactionId,
        }),
      });
      return await handleApiResponse<PremiumUpgradeResponse>(response);
    } catch (error) {
      console.error(`Failed to upgrade ${userId} to premium:`, error);
      if (error instanceof ApiError) throw error;
      throw new Error("Failed to upgrade student to premium");
    }
  }

  /** Get finance / revenue overview */
  public async getFinanceOverview(): Promise<FinanceOverview> {
    try {
      const response = await fetch(`${API_URL}/finance/overview`, {
        method: "GET",
        headers: getHeaders(),
        cache: "no-store",
      });
      const data = await handleApiResponse<{
        success: boolean;
        data: FinanceOverview;
      }>(response);
      return data.data;
    } catch (error) {
      console.error("Failed to fetch finance overview:", error);
      if (error instanceof ApiError) throw error;
      throw new Error("Failed to fetch finance data");
    }
  }
}

export const studentService = new StudentService();
