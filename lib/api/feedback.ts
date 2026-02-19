import { API_URL, getHeaders, handleApiResponse, ApiError } from "./common";

export type FeedbackStatus = "pending" | "reviewed" | "resolved" | "dismissed";
export type FeedbackType =
  | "bug"
  | "suggestion"
  | "complaint"
  | "praise"
  | "other";

export interface FeedbackItem {
  _id: string;
  user_id: string;
  user_name?: string;
  avatar?: string;
  type: FeedbackType;
  message: string;
  rating?: number;
  status: FeedbackStatus;
  created_at: string;
  updated_at?: string;
}

export interface PaginatedFeedback {
  success: boolean;
  data: FeedbackItem[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

export interface FetchFeedbackParams {
  page?: number;
  page_size?: number;
  feedback_type?: FeedbackType;
  status?: FeedbackStatus;
}

class FeedbackService {
  public async getFeedback(
    params: FetchFeedbackParams = {},
  ): Promise<PaginatedFeedback> {
    try {
      const qs = new URLSearchParams();
      if (params.page) qs.set("page", String(params.page));
      if (params.page_size) qs.set("page_size", String(params.page_size));
      if (params.feedback_type) qs.set("feedback_type", params.feedback_type);
      if (params.status) qs.set("status", params.status);

      const url = `${API_URL}/feedback${qs.toString() ? `?${qs}` : ""}`;
      const response = await fetch(url, {
        method: "GET",
        headers: getHeaders(),
        cache: "no-store",
      });
      return await handleApiResponse<PaginatedFeedback>(response);
    } catch (error) {
      console.error("Failed to fetch feedback:", error);
      if (error instanceof ApiError) throw error;
      throw new Error("Failed to fetch feedback");
    }
  }

  public async updateStatus(
    feedbackId: string,
    status: FeedbackStatus,
  ): Promise<boolean> {
    if (!feedbackId) throw new Error("Feedback ID is required");
    try {
      const response = await fetch(`${API_URL}/feedback/${feedbackId}/status`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({ status }),
      });
      const data = await handleApiResponse<{ success: boolean }>(response);
      return data.success;
    } catch (error) {
      console.error(`Failed to update feedback status ${feedbackId}:`, error);
      if (error instanceof ApiError) throw error;
      throw new Error("Failed to update feedback status");
    }
  }
}

export const feedbackService = new FeedbackService();
