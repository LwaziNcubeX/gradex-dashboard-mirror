# GradeX Dashboard — Complete Implementation Plan

> **Scope:** Full-stack. Backend (FastAPI) + Frontend (Next.js 15). No game modes. No tests.
> **Goal:** Zero dummy data. Zero dead buttons. Zero missing pages. Production-grade.

---

## What We're Building

An admin/teacher dashboard for the GradeX platform. Authenticated admins can:

- See live platform KPIs (students, quizzes, XP, scores)
- Manage questions (CRUD + bulk import)
- Manage quizzes (CRUD)
- Manage levels (CRUD)
- Browse and search all students
- View real analytics (engagement, subject distribution, performance trends)
- Manage their own profile and settings

---

## Decisions Made

| Question                   | Answer                                                                                                                                              |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Finance page               | **Keep** — deferred to Phase 8. Will be premium upgrade system ($2 / 30 days per `user_id`). Sidebar link stays; page is a proper placeholder stub. |
| Feedback page              | **Keep** — no backend yet. Replace hardcoded fake data with proper empty state + "coming soon" messaging.                                           |
| Dashboard KPI endpoint     | Build new `GET /admin/overview` — replaces the broken hardcoded `http://0.0.0.0:8000/overview/questions` call.                                      |
| Teacher permissions        | **Read-only** on quizzes and levels. Can **create/edit** questions. Only **admin** can delete anything or mutate quizzes/levels.                    |
| Dark / light mode          | **Dark only — permanent.** Apply `class="dark"` on `<html>`. Remove `next-themes`, remove Appearance section from Settings.                         |
| Subjects (canonical 5)     | `Mathematics`, `English`, `Geography`, `History`, `Combined Science` — used everywhere, backed by `utils/constants.py`.                             |
| Student detail             | **Slide-out `<Sheet>`** — profile, XP/level/streak stats, game mode breakdown, last 10 quiz attempts.                                               |
| Production API URL         | `https://api-gradex.rapidshyft.com` (from CORS config in `main.py`)                                                                                 |
| `top_performers` threshold | Students with `total_xp >= 500` count as top performers.                                                                                            |

---

## PHASE 1 — Backend: Critical Bug Fixes

These must be fixed before any frontend integration is meaningful.

### 1.1 `models/quiz/quiz.py`

- **Fix `delete_by_id()`:** replace `{"_id": quiz_id}` → `{"_id": ObjectId(quiz_id)}`
- **Fix `submit_result()`:** same `_id` string-vs-ObjectId bug
- **Fix `get()`:** remove `{"$sample": {"size": 100}}` size cap; replace with proper limit param

### 1.2 `models/core/user.py`

- **Fix `User.__init__`:** remove `self.user_id = "custom user id"` — user_id must be generated per-user via `GenerateCustom.user_id(db)` inside `create()`
- **Add `update_streak(user_id)`:** method referenced in routes but missing — implement it (check `last_activity`, increment `streak_days` if consecutive day, reset otherwise, update `longest_streak`)

### 1.3 `api/routes/user_progress.py`

- **Fix `GET /user/analytics/questions`:** unawaited coroutine inside `sum()` for average mastery — convert to proper `await` calls with explicit loop

### 1.4 `models/quiz/levels.py`

- **Fix `update_level_progress()`:** `quiz_id` is a string but stored entries are `ObjectId` — normalize comparison (convert both to string before `in` check)

### 1.5 `api/common/auth/email_auth.py`

- **Fix `role_required` decorator:** broken with FastAPI DI. Remove `@role_required("admin")` usage from all routes and replace with the working `Depends(email_auth_instance.require_role([...]))` pattern that already exists on `EmailAuth`. Remove the top-level `role_required` function entirely.

### 1.6 `utils/types.py`

- **Fix `PyObjectId`:** replace Pydantic v1 `__get_validators__` with Pydantic v2 `__get_pydantic_core_schema__`

### 1.7 `utils/constants.py`

- Update `VALID_SUBJECTS` to canonical 5:
  ```python
  VALID_SUBJECTS = ["Mathematics", "English", "Geography", "History", "Combined Science"]
  ```
- Start importing `VALID_SUBJECTS` and `DIFFICULTY_LEVELS` in models/routes instead of hardcoding strings

---

## PHASE 2 — Backend: New Dashboard Endpoints

All new routes live under `/admin` prefix. Role rules:

- `GET` endpoints: `admin` + `teacher`
- `POST`, `PUT`, `DELETE` on quizzes/levels: `admin` only
- `POST`, `PUT` on questions: `admin` + `teacher`
- `DELETE` on questions: `admin` only

### 2.1 Overview / KPIs — `api/dashboard/overview.py` (new file)

**`GET /admin/overview`**  
Aggregates and returns dashboard KPIs in a single call.

Response shape:

