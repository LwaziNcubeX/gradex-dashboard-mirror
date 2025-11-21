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

/**
 * Question Management Types (API v1.0)
 */
export type QuestionStatus = "draft" | "active" | "archived";

export interface Question {
  _id: string;
  question_text: string;
  answers: string[];
  correct_answer: string;
  subject: string;
  topic?: string;
  level?: FormLevel;
  explanation?: string;
  hint?: string;
  tags?: string[];
  points?: number;
  time_limit_seconds?: number;
  difficulty_score?: number;
  status: QuestionStatus;
  created_at: string;
  updated_at?: string;
}

export interface QuestionCreateInput {
  question_text: string;
  answers: string[];
  correct_answer: string;
  subject: string;
  topic?: string;
  level?: FormLevel;
  explanation?: string;
  hint?: string;
  tags?: string[];
  points?: number;
  time_limit_seconds?: number;
  status?: QuestionStatus;
}

export interface QuestionsListResponse {
  success: boolean;
  message?: string;
  data: Question[];
}

export interface AdminQuestionsListResponse {
  success: boolean;
  message?: string;
  data: Question[];
  meta: {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
  };
}

export interface AdminQuestionsQueryParams {
  page?: number;
  per_page?: number;
  subject?: string;
  level?: FormLevel;
  topic?: string;
  status?: QuestionStatus;
  search?: string;
  sort_by?: "created_at" | "difficulty_score" | "points";
  sort_order?: "asc" | "desc";
  tags?: string[];
}

export interface BulkUploadQuestionsResponse {
  success: boolean;
  message: string;
  data: {
    imported_count: number;
    failed_count: number;
    errors?: Array<{ row: number; error: string }>;
  };
}

/**
 * Quiz Management Types (API v1.0)
 */
export type QuizStatus = "draft" | "active" | "archived";

export interface Quiz {
  _id: string;
  title: string;
  description: string;
  subject: string;
  category?: string;
  tags?: string[];
  duration: number; // seconds
  level: FormLevel;
  questions: string[]; // array of question IDs
  level_id?: string;
  xp_reward: number;
  difficulty_score: number; // 0.1-5.0
  completion_count?: number;
  average_score?: number;
  status: QuizStatus;
  is_active: boolean;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
}

export interface QuizDetail extends Quiz {
  question_count?: number;
  user_attempts?: number;
  user_best_score?: number;
}

export interface QuizCreateInput {
  title: string;
  description: string;
  subject: string;
  category?: string;
  tags?: string[];
  duration: number;
  level: FormLevel;
  questions?: string[];
  level_id?: string;
  xp_reward: number;
  difficulty_score: number;
  status?: QuizStatus;
  is_active?: boolean;
}

export interface QuizzesListResponse {
  success: boolean;
  message?: string;
  data: Quiz[];
}

export interface AdminQuizzesListResponse {
  success: boolean;
  message?: string;
  data: Quiz[];
  meta: {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
  };
}

export interface AdminQuizzesQueryParams {
  page?: number;
  per_page?: number;
  subject?: string;
  level?: FormLevel;
  category?: string;
  status?: QuizStatus;
  search?: string;
  sort_by?: "created_at" | "difficulty_score" | "title";
  sort_order?: "asc" | "desc";
  tags?: string[];
}

export interface BulkUploadQuizzesResponse {
  success: boolean;
  message: string;
  data: {
    imported_count: number;
    failed_count: number;
    errors?: Array<{ row: number; error: string }>;
  };
}
