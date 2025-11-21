/**
 * API Response types
 */

export interface ApiSuccessResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  data: null;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

/**
 * Level Management Types (API v1.0)
 */
export type LevelStatus = "draft" | "active" | "archived";
export type FormLevel = "Form 1" | "Form 2" | "Form 3" | "Form 4";

export interface Level {
  _id: string;
  level_number: number;
  title: string;
  description: string;
  form_level: FormLevel;
  subject: string;
  xp_required: number;
  completion_percentage_required: number;
  total_xp_reward: number;
  quiz_ids: string[];
  is_starter_level: boolean;
  prerequisites: string[];
  difficulty_rating: number; // 1-5
  tags: string[];
  bonus_coins: number;
  status: LevelStatus;
  is_active: boolean;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
}

export interface LevelDetail extends Level {
  quiz_count?: number;
  user_progress?: {
    completion_percentage: number;
    current_quiz_index: number;
    xp_earned: number;
    is_unlocked: boolean;
  };
}

export interface LevelCreateInput {
  level_number: number;
  title: string;
  description: string;
  form_level: FormLevel;
  subject: string;
  xp_required?: number;
  completion_percentage_required?: number;
  total_xp_reward: number;
  quiz_ids?: string[];
  is_starter_level?: boolean;
  prerequisites?: string[];
  difficulty_rating?: number;
  tags?: string[];
  bonus_coins?: number;
  status?: LevelStatus;
}

export interface LevelsListResponse {
  success: boolean;
  message?: string;
  data: Level[];
}

export interface AdminLevelsListResponse {
  success: boolean;
  message?: string;
  data: Level[];
  meta: {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
  };
}

export interface AdminLevelsQueryParams {
  page?: number;
  per_page?: number;
  subject?: string;
  form_level?: FormLevel;
  status?: LevelStatus;
  search?: string;
  sort_by?: "level_number" | "title" | "created_at" | "difficulty_rating";
  sort_order?: "asc" | "desc";
  include_archived?: boolean;
}