```json
{
  "success": true,
  "data": {
    "students": { "total": int, "active_today": int, "new_this_week": int },
    "questions": { "total": int, "active": int, "draft": int, "flagged": int },
    "quizzes": { "total": int, "active": int },
    "levels": { "total": int, "active": int },
    "xp": { "total_awarded": int },
    "avg_score": float,
    "top_subjects": [{ "subject": str, "quiz_count": int }]
  }
}
```

Implementation: One async function doing parallel `db.find`/`count_documents` calls with `asyncio.gather`. No MongoDB aggregation required — simple counts.

---

### 2.2 Quiz CRUD — `api/dashboard/content/quizzes.py` (currently empty)

| Method   | Path                         | Body               | Description                                                                       |
| -------- | ---------------------------- | ------------------ | --------------------------------------------------------------------------------- |
| `GET`    | `/admin/quizzes`             | —                  | List all quizzes, filters: `subject`, `status`, `difficulty`, `page`, `page_size` |
| `GET`    | `/admin/quizzes/{id}`        | —                  | Single quiz with questions embedded                                               |
| `POST`   | `/admin/quizzes`             | `QuizCreateSchema` | Create quiz                                                                       |
| `PUT`    | `/admin/quizzes/{id}`        | `QuizUpdateSchema` | Update quiz                                                                       |
| `DELETE` | `/admin/quizzes/{id}`        | —                  | Soft delete (archive)                                                             |
| `POST`   | `/admin/quizzes/bulk-import` | multipart file     | Reuse existing `quiz.bulk_import` pattern                                         |

`QuizCreateSchema` fields: `title`, `description`, `subject`, `category`, `tags`, `duration`, `difficulty`, `questions: List[str]`, `level_id?`, `xp_reward`, `status` (default `"draft"`)

---

### 2.3 Levels CRUD — `api/dashboard/content/levels.py` (currently empty)

| Method   | Path                 | Body                | Description                                                        |
| -------- | -------------------- | ------------------- | ------------------------------------------------------------------ |
| `GET`    | `/admin/levels`      | —                   | List all levels, filters: `subject`, `form_level`, `is_active`     |
| `GET`    | `/admin/levels/{id}` | —                   | Single level with quizzes embedded                                 |
| `POST`   | `/admin/levels`      | `LevelCreateSchema` | Create level                                                       |
| `PUT`    | `/admin/levels/{id}` | `LevelUpdateSchema` | Update level                                                       |
| `DELETE` | `/admin/levels/{id}` | —                   | Soft delete (`is_active: false`) — reuse `level_instance.delete()` |

`LevelCreateSchema` fields: `level_number`, `title`, `description`, `form_level`, `subject`, `xp_required`, `completion_percentage_required`, `total_xp_reward`, `quiz_ids: List[str]`, `is_starter_level`, `prerequisites: List[str]`

---

### 2.4 Questions — `api/dashboard/content/questions.py` (extend existing)

| Method | Path                           | Body                   | Description                                                         |
| ------ | ------------------------------ | ---------------------- | ------------------------------------------------------------------- |
| `GET`  | `/admin/questions/{id}`        | —                      | **Add missing single-question fetch**                               |
| `POST` | `/admin/questions`             | `QuestionCreateSchema` | **Add missing create endpoint**                                     |
| `PUT`  | `/admin/questions/{id}`        | `QuestionUpdateSchema` | **Add missing update endpoint**                                     |
| `POST` | `/admin/questions/bulk-import` | multipart file         | **Add missing bulk import (reuse `question_instance.bulk_import`)** |

`QuestionCreateSchema` = same as `QuestionCreateSchema` in `api/routes/quiz/question.py` — reuse it via import.

---

### 2.5 Students — `api/dashboard/students/__init__.py` (extend existing)

| Method | Path                        | Description                                                                    |
| ------ | --------------------------- | ------------------------------------------------------------------------------ |
| `GET`  | `/admin/students`           | **Extend:** add `search`, `status`, `page`, `page_size` query params           |
| `GET`  | `/admin/students/{user_id}` | **Add:** single student detail with stats                                      |
| `GET`  | `/admin/students/stats`     | **Add:** aggregate counts — total, active today, new this week, top performers |

**`GET /admin/students` extended response:**

```json
{
  "success": true,
  "data": [ ...student array... ],
  "pagination": { "page": 1, "page_size": 20, "total_items": int, "total_pages": int }
}
```

Each student object: `user_id, first_name, last_name, email, status, role, total_xp, current_level, quizzes_completed, average_quiz_score, streak_days, last_login, created_at`

**`GET /admin/students/stats` response:**

```json
{
  "success": true,
  "data": {
    "total": int,
    "active_today": int,
    "new_this_week": int,
    "top_performers": int
  }
}
```

**`GET /admin/students/{user_id}` response:**
Full user document + `game_mode_stats`, `achievements`, `recent_attempts` (last 10), `quiz_completion_history`

---

### 2.6 Analytics — `api/dashboard/analytics.py` (new file)

