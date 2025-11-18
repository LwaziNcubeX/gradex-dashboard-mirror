# GradeX Admin Dashboard - Development Guide

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Planning](#architecture--planning)
3. [Implementation Plan](#implementation-plan)
4. [API Integration Sections](#api-integration-sections)
5. [Project Structure](#project-structure)
6. [Setup Instructions](#setup-instructions)
7. [Development Workflow](#development-workflow)
8. [State Management](#state-management)
9. [Authentication Flow](#authentication-flow)
10. [API Service Layer](#api-service-layer)
11. [Route Protection](#route-protection)

---

## Project Overview

The GradeX Admin Dashboard is a Next.js 16 application built with TypeScript, Tailwind CSS, and Radix UI components. It serves as the administrative interface for managing:

- **User Management**: View, filter, and manage student accounts
- **Quiz Management**: Create, edit, delete, and manage quizzes
- **Question Management**: Manage question banks with bulk upload capabilities
- **Analytics & Reports**: Track user progress, completion rates, and performance metrics
- **Content Creation**: Subject management, level-based content organization

### Current State

- ✅ Next.js project setup with TypeScript
- ✅ UI component library (Radix UI + shadcn)
- ✅ Tailwind CSS styling
- ✅ Placeholder dashboard layout
- ❌ API integration (to be implemented)
- ❌ Authentication system (to be implemented)
- ❌ Admin features (to be implemented)

### Target Features

The dashboard will support these key admin functionalities:

1. **Authentication** - Email/OTP-based login with JWT tokens
2. **Quiz Management** - CRUD operations for quizzes
3. **Question Management** - CRUD operations for questions + bulk CSV upload
4. **User Analytics** - Track student progress and performance
5. **Dashboard Home** - Overview of key metrics and stats

---

## Architecture & Planning

### Technology Stack

```
Frontend Framework:    Next.js 16 (App Router)
Language:             TypeScript
Styling:              Tailwind CSS
Component Library:    Radix UI + shadcn/ui
HTTP Client:          Fetch API (to be wrapped)
State Management:     React Context + localStorage
Authentication:       OAuth 2.0 with JWT Bearer Tokens
```

### API Connection Model

```
┌─────────────────────────────────────┐
│   Frontend (Admin Dashboard)         │
│   - React Components                 │
│   - Pages & Routes                   │
│   - Global State (Context)           │
└──────────────┬──────────────────────┘
               │
               ├── Auth Service Layer ──┐
               │   - Login/Logout       │
               │   - Token Management   │
               │   - OTP Handling       │
               │   - Register           │
               │                        │
               ├── API Service Layer ──┐├─ Middleware
               │   - Quiz API Calls     ││   - Token Refresh
               │   - Question API       ││   - Error Handling
               │   - User API           ││   - Request/Response
               │   - Analytics API      ││     Interceptors
               │                        │
               └────────┬──────────────┘
                        │
                        ▼
        ┌───────────────────────────────┐
        │   GradeX Backend API          │
        │   Base URL: localhost:8000    │
        │   Authentication: Bearer JWT   │
        └───────────────────────────────┘
```

---

## Implementation Plan

### Phase 1: Foundation Setup

**Objective**: Set up the core infrastructure for API communication and authentication.

#### 1.1 Authentication System

- [ ] Create `services/auth.ts` with functions for:
  - `register(email, firstName, lastName)`
  - `requestOtp(email)`
  - `login(email, otp)`
  - `logout(refreshToken)`
  - `refreshToken(refreshToken)`
  - `getProfile()`
- [ ] Set up auth context (`contexts/AuthContext.tsx`)
- [ ] Create login page with email/OTP flow
- [ ] Implement secure token storage (localStorage with encryption or cookies)
- [ ] Create auth state: `{user, tokens, isLoading, error, isAuthenticated}`

#### 1.2 Global State Management

- [ ] Create React Context for auth state
- [ ] Create custom hook `useAuth()` for easy access
- [ ] Implement localStorage persistence for tokens
- [ ] Auto-login on page refresh if tokens exist
- [ ] Token refresh logic before API calls

#### 1.3 Route Protection

- [ ] Create `middleware.ts` to protect admin routes
- [ ] Create `ProtectedRoute` component for admin-only pages
- [ ] Redirect unauthorized users to login
- [ ] Check user role (admin/teacher only)
- [ ] Implement role-based access control (RBAC)

### Phase 2: API Service Layer

**Objective**: Create reusable, type-safe API client functions.

#### 2.1 API Utilities

- [ ] Create `lib/api.ts` with:
  - Base API configuration
  - Request/response interceptors
  - Error handling
  - Token refresh logic
  - Type-safe fetch wrapper
- [ ] Create request/response types in `types/api.ts`
- [ ] Handle HTTP errors (401, 403, 404, 500)

#### 2.2 API Services

- [ ] `services/quizService.ts` - Quiz CRUD operations
- [ ] `services/questionService.ts` - Question CRUD + bulk upload
- [ ] `services/userService.ts` - User management
- [ ] `services/analyticsService.ts` - Performance metrics

### Phase 3: Admin Dashboard Features

**Objective**: Build admin-facing pages and features.

#### 3.1 Dashboard Home

- [ ] Create `/app/admin` page
- [ ] Display key metrics:
  - Total students
  - Total quizzes
  - Total questions
  - Average completion rate
- [ ] Charts/visualizations using existing chart components
- [ ] Recent activity feed

#### 3.2 Quiz Management

- [ ] `/app/admin/quizzes` - List all quizzes
- [ ] `/app/admin/quizzes/create` - Create new quiz
- [ ] `/app/admin/quizzes/[id]/edit` - Edit quiz
- [ ] Quiz form with:
  - Title, description, subject, category
  - Level selection (Form 1-4)
  - Question picker (search and add)
  - XP rewards, difficulty score
  - Active/inactive toggle
- [ ] Delete quiz functionality
- [ ] Search and filter quizzes

#### 3.3 Question Management

- [ ] `/app/admin/questions` - List all questions
- [ ] `/app/admin/questions/create` - Create new question
- [ ] `/app/admin/questions/[id]/edit` - Edit question
- [ ] Question form with:
  - Question text, answers, correct answer
  - Subject, topic, level
  - Explanation, hint
  - Points, time limit
- [ ] Bulk CSV upload feature
- [ ] Delete question functionality
- [ ] Search and filter questions

#### 3.4 User Management

- [ ] `/app/admin/users` - List all users
- [ ] User table with:
  - Email, name, role, level
  - Total XP, completion rate
  - Join date, last login
- [ ] Filter by role (student, teacher, admin)
- [ ] Search users
- [ ] View user detailed profile
- [ ] Pagination

#### 3.5 Analytics & Reports

- [ ] `/app/admin/analytics` - Dashboard analytics
- [ ] Charts:
  - User growth over time
  - Quiz completion rate by subject
  - Average scores by level
  - Top performing students
  - Subject-wise distribution
- [ ] Exportable reports
- [ ] Date range filters

### Phase 4: Polish & Optimization

**Objective**: Refine UX and optimize performance.

- [ ] Add loading states and skeletons
- [ ] Implement error boundaries
- [ ] Add toast notifications for success/error
- [ ] Optimize API calls (debounce search, pagination)
- [ ] Add form validation with react-hook-form
- [ ] Implement confirmation dialogs for destructive actions
- [ ] Add loading indicators for async operations
- [ ] Cache API responses where appropriate
- [ ] Add 404 and error pages

---

## API Integration Sections

The GradeX API has the following major sections. Implementation should follow this order:

### 1. Authentication (Priority: **CRITICAL**)

**Endpoints**:

- `POST /auth/register` - Register new account
- `POST /auth/request-otp` - Request OTP
- `POST /auth/login` - Login with OTP
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout
- `GET /auth/profile` - Get current user profile

**Why First**: All other API calls require authentication tokens. Must be solid.

**Expected Implementation**: Auth context, login page, token storage/refresh.

---

### 2. Quiz Management (Priority: **HIGH**)

**Endpoints**:

- `POST /quiz/create` - Create quiz
- `GET /quiz/list` - List quizzes (paginated, filtered)
- `GET /quiz/{quiz_id}` - Get quiz details
- `PUT /quiz/{quiz_id}` - Update quiz
- `DELETE /quiz/{quiz_id}` - Delete quiz
- `GET /quiz/game-mode/{mode}` - Get quizzes by game mode

**Why Second**: Core admin feature for content management.

**Expected Implementation**: Quiz list page, create/edit forms, delete action.

---

### 3. Question Management (Priority: **HIGH**)

**Endpoints**:

- `POST /questions/create` - Create single question
- `POST /questions/bulk-upload` - Upload CSV with multiple questions
- `GET /questions/{question_id}` - Get question details
- `PUT /questions/{question_id}` - Update question
- `DELETE /questions/{question_id}` - Delete question
- `GET /questions/list` - List all questions

**Why Third**: Feeds into quiz creation and bulk operations.

**Expected Implementation**: Question list page, create/edit forms, CSV upload.

---

### 4. User Management (Priority: **MEDIUM**)

**Endpoints**:

- `GET /users/list` - List all users (paginated)
- `GET /users/{user_id}/profile` - Get user details
- `GET /users/{user_id}/stats` - Get user stats
- `GET /users/{user_id}/progress` - Get learning progress

**Why Fourth**: Administrative oversight but not content creation.

**Expected Implementation**: User list page, search, filters, detail view.

---

### 5. User Progress & Analytics (Priority: **MEDIUM**)

**Endpoints**:

- `GET /analytics/dashboard` - Dashboard metrics
- `GET /analytics/quiz-stats` - Quiz completion stats
- `GET /analytics/user-progress` - User progress data
- `GET /analytics/performance` - Performance metrics

**Why Fifth**: Reports and insights for admin.

**Expected Implementation**: Analytics page with charts and metrics.

---

### 6. Achievements (Priority: **LOW**)

**Endpoints**: Badge and achievement system

- View and manage achievements
- Optional for admin dashboard

---

### 7. Shop & Rewards (Priority: **LOW**)

**Endpoints**: Rewards system

- View and manage rewards
- Optional for admin dashboard

---

## Project Structure

```
gradex-dashboard/
├── app/
│   ├── layout.tsx                 # Root layout with providers
│   ├── page.tsx                   # Home page
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx          # Login page with OTP
│   │   └── register/
│   │       └── page.tsx          # Registration page
│   ├── admin/
│   │   ├── layout.tsx            # Admin layout with sidebar
│   │   ├── page.tsx              # Dashboard home
│   │   ├── quizzes/
│   │   │   ├── page.tsx          # List quizzes
│   │   │   ├── create/
│   │   │   │   └── page.tsx      # Create quiz
│   │   │   └── [id]/
│   │   │       ├── page.tsx      # Quiz detail
│   │   │       └── edit/
│   │   │           └── page.tsx  # Edit quiz
│   │   ├── questions/
│   │   │   ├── page.tsx          # List questions
│   │   │   ├── create/
│   │   │   │   └── page.tsx      # Create question
│   │   │   └── [id]/
│   │   │       ├── page.tsx      # Question detail
│   │   │       └── edit/
│   │   │           └── page.tsx  # Edit question
│   │   ├── users/
│   │   │   ├── page.tsx          # List users
│   │   │   └── [id]/
│   │   │       └── page.tsx      # User profile
│   │   └── analytics/
│   │       └── page.tsx          # Analytics dashboard
│   └── error.tsx                 # Error boundary
│
├── components/
│   ├── admin/
│   │   ├── sidebar.tsx
│   │   ├── navbar.tsx
│   │   ├── quiz-form.tsx
│   │   ├── question-form.tsx
│   │   ├── user-table.tsx
│   │   └── analytics-charts.tsx
│   ├── forms/
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   └── otp-input.tsx
│   └── ui/
│       └── [existing shadcn components]
│
├── contexts/
│   └── AuthContext.tsx           # Auth state context
│
├── hooks/
│   ├── use-auth.ts               # Custom auth hook
│   └── [existing hooks]
│
├── lib/
│   ├── api.ts                    # API client base
│   └── utils.ts                  # Utilities
│
├── services/
│   ├── auth.ts                   # Auth API calls
│   ├── quizService.ts            # Quiz API calls
│   ├── questionService.ts        # Question API calls
│   ├── userService.ts            # User API calls
│   └── analyticsService.ts       # Analytics API calls
│
├── types/
│   ├── api.ts                    # API request/response types
│   ├── auth.ts                   # Auth-related types
│   ├── models.ts                 # Data models (Quiz, Question, User, etc)
│   └── index.ts
│
├── middleware.ts                 # Route protection middleware
├── next.config.ts                # Next.js config
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind config
├── package.json                  # Dependencies
└── ADMIN_DASHBOARD_README.md     # This file
```

---

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm/yarn
- GradeX Backend API running locally or accessible
- Basic understanding of Next.js, TypeScript, and React

### Installation

```bash
# Install dependencies
npm install

# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
EOF

# Start development server
npm run dev

# Open browser
open http://localhost:3000
```

### Environment Variables

Create `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000    # Development
# NEXT_PUBLIC_API_BASE_URL=https://api.gradex.rapidshyft.com  # Production

# Optional: Token storage settings
NEXT_PUBLIC_TOKEN_STORAGE=localStorage  # or 'cookies'
```

---

## Development Workflow

### Step 1: Set Up Authentication

1. Create `services/auth.ts` with auth API functions
2. Create `contexts/AuthContext.tsx` for global state
3. Create `hooks/useAuth.ts` custom hook
4. Build login page at `/auth/login`
5. Implement token storage and refresh logic
6. Test login flow with backend

### Step 2: Protect Routes

1. Create `middleware.ts` to check auth
2. Protect `/admin/*` routes
3. Redirect unauthenticated users to login
4. Check user role (must be admin/teacher)

### Step 3: Build API Services

1. Create `lib/api.ts` with base client
2. Create service files in `services/` folder
3. Implement request/response types
4. Add error handling

### Step 4: Build Admin Dashboard

1. Create admin layout and sidebar
2. Build each section one by one (quizzes → questions → users → analytics)
3. Use existing UI components
4. Connect to API services

### Step 5: Polish & Test

1. Add loading states and error handling
2. Implement form validation
3. Add toast notifications
4. Test all features

---

## State Management

### Auth Context

The auth context will store:

```typescript
interface AuthContextType {
  user: User | null;
  tokens: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
  } | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Methods
  register: (
    email: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  requestOtp: (email: string) => Promise<void>;
  login: (email: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  clearError: () => void;
}
```

### Usage

```tsx
// In components
const { user, isAuthenticated, login, logout } = useAuth();

// Check if logged in
if (!isAuthenticated) {
  return <Redirect to="/auth/login" />;
}

// Use user data
<div>Welcome, {user?.first_name}!</div>;
```

---

## Authentication Flow

### Login Flow

```
1. User opens /auth/login
2. Enters email → click "Send OTP"
   - POST /auth/register (if new)
   - POST /auth/request-otp
3. Receives OTP in email
4. Enters OTP → click "Login"
   - POST /auth/login
   - Receive access_token + refresh_token
5. Store tokens in localStorage/context
6. Redirect to /admin dashboard
7. Include token in Authorization header for all requests
```

### Token Refresh

```
1. Access token expires (14 days)
2. Before any API call, check token expiry
3. If expired, POST /auth/refresh with refresh_token
4. Get new access_token
5. Update in context and localStorage
6. Continue with original request
```

### Logout Flow

```
1. User clicks logout
2. POST /auth/logout with refresh_token
3. Clear tokens from localStorage
4. Clear auth context
5. Redirect to /auth/login
```

---

## API Service Layer

### Example: Quiz Service

```typescript
// services/quizService.ts

import { apiClient } from "@/lib/api";
import type { Quiz, CreateQuizRequest } from "@/types";

export const quizService = {
  async listQuizzes(params: {
    page?: number;
    page_size?: number;
    subject?: string;
    level?: string;
  }) {
    return apiClient.get("/quiz/list", { params });
  },

  async createQuiz(data: CreateQuizRequest) {
    return apiClient.post("/quiz/create", data);
  },

  async getQuiz(quizId: string) {
    return apiClient.get(`/quiz/${quizId}`);
  },

  async updateQuiz(quizId: string, data: Partial<CreateQuizRequest>) {
    return apiClient.put(`/quiz/${quizId}`, data);
  },

  async deleteQuiz(quizId: string) {
    return apiClient.delete(`/quiz/${quizId}`);
  },
};
```

### Example: Using Service in Component

```tsx
"use client";

import { useEffect, useState } from "react";
import { quizService } from "@/services/quizService";
import type { Quiz } from "@/types";

export default function QuizList() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const data = await quizService.listQuizzes({ page: 1 });
        setQuizzes(data.data.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    };

    loadQuizzes();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {quizzes.map((quiz) => (
        <div key={quiz._id}>{quiz.title}</div>
      ))}
    </div>
  );
}
```

---

## Route Protection

### Middleware Example

```typescript
// middleware.ts

import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/auth/login", "/auth/register", "/"];
const adminRoutes = ["/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route requires admin access
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  if (isAdminRoute) {
    // Check if user is authenticated
    const token = request.cookies.get("accessToken")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
```

---

## Next Steps

After reviewing this README, please provide:

1. **Confirmation** - Do you want to proceed with this plan as outlined?
2. **Modifications** - Any changes to the priority order or feature set?
3. **API Base URL** - What's the actual backend URL we should use?
4. **Additional Requirements** - Any specific admin features needed?

Once confirmed, we'll start implementing **Phase 1: Foundation Setup** with:

- Authentication system
- Auth context
- Login page
- Route protection

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Context API](https://react.dev/reference/react/useContext)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/docs/primitives/overview/introduction)
- [GradeX API Documentation](./api.md)

---

**Created**: November 19, 2025  
**Status**: Planning Phase - Ready for Review  
**Next Phase**: Authentication System Implementation
