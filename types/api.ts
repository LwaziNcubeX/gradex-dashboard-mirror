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
 * Level-Based Quiz Types
 */
export interface LevelQuiz {
  _id: string;
  title: string;
  description?: string;
  subject: string;
  category?: string;
  level: string;
  xp_reward: number;
  question_count?: number;
}

export interface LevelQuizzesListResponse {
  quizzes: LevelQuiz[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface LevelQuizzesGroupedByLevel {
  [level: string]: LevelQuiz[];
}