| Method | Path                           | Description                                                    |
| ------ | ------------------------------ | -------------------------------------------------------------- |
| `GET`  | `/admin/analytics/overview`    | 6-month student registrations + quiz completions by month      |
| `GET`  | `/admin/analytics/scores`      | Score distribution buckets (0-20, 21-40, 41-60, 61-80, 81-100) |
| `GET`  | `/admin/analytics/subjects`    | Quiz attempts per subject (for donut chart)                    |
| `GET`  | `/admin/analytics/leaderboard` | Top 10 students by XP                                          |

Query param on `overview`: `months: int = 6`

---

### 2.7 Register routers in `main.py`

New and existing dashboard routers that need to be included:

```python
from api.dashboard.content.questions import admin_question_router     # already done
from api.dashboard.students import students_router                     # already done
from api.dashboard.content.quizzes import admin_quiz_router            # new
from api.dashboard.content.levels import admin_level_router            # new
from api.dashboard.overview import admin_overview_router               # new
from api.dashboard.analytics import admin_analytics_router             # new
```

---

## PHASE 3 — Frontend: Cleanup & Refactoring

Must happen before building new features — bad foundations cause bugs.

### 3.1 Environment & Config

- **`next.config.ts`:** declare `NEXT_PUBLIC_API_URL` in `env` block
- **`lib/api/common.ts`:** remove dead `typeof window` branch; keep `API_BASE_URL` and `API_URL`
- **Remove `lib/auth-config.ts`:** entire file is dead code — delete it
- **Remove `proxy.ts.txt`:** dead scaffolding — delete it
- **`lib/cookie-manager.ts`:** set `secure: process.env.NODE_ENV === 'production'` so local dev works
- **`login-form.tsx`:** replace hardcoded `http://0.0.0.0:8000` URLs with `process.env.NEXT_PUBLIC_API_URL`
- **`components/content/questions.tsx`:** replace hardcoded `http://0.0.0.0:8000/overview/questions` with `${API_BASE_URL}/admin/overview`

### 3.2 TypeScript Types — Full Rewrite of `constants/types.ts`

```typescript
// Canonical subjects (5 only)
export const SUBJECTS = [
  "Mathematics",
  "English",
  "Geography",
  "History",
  "Combined Science",
] as const;
export type Subject = (typeof SUBJECTS)[number];

export const DIFFICULTY_LEVELS = [
  "Form 1",
  "Form 2",
  "Form 3",
  "Form 4",
] as const;
export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];

export type QuestionType = {
  _id: string;
  question_text: string;
  answers: string[];
  correct_answer: string;
  subject: Subject;
  topic: string;
  difficulty: DifficultyLevel;
  explanation: string;
  hint: string;
  tags: string[];
  points: number;
  time_limit_seconds: number;
  status: "active" | "draft" | "archive" | "flagged";
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type QuizType = {
  _id: string;
  title: string;
  description: string;
  subject: Subject;
  category: string;
  tags: string[];
  duration: number;
  difficulty: DifficultyLevel;
  questions: string[];
  level_id?: string;
  xp_reward: number;
  difficulty_score: number;
  completion_count: number;
  status: "active" | "draft" | "archived";
  created_at: string;
  updated_at: string;
};

export type LevelType = {
  _id: string;
  level_number: number;
  title: string;
  description: string;
  form_level: DifficultyLevel;
  subject: Subject;
  xp_required: number;
  completion_percentage_required: number;
  total_xp_reward: number;
  quiz_ids: string[];
  is_starter_level: boolean;
  prerequisites: string[];
  is_active: boolean;
  created_at: string;
};

export type StudentType = {
  _id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: "active" | "inactive" | "disabled";
  role: string;
  total_xp: number;
  current_level: number;
  quizzes_completed: number;
  average_quiz_score: number;
  streak_days: number;
  longest_streak: number;
  last_login: string;
  created_at: string;
};

export type StudentDetail = StudentType & {
  game_mode_stats: {
    arcade: { attempts: number; completed: number };
    speed_run: { attempts: number; completed: number };
    wild_card: { attempts: number; completed: number };
  };
  recent_attempts: {
    quiz_id: string;
    quiz_title: string;
    score: number;
    max_score: number;
    percentage: number;
    submitted_at: string;
  }[];
};

export type OverviewStats = {
  students: { total: number; active_today: number; new_this_week: number };
  questions: { total: number; active: number; draft: number; flagged: number };
  quizzes: { total: number; active: number };
  levels: { total: number; active: number };
  platform: {
    total_xp_awarded: number;
    avg_quiz_score: number;
    total_quiz_completions: number;
  };
  top_subjects: { subject: string; quiz_count: number }[];
};

export type AnalyticsMonth = {
  month: string;
  students: number;
  quizzes: number;
};
export type ScoreBucket = { range: string; count: number };
export type SubjectStat = {
  subject: string;
  attempts: number;
  percentage: number;
};
export type LeaderboardEntry = {
  rank: number;
  user_id: string;
  first_name: string;
  last_name: string;
  total_xp: number;
  current_level: number;
  quizzes_completed: number;
  streak_days: number;
};

export type Pagination = {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
};
export type PaginatedResponse<T> = {
  success: boolean;
  data: T[];
  pagination: Pagination;
};
```

