import { apiGet, apiPost, apiPatch } from "@/lib/api";
import {
  Level,
  LevelDetail,
  LevelCreateInput,
  AdminLevelsListResponse,
  AdminLevelsQueryParams,
  FormLevel,
  LevelStatus,
} from "@/types/api";

/**
 * Form levels available in the system
 */
export const AVAILABLE_LEVELS: FormLevel[] = [
  "Form 1",
  "Form 2",
  "Form 3",
  "Form 4",
];

/**
 * Get all active levels (user-facing)
 * GET /levels
 * Returns all active levels with optional filtering by subject
 */
export async function getAllLevels(subject?: string): Promise<Level[]> {
  const params: Record<string, string> = {};
  if (subject) params.subject = subject;

  const response = await apiGet<{ success: boolean; data: Level[] }>(
    "/levels",
    {
      params,
    }
  );
  return response.data || [];
}

/**
 * Get level detail by ID
 * GET /levels/{level_id}
 * Includes user-specific progress if authenticated
 */
export async function getLevelDetail(levelId: string): Promise<LevelDetail> {
  const response = await apiGet<{ success: boolean; data: LevelDetail }>(
    `/levels/${levelId}`
  );
  return response.data;
}

/**
 * Unlock a level for the current user
 * POST /levels/{level_id}/unlock
 * Checks prerequisites and XP requirements before unlocking
 */
export async function unlockLevel(levelId: string): Promise<Level> {
  const response = await apiPost<{ success: boolean; data: Level }>(
    `/levels/${levelId}/unlock`,
    {}
  );
  return response.data;
}

/**
 * Get admin paginated list of levels with filters and sorting
 * GET /admin/levels
 * Requires teacher or admin role
 */
export async function getAdminLevels(
  queryParams?: AdminLevelsQueryParams
): Promise<AdminLevelsListResponse> {
  const params: Record<string, any> = {
    page: queryParams?.page || 1,
    per_page: queryParams?.per_page || 20,
  };

  if (queryParams?.subject) params.subject = queryParams.subject;
  if (queryParams?.form_level) params.form_level = queryParams.form_level;
  if (queryParams?.status) params.status = queryParams.status;
  if (queryParams?.search) params.search = queryParams.search;
  if (queryParams?.sort_by) params.sort_by = queryParams.sort_by;
  if (queryParams?.sort_order) params.sort_order = queryParams.sort_order;
  if (queryParams?.include_archived !== undefined) {
    params.include_archived = queryParams.include_archived;
  }

  const response = await apiGet<AdminLevelsListResponse>("/admin/levels", {
    params,
  });
  return response;
}

/**
 * Create a new level (admin or teacher only)
 * POST /levels
 */
export async function createLevel(data: LevelCreateInput): Promise<Level> {
  const response = await apiPost<{ success: boolean; data: Level }>(
    "/levels",
    data
  );
  return response.data;
}

/**
 * Update an existing level (admin or teacher only)
 * PATCH /levels/{level_id}
 */
export async function updateLevel(
  levelId: string,
  data: Partial<LevelCreateInput>
): Promise<Level> {
  const response = await apiPatch<{ success: boolean; data: Level }>(
    `/levels/${levelId}`,
    data
  );
  return response.data;
}

/**
 * Change level status (publish/draft/archive)
 * PATCH /levels/{level_id}/status
 * Requires teacher or admin role
 */
export async function changeLevelStatus(
  levelId: string,
  status: LevelStatus
): Promise<Level> {
  const response = await apiPatch<Level>(`/levels/${levelId}/status`, {
    status,
  });
  return response;
}

/**
 * Restore a level (revert soft delete)
 * POST /levels/{level_id}/restore
 * Admin only
 */
export async function restoreLevel(levelId: string): Promise<Level> {
  const response = await apiPost<Level>(`/levels/${levelId}/restore`, {});
  return response;
}

/**
 * Bulk import levels
 * POST /levels/bulk
 * Admin only
 */
export async function bulkImportLevels(
  levels: LevelCreateInput[]
): Promise<{ success: boolean; data: any[] }> {
  const response = await apiPost<any[]>("/levels/bulk", { levels });
  return response as any;
}
