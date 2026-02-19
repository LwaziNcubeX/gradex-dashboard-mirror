import { API_URL, getHeaders, handleApiResponse, ApiError } from "./common";
import { ResponseType } from "@/constants/types";

export interface LevelType {
  _id: string;
  level_number: number;
  title: string;
  description: string;
  form_level: "Form 1" | "Form 2" | "Form 3" | "Form 4";
  subject: string;
  xp_required: number;
  total_xp_reward: number;
  completion_percentage_required: number;
  quiz_ids: string[];
  is_starter_level: boolean;
  prerequisites: string[];
  bonus_coins: number;
  is_active: boolean;
  status: "draft" | "active" | "archived";
  created_at: string;
  updated_at: string;
}

export interface CreateLevelPayload {
  level_number: number;
  title: string;
  description?: string;
  form_level: "Form 1" | "Form 2" | "Form 3" | "Form 4";
  subject: string;
  xp_required?: number;
  completion_percentage_required?: number;
  total_xp_reward?: number;
  quiz_ids?: string[];
  is_starter_level?: boolean;
  prerequisites?: string[];
  bonus_coins?: number;
  tags?: string[];
  estimated_duration_minutes?: number;
  status?: "draft" | "active" | "archived";
}

export type UpdateLevelPayload = Partial<
  Omit<CreateLevelPayload, "level_number" | "form_level" | "subject">
>;

class LevelService {
  public async getLevels(subject?: string): Promise<LevelType[]> {
    try {
      const qs = subject ? `?subject=${encodeURIComponent(subject)}` : "";
      const response = await fetch(`${API_URL}/levels${qs}`, {
        method: "GET",
        headers: getHeaders(),
        cache: "no-store",
      });
      const data = await handleApiResponse<{
        success: boolean;
        data: LevelType[];
      }>(response);
      return data.data || [];
    } catch (error) {
      console.error("Failed to fetch levels:", error);
      if (error instanceof ApiError) throw error;
      throw new Error("Failed to fetch levels");
    }
  }

  public async getLevel(levelId: string): Promise<LevelType> {
    if (!levelId) throw new Error("Level ID is required");
    try {
      const response = await fetch(`${API_URL}/levels/${levelId}`, {
        method: "GET",
        headers: getHeaders(),
        cache: "no-store",
      });
      const data = await handleApiResponse<{
        success: boolean;
        data: LevelType;
      }>(response);
      return data.data;
    } catch (error) {
      console.error(`Failed to fetch level ${levelId}:`, error);
      if (error instanceof ApiError) throw error;
      throw new Error("Failed to fetch level");
    }
  }

  public async createLevel(payload: CreateLevelPayload): Promise<LevelType> {
    try {
      const response = await fetch(`${API_URL}/levels`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await handleApiResponse<{
        success: boolean;
        data: LevelType;
      }>(response);
      return data.data;
    } catch (error) {
      console.error("Failed to create level:", error);
      if (error instanceof ApiError) throw error;
      throw new Error("Failed to create level");
    }
  }

  public async updateLevel(
    levelId: string,
    payload: UpdateLevelPayload,
  ): Promise<LevelType> {
    if (!levelId) throw new Error("Level ID is required");
    try {
      const response = await fetch(`${API_URL}/levels/${levelId}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await handleApiResponse<{
        success: boolean;
        data: LevelType;
      }>(response);
      return data.data;
    } catch (error) {
      console.error(`Failed to update level ${levelId}:`, error);
      if (error instanceof ApiError) throw error;
      throw new Error("Failed to update level");
    }
  }

  public async deleteLevel(levelId: string): Promise<boolean> {
    if (!levelId) throw new Error("Level ID is required");
    try {
      const response = await fetch(`${API_URL}/levels/${levelId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      const data = await handleApiResponse<ResponseType>(response);
      return data.success;
    } catch (error) {
      console.error(`Failed to delete level ${levelId}:`, error);
      if (error instanceof ApiError) throw error;
      throw new Error("Failed to delete level");
    }
  }
}

export const levelService = new LevelService();