- Fix `getDifficultyColor`: handle all 4 form levels + default
- Fix `getStatusIcon` return type: `React.ComponentType<{ className?: string }>`
- Remove `QuestionTable`, `StudentTableHeader`, `SubjectsList` loose constants — defined inline in components going forward

### 3.3 API Service Layer

New and extended services in `lib/api/`:

| File                   | New/Changed | Methods to Add                                                                             |
| ---------------------- | ----------- | ------------------------------------------------------------------------------------------ |
| `lib/api/quizzes.ts`   | extend      | `createQuiz`, `updateQuiz`, `deleteQuiz`, `bulkImportQuizzes`                              |
| `lib/api/questions.ts` | extend      | `createQuestion`, `updateQuestion`, `bulkImportQuestions`                                  |
| `lib/api/levels.ts`    | **new**     | `fetchLevels`, `getLevel`, `createLevel`, `updateLevel`, `deleteLevel`                     |
| `lib/api/overview.ts`  | **new**     | `getOverviewStats`                                                                         |
| `lib/api/analytics.ts` | **new**     | `getAnalyticsOverview`, `getScoreDistribution`, `getSubjectDistribution`, `getLeaderboard` |
| `lib/api/students.ts`  | extend      | `getStudent`, `getStudentStats`, add `search`/`page` params to `getAllStudents`            |

All methods follow the same pattern: `getHeaders()`, `handleApiResponse()`, throw `ApiError` on failure.

### 3.4 Hooks

| Hook                           | Action                    | Why                                                                                              |
| ------------------------------ | ------------------------- | ------------------------------------------------------------------------------------------------ |
| `lib/hooks/useAuth.ts`         | Wire into `Header` logout | Currently exists but is never used                                                               |
| `lib/hooks/useTokenRefresh.ts` | Call on 401 API responses | Dead hook — wire it into `handleApiResponse` in `lib/api/common.ts` as automatic 401 interceptor |
| `lib/hooks/useOverview.ts`     | **new**                   | Fetches `GET /admin/overview`, provides data + loading + error                                   |
| `lib/hooks/useAnalytics.ts`    | **new**                   | Fetches all analytics endpoints with optional date range param                                   |
| `lib/hooks/useStudents.ts`     | **new**                   | Students list with search, pagination, stats                                                     |
| `lib/hooks/useQuizzes.ts`      | **new**                   | Quiz list with filters + CRUD operations                                                         |
| `lib/hooks/useLevels.ts`       | **new**                   | Levels list + CRUD operations                                                                    |
| `lib/hooks/useQuestions.ts`    | **new**                   | Extract questions state from `components/content/questions.tsx` into a reusable hook             |

### 3.5 Dark Mode — Permanent (no toggle)

- `npm uninstall next-themes` — not needed
- In `app/layout.tsx`: add `className="dark"` to `<html>` element — dark styles always active
- Remove Appearance card from `app/settings/page.tsx` entirely
- No `ThemeProvider`, no `useTheme`, no toggle buttons anywhere

### 3.6 App-Level Wiring

- **`app/layout.tsx`:** add `<Toaster richColors position="top-right" />` from `sonner`
- **`app/layout.tsx`:** remove `@vercel/analytics` import (Cloudflare deployment — irrelevant unless intentional)
- **`components/fonts/index.ts`:** register `Oswald` font alongside `Inter`; export both — fix `font-oswald` Tailwind class that currently references an unregistered font
- **`middleware.ts`:** remove dead `isPublicRoute` variable (computed but never used)
- **`app/api/auth/check/route.ts`:** do NOT delete `refreshToken` when only access token is expired — only clear both when refresh token is also expired/missing

### 3.7 Form Migration

Migrate all forms to `react-hook-form` + `zod`:

- `components/auth/login-form.tsx` — step 1: `{ email: z.string().email() }`; step 2: `{ otp: z.string().length(6).regex(/^\d+$/) }`; add **Resend OTP** button with 60s cooldown timer
- `components/settings/profile-settings.tsx` — `{ first_name: z.string().min(1).max(50), last_name: z.string().min(1).max(50) }`
- All new forms (question/quiz/level create+edit) use `react-hook-form` + `zod` from the start

---

## PHASE 4 — Frontend: Fix Existing Pages

### 4.1 Navigation & Layout

**`components/sidebar.tsx`:**

- **Keep Finance** nav item — update `href` to `/finance` (page will exist as placeholder from Phase 4.8)
- Add `<Tooltip>` (Radix `TooltipProvider` + `Tooltip` + `TooltipTrigger` + `TooltipContent`) around each `NavItem` — show `label` text on hover since sidebar is icon-only; currently icons have no labels visible at all
- Remove all dead imports: `Label` (recharts), `DropdownMenu`, `Avatar`, `FileText`, `Copy`, `Edit`, `MoreHorizontal`, `Trash2`, `LogOut`, `CreditCard`

**`components/header.tsx`:**

