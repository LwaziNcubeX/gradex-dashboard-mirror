import { API_URL, getHeaders, handleApiResponse, ApiError } from "./common";

export interface OverviewData {
  students: {
    total: number;
    active_today: number;
    new_this_week: number;
  };
  teachers: { total: number };
  content: {
    quizzes: number;
    questions: number;
    levels: number;
  };
  subject_distribution: { subject: string; count: number }[];
}

export interface AnalyticsData {
  daily_registrations: { date: string; count: number }[];
  xp_by_level: { level: number; avg_xp: number; student_count: number }[];
  top_quizzes: {
    _id: string;
    title: string;
    subject: string;
    completion_count: number;
    average_score: number;
  }[];
  subject_performance: {
    subject: string;
    attempts: number;
    avg_score: number;
  }[];
}

class AdminService {
  async getOverview(token?: string): Promise<OverviewData> {
    const response = await fetch(`${API_URL}/overview`, {
      method: "GET",
      headers: getHeaders(token),
      cache: "no-store",
    });
    const data = await handleApiResponse<{
      success: boolean;
      data: OverviewData;
    }>(response);
    return data.data;
  }

  async getAnalytics(token?: string): Promise<AnalyticsData> {
    const response = await fetch(`${API_URL}/analytics`, {
      method: "GET",
      headers: getHeaders(token),
      cache: "no-store",
    });
    const data = await handleApiResponse<{
      success: boolean;
      data: AnalyticsData;
    }>(response);
    return data.data;
  }
}

export const adminService = new AdminService();