- Fix typo: `"Content Managment"` → `"Content Management"`
- Wire logout: import `useAuth`, call `logout()` on the logout `DropdownMenuItem` `onClick`
- Import `useProfile`, use `profile.first_name[0] + profile.last_name[0]` as `<AvatarFallback>` initials
- Display admin's name in the dropdown from `useProfile`
- Remove unused imports: `Search`, `Bell`, `Settings2`, `FileText`, `Copy`, `Edit`, `MoreHorizontal`, `Trash2`, `CreditCard`, `Label`

**`components/mobile-nav.tsx`** _(new)_:

- A `<Sheet>` opening from the left
- Contains same nav items as sidebar but with visible text labels
- Receives `open` + `onClose` props from `DashboardLayout`

**`components/dashboard-layout.tsx`:**

- Uncomment mobile nav slot; mount new `<MobileNav>` component
- Wire `isMobileMenuOpen` state + `onMobileMenuToggle` through to `Header` hamburger

### 4.2 Dashboard Overview — `app/page.tsx`

Replace all 7 hardcoded components with real-data equivalents:

| Component             | Data Source                                                                   | Change                                                                             |
| --------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `DashboardMetrics`    | `GET /admin/overview` via `useOverview`                                       | Replace hardcoded constants with API data                                          |
| `PerformanceChart`    | `GET /admin/analytics/overview`                                               | Replace hardcoded arrays; period buttons (1W/1M/3M/6M) filter the date range param |
| `SubjectDistribution` | `GET /admin/analytics/subjects`                                               | Replace hardcoded donut data                                                       |
| `TopStudents`         | `GET /admin/analytics/leaderboard`                                            | Replace hardcoded leaderboard                                                      |
| `TopQuizzes`          | `GET /admin/quizzes?sort=completion_count&limit=5`                            | Replace hardcoded table                                                            |
| `RecentActivity`      | Derived from recent student registrations + quiz completions in overview data | Replace hardcoded feed                                                             |
| `QuickActions`        | Static links (keep) but fix URLs to deep-link into content tabs               | Minor fix only                                                                     |

Add skeleton loading states to every card using `<Skeleton>` (already in UI library).  
Add error boundary per card — one failed fetch doesn't break the whole dashboard.

**`DashboardMetrics` fix:** Fix the "Avg. Time/Quiz" `trend: "up"` when change is negative — trend arrow should reflect direction of numeric change.

### 4.3 Students Page — `app/students/page.tsx`

- Replace 4 hardcoded metric cards with data from `GET /admin/students/stats`
- Wire search, pagination into `StudentsTable`
- Fix search bug in `components/students/students.tsx`: second filter condition should check `first_name + last_name`, not duplicate `user_id`
- Fix pagination: replace hardcoded "1 2 3" buttons with dynamic page generation from `pagination.total_pages`
- Fix `RANK POS` column: sort by `total_xp` descending in the API response and use `index + 1` as rank position
- Fix `avgScore` / `streak` columns: map to `average_quiz_score` and `streak_days` from the real API field names (per `data.json` schema)
- Remove hardcoded `avatarColors` array from page (currently defined but unused)
- Add a student detail sheet/modal: clicking a row opens `GET /admin/students/{user_id}` detail

### 4.4 Content Page — `app/content/page.tsx`

This page needs the most work. Three tabs, all production-ready.

**Questions tab** (already partially real):

- ✅ List with filters — working
- ✅ Delete — working
- Add **"Add Question"** button → opens a `<Dialog>` with a form (react-hook-form + zod)
  - Fields: question_text, answers (dynamic array min 2), correct_answer (select from answers), subject, topic, difficulty, explanation, hint, tags, points, time_limit_seconds, status
- Add **"Edit"** action → opens same dialog pre-filled with existing question data
- Add **"Duplicate"** action → POST create with `...existing, status: "draft"`
- Add **Bulk Import** button → file input accepts `.json`, calls `POST /admin/questions/bulk-import`
- Fix **"Times Used"** column: add a `times_used` or `usage_count` field to question API response (or remove the column if the backend doesn't track it)
- Remove `"use client"` inconsistency — add directive to `questions.tsx` directly

**Quizzes tab** (currently 100% dummy):

- Wire to `GET /admin/quizzes` via `useQuizzes` hook
- Summary metric cards: `total`, `active` count from API
- Search: filter by `title` client-side OR add `search` query param to API
- **"Create Quiz"** → opens `<Dialog>` with form:
  - Fields: title, description, subject, category, tags, duration (seconds), difficulty, status, xp_reward
  - Multi-select question picker (searchable list of questions from `GET /admin/questions`)
  - Optional level assignment (select from `GET /admin/levels`)
- **"Edit"** action → same dialog pre-filled
- **"Duplicate"** action → create copy with `status: "draft"`
- **"Delete"** action → confirm dialog → `DELETE /admin/quizzes/{id}`
- Add **Bulk Import** button

**Levels tab** (currently 100% dummy):

- Wire to `GET /admin/levels` via `useLevels` hook
- Summary metric cards: `total`, `active` count from API
- **"Create Level"** → `<Dialog>` with form:
  - Fields: level_number, title, description, form_level (Form 1-4), subject, xp_required, completion_percentage_required, total_xp_reward, is_starter_level
  - Multi-select quiz picker (searchable list from `GET /admin/quizzes`)
  - Prerequisites multi-select (other levels)
- **"Edit"** action → same dialog pre-filled
- **"Delete"** action → confirm dialog → `DELETE /admin/levels/{id}`

### 4.5 Analytics Page — `app/analytics/page.tsx`

- Wire all 4 charts to real API data via `useAnalytics` hook
- **Student & Quiz Growth chart** → `GET /admin/analytics/overview?months=6` (or 3/12 based on dropdown)
- **Score Distribution bar chart** → `GET /admin/analytics/scores`
- **Quiz Activity by Subject donut** → `GET /admin/analytics/subjects`
- **Summary metric cards** → data from `GET /admin/overview`
- Wire the date range `<select>` to actually re-fetch with the selected range (30 days / 90 days / last year = 1/3/12 months)
- **Key Insights card** → derive from real data: "Most popular subject", "Avg score this month", "Most active form level"
- Add skeleton loading states

### 4.6 Settings Page — `app/settings/page.tsx`

**Profile section** (already works):

- Migrate to `react-hook-form` + `zod` (Phase 3.7)
- Replace inline `saveMessage` state with `toast.success()` / `toast.error()`

**Notifications section:**

- Load initial toggle values from `GET /auth/profile` → `preferences.notifications`
- On each toggle change → `PUT /auth/update/profile` with updated `preferences.notifications` object

**Security section:**

- The backend uses **OTP-only auth** — there are no passwords. Remove the fake password form entirely.
- Replace with: static note "GradeX uses passwordless sign-in via email OTP." + a **"Re-send Verification OTP"** button that calls `POST /auth/request-otp` for the current user's email

**Appearance section:**

- **Remove entirely** — dark mode is permanent, no toggle needed

**Language section:**

- On select change → `localStorage.setItem("gradex_lang", value)` + `toast.success("Language preference saved")`
- (Full i18n is out of scope)

**Data — Export:**

- "Export My Data" → `GET /user/progress` for current user → download as `gradex-data-{date}.json`

**Data — Delete Account:**

- Opens `<AlertDialog>`: "To delete your account contact hello@rapidshyft.com. This cannot be undone from the dashboard."
- No actual delete API call (endpoint doesn't exist yet)

### 4.7 Feedback Page — `app/feedback/page.tsx`

No backend endpoint exists. Replace hardcoded fake data:

- Set `feedbackItems = []` — drive all UI from this empty array
- Summary metric cards show all zeros
- Filter tabs shown but disabled when list is empty
- List area: show `<EmptyState>` component with icon + "No feedback yet" + "Student feedback will appear here once the feedback system is active."
- Remove "Load more feedback" button
- Add at top of file: `// TODO: Wire GET /admin/feedback when endpoint is available`

### 4.8 Finance Page — `app/finance/page.tsx` _(new — placeholder)_

Create a proper page so the sidebar `/finance` link doesn't 404.

```
Layout: DashboardLayout wrapper
Header: "Finance & Premium" + "Coming Soon" badge
Description: "Premium subscription management will be available here."

Info cards (static, no API):
  1. Premium Plan — $2.00 USD / 30 days per student
  2. Upgrade by User ID — "Enter a student User ID to grant premium access"
  3. Active Subscriptions — "0 active  •  Coming soon"

CTA: grayed-out "Upgrade Student" button (disabled, tooltip: "Available in a future update")
```

No API calls. Pure UI placeholder. Professionally designed, not a blank page.

---

## PHASE 5 — Toast Notifications (wire as you go, finalize here)

`<Toaster>` is added in Phase 3.6. In this phase, audit every mutation that doesn't yet have a toast and add them.

| Action                | Toast                                     |
| --------------------- | ----------------------------------------- |
| Login success         | `toast.success("Welcome back, {name}")`   |
| Logout                | `toast.success("Signed out")`             |
| Create question       | `toast.success("Question created")`       |
| Update question       | `toast.success("Question updated")`       |
| Delete question       | `toast.success("Question deleted")`       |
| Bulk import questions | `toast.success("Imported {n} questions")` |
| Create quiz           | `toast.success("Quiz created")`           |
| Update quiz           | `toast.success("Quiz updated")`           |
| Delete quiz           | `toast.success("Quiz archived")`          |
| Create level          | `toast.success("Level created")`          |
| Update level          | `toast.success("Level updated")`          |
| Delete level          | `toast.success("Level deactivated")`      |
| Profile saved         | `toast.success("Profile updated")`        |
| OTP requested         | `toast.success("OTP sent to {email}")`    |
| Any API error         | `toast.error(error.message)`              |

---

## PHASE 6 — Response Standardization (Backend)

All routes must return `APIResponse.success(data, message)` or `APIResponse.error(message)`. Currently inconsistent.

- Fix `api/dashboard/students/__init__.py` — `JSONResponse(content=str(e))` → `JSONResponse(content={"success": False, "message": str(e)})`
- Fix `api/common/auth/email_auth.py` — `GET /auth/profile` returns raw dict → wrap with `APIResponse.success()`
- All new Phase 2 routes use `APIResponse` from the start

---

## PHASE 7 — Cleanup

### Frontend

- Delete `lib/auth-config.ts` (dead code — never imported)
- Delete `proxy.ts.txt` (dead scaffolding)
- `npm uninstall @heroicons/react` — never used
- `npm uninstall next-themes` — replaced by permanent dark mode
- Remove unused imports per-file (all documented in the analysis above)
- Remove unused `avatarColors` array from `app/students/page.tsx`
- Use `debounce` from `lib/utils.ts` for the student search input — or remove it if still unused elsewhere
- Remove `components/students/data.json` — sample reference data, not needed in production
- Fix `lib/index.ts` barrel: ensure all new services exported, fix missing `studentService` export

### Backend

- Delete `api/routes/quiz/levels.py` (comment says "forget this file", no router defined)
- Delete `api/routes/user/schema.py` (empty file)
- Import `VALID_SUBJECTS`, `DIFFICULTY_LEVELS`, `VALID_ROLES` from `utils/constants.py` in all models/routes that currently inline these strings

---

## PHASE 8 — Finance (Future Sprint)

Frontend placeholder exists from Phase 4.8. Backend work needed when ready:

**Backend — new collection + endpoints:**

- `subscriptions` collection: `{ user_id, plan: "premium", price: 2.00, currency: "USD", started_at, expires_at, granted_by_admin_id }`
- `POST /admin/finance/upgrade` — body: `{ user_id }` → grant 30-day premium; set `user.preferences.is_premium = true` and `preferences.premium_expires_at`
- `GET /admin/finance/subscriptions` — paginated list of active subscriptions with expiry
- `GET /admin/finance/stats` — `{ active_subscriptions, expired_this_month, granted_this_month }`

**Frontend — wire `/finance` page:**

- "Upgrade Student" form: `user_id` input + confirm `<AlertDialog>`
- Active subscriptions table: `user_id`, `name`, `expires_at`, status badge (active/expired)
- Stats cards from `GET /admin/finance/stats`

---

## Execution Order

```
Phase 1 (Backend bugs)          Phase 3.1–3.7 (Frontend cleanup)
       ↓                               ↓
Phase 2 (New backend endpoints)  ←  (parallel OK)
       ↓
Phase 3.8+ (API services + hooks)
       ↓
Phase 4.1 (Nav fixes)
       ↓
Phase 4.2 (Dashboard)     Phase 4.3 (Students)
       ↓                         ↓
Phase 4.4 (Content — needs 2.2, 2.3, 2.4)
       ↓
Phase 4.5 (Analytics)  →  Phase 4.6 (Settings)  →  Phase 4.7–4.8 (Feedback + Finance stub)
       ↓
Phase 5 (Toast audit)  →  Phase 6 (Response standardization)  →  Phase 7 (Cleanup)
       ↓
Phase 8 (Finance — future sprint)
```

---

## Complete File Map

### Backend — New Files

| File                               | Purpose                                |
| ---------------------------------- | -------------------------------------- |
| `api/dashboard/overview.py`        | `GET /admin/overview`                  |
| `api/dashboard/analytics.py`       | 4 analytics endpoints                  |
| `api/dashboard/content/quizzes.py` | Full quiz CRUD (replaces empty file)   |
| `api/dashboard/content/levels.py`  | Full levels CRUD (replaces empty file) |

### Backend — Modified Files

| File                                 | What Changes                                                               |
| ------------------------------------ | -------------------------------------------------------------------------- |
| `api/dashboard/content/questions.py` | Add POST, PUT, GET/{id}, bulk-import                                       |
| `api/dashboard/students/__init__.py` | Add stats endpoint, single student, search/pagination, fix 500 handler     |
| `api/common/auth/email_auth.py`      | Remove broken `role_required` decorator; wrap `GET /auth/profile` response |
| `models/core/user.py`                | Fix user_id generation bug, add `update_streak()`                          |
| `models/quiz/quiz.py`                | Fix 3 ObjectId bugs, remove `$sample` size cap                             |
| `models/quiz/levels.py`              | Fix quiz_id string vs ObjectId comparison                                  |
| `api/routes/user_progress.py`        | Fix unawaited coroutine in analytics                                       |
| `utils/constants.py`                 | Update VALID_SUBJECTS to canonical 5                                       |
| `utils/types.py`                     | Pydantic v2 `PyObjectId`                                                   |
| `main.py`                            | Register all new dashboard routers                                         |

### Backend — Deleted Files

| File                        | Reason                                         |
| --------------------------- | ---------------------------------------------- |
| `api/routes/quiz/levels.py` | Comment: "forget this file"; no router defined |
| `api/routes/user/schema.py` | Empty file                                     |

### Frontend — New Files

| File                                     | Purpose                                 |
| ---------------------------------------- | --------------------------------------- |
| `lib/api/levels.ts`                      | Levels API service                      |
| `lib/api/overview.ts`                    | Overview stats service                  |
| `lib/api/analytics.ts`                   | Analytics services                      |
| `lib/hooks/useOverview.ts`               | KPI data hook                           |
| `lib/hooks/useAnalytics.ts`              | Analytics with date range param         |
| `lib/hooks/useStudents.ts`               | Students list + stats + filters         |
| `lib/hooks/useQuizzes.ts`                | Quiz list + CRUD                        |
| `lib/hooks/useLevels.ts`                 | Levels list + CRUD                      |
| `lib/hooks/useQuestions.ts`              | Questions state + CRUD                  |
| `components/mobile-nav.tsx`              | Mobile drawer navigation                |
| `components/content/question-form.tsx`   | Create/edit question dialog (rhf + zod) |
| `components/content/quiz-form.tsx`       | Create/edit quiz dialog                 |
| `components/content/level-form.tsx`      | Create/edit level dialog                |
| `components/students/student-detail.tsx` | Student detail `<Sheet>`                |
| `components/ui/empty-state.tsx`          | Reusable empty state component          |
| `app/finance/page.tsx`                   | Finance placeholder page                |

### Frontend — Modified Files

| File                                       | What Changes                                                             |
| ------------------------------------------ | ------------------------------------------------------------------------ |
| `app/layout.tsx`                           | Add `class="dark"` to `<html>`, add `<Toaster>`, remove analytics import |
| `app/page.tsx`                             | Wire all 7 components to real API data + skeleton states                 |
| `app/students/page.tsx`                    | Wire stats cards; pass search/pagination to table                        |
| `app/content/page.tsx`                     | Wire quizzes + levels tabs to API; add form dialogs                      |
| `app/analytics/page.tsx`                   | Wire all charts to API; wire date range selector                         |
| `app/settings/page.tsx`                    | Remove Appearance section; fix Security; wire Notifications              |
| `app/feedback/page.tsx`                    | Replace fake data with empty state                                       |
| `components/dashboard-layout.tsx`          | Add `<MobileNav>`, wire hamburger toggle                                 |
| `components/sidebar.tsx`                   | Add tooltips; keep Finance href; remove dead imports                     |
| `components/header.tsx`                    | Fix typo; wire logout + avatar fallback + profile name                   |
| `components/dashboard-metrics.tsx`         | Wire to `useOverview`; fix trend direction bug                           |
| `components/performance-chart.tsx`         | Wire to `useAnalytics`; wire period buttons; remove fake "Live" badge    |
| `components/subject-distribution.tsx`      | Wire to `useAnalytics` subjects                                          |
| `components/top-students.tsx`              | Wire to `useAnalytics` leaderboard                                       |
| `components/top-quizzes.tsx`               | Wire to top quizzes from API                                             |
| `components/recent-activity.tsx`           | Derive from overview data                                                |
| `components/content/questions.tsx`         | Add `"use client"`, wire create/edit/duplicate/bulk-import               |
| `components/students/students.tsx`         | Fix search bug; fix pagination; fix field name mapping                   |
| `components/settings/profile-settings.tsx` | Migrate to rhf + zod; use toast                                          |
| `components/auth/login-form.tsx`           | Fix hardcoded URLs; migrate to rhf+zod; add resend OTP                   |
| `constants/types.ts`                       | Full rewrite with correct types                                          |
| `lib/api/common.ts`                        | Remove dead branch; add 401 interceptor                                  |
| `lib/api/quizzes.ts`                       | Add create, update, delete, bulk-import                                  |
| `lib/api/questions.ts`                     | Add create, update, bulk-import                                          |
| `lib/api/students.ts`                      | Add getStudent, getStudentStats, extend getAllStudents                   |
| `lib/cookie-manager.ts`                    | Fix `secure` flag for local dev                                          |
| `lib/index.ts`                             | Export all new services; fix missing `studentService`                    |
| `lib/hooks/useAuth.ts`                     | Wire into Header logout                                                  |
| `lib/hooks/useTokenRefresh.ts`             | Wire into 401 interceptor                                                |
| `components/fonts/index.ts`                | Register Oswald font                                                     |
| `next.config.ts`                           | Declare `NEXT_PUBLIC_API_URL` in env                                     |
| `middleware.ts`                            | Remove dead `isPublicRoute` variable                                     |
| `app/api/auth/check/route.ts`              | Fix: don't delete refresh token on access-token-only expiry              |

### Frontend — Deleted Files

| File                            | Reason                                          |
| ------------------------------- | ----------------------------------------------- |
| `lib/auth-config.ts`            | Dead code — never imported anywhere             |
| `proxy.ts.txt`                  | Dead scaffolding artifact                       |
| `components/students/data.json` | Sample reference data, not needed in production |
