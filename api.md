# GradeX Backend - API Documentation

**Version**: 1.0.0  
**Base URL**: `http://localhost:8000` (Development) | `https://api.gradex.rapidshyft.com` (Production)  
**API Format**: REST with JSON request/response bodies

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Response Format](#response-format)
4. [Error Handling](#error-handling)
5. [Authentication Endpoints](#authentication-endpoints)
6. [Quiz Management Endpoints](#quiz-management-endpoints)
7. [Question Management Endpoints](#question-management-endpoints)
8. [Level-Based Quiz Endpoints](#level-based-quiz-endpoints)
9. [Game Mode Endpoints](#game-mode-endpoints)
10. [User Progress & Analytics](#user-progress--analytics)
11. [Achievements Endpoints](#achievements-endpoints)
12. [Shop & Rewards Endpoints](#shop--rewards-endpoints)
13. [User Management Endpoints](#user-management-endpoints)
14. [Data Models](#data-models)
15. [Common Query Parameters](#common-query-parameters)

---

## Overview

GradeX is a gamified learning platform for Zimbabwean O-Level students. The API provides endpoints for:

- **User Authentication**: Email/OTP-based registration and login
- **Quiz Management**: Create, retrieve, and manage quizzes
- **Questions**: Manage question banks with bulk operations
- **Game Modes**: Arcade, Speed Run, and Wild Card game modes
- **User Progress**: Track learning analytics and performance
- **Achievements**: Badge and achievement system
- **Gamification**: XP, levels, streaks, and rewards

### Target Audience

Students in **Forms 1-4** (O-Level curriculum, equivalent to Grades 8-11)

### Key Features

- 📊 Comprehensive learning analytics
- 🎮 Three game modes with different mechanics
- 🏆 Achievement and badge system
- 📈 XP-based progression and leveling
- 📱 Mobile-friendly API design

---

## Authentication

### Authentication Method

**OAuth 2.0 with JWT Bearer Tokens**

The API uses email-based OTP (One-Time Password) authentication:

1. **Register** with email, first name, and last name
2. **Request OTP** for the registered email
3. **Login** with email and OTP
4. **Receive** access and refresh tokens
5. **Use** access token in Authorization header for protected routes

### Obtaining Tokens

```bash
# Step 1: Register
POST /auth/register
{
  "email": "student@example.com",
  "first_name": "John",
  "last_name": "Doe"
}

# Step 2: Request OTP
POST /auth/request-otp
{
  "email": "student@example.com"
}

# Step 3: Login with OTP
POST /auth/login
{
  "email": "student@example.com",
  "otp": "123456"
}

Response:
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "user_id": "USR123ABC45",
    "email": "student@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "student",
    "total_xp": 0,
    "current_level": 1
  }
}
```

### Using Tokens

**In Request Headers**:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Details

| Field                | Value   |
| -------------------- | ------- |
| Algorithm            | HS256   |
| Access Token Expiry  | 14 days |
| Refresh Token Expiry | 31 days |
| Token Type           | Bearer  |

### Refreshing Tokens

```bash
POST /auth/refresh
{
  "refresh_token": "eyJhbGc..."
}

Response:
{
  "success": true,
  "data": {
    "access_token": "eyJhbGc...",
    "refresh_token": "eyJhbGc...",
    "token_type": "bearer"
  }
}
```

### Logout

```bash
POST /auth/logout
{
  "refresh_token": "eyJhbGc..."
}

Response:
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Response Format

All API responses follow a consistent structure:

### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data goes here
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

### Paginated Response

```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "items": [...],
    "total": 100,
    "page": 1,
    "page_size": 20,
    "total_pages": 5
  }
}
```

### List Response

```json
{
  "success": true,
  "data": [...]
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning              | Use Case                             |
| ---- | -------------------- | ------------------------------------ |
| 200  | OK                   | Successful GET, PUT, DELETE          |
| 201  | Created              | Successful POST (resource created)   |
| 400  | Bad Request          | Invalid input, validation error      |
| 401  | Unauthorized         | Missing/invalid authentication token |
| 403  | Forbidden            | Authenticated but lacks permissions  |
| 404  | Not Found            | Resource not found                   |
| 422  | Unprocessable Entity | Validation error with details        |
| 500  | Server Error         | Unexpected server error              |

### Error Response Example

```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

### Validation Error Response

```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "invalid email format",
      "type": "value_error.email"
    }
  ]
}
```

---

## Authentication Endpoints

### POST /auth/register

Register a new user account.

**Request Body**:

```json
{
  "email": "student@example.com",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Parameters**:
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| email | string | Yes | Valid email format |
| first_name | string | Yes | 1-50 characters |
| last_name | string | Yes | 1-50 characters |

**Success Response** (201):

```json
{
  "success": true,
  "message": "User registered successfully. Please check your email for OTP.",
  "data": {
    "user_id": "USR123ABC45"
  }
}
```

**Error Responses**:

- 400: User with this email already exists
- 500: Registration failed

---

### POST /auth/request-otp

Request a 6-digit OTP code for login.

**Request Body**:

```json
{
  "email": "student@example.com"
}
```

**Parameters**:
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| email | string | Yes | Valid email format, registered |

**Success Response** (201):

```json
{
  "success": true,
  "message": "OTP sent successfully to your email",
  "data": {}
}
```

**Note**: OTP expires in 5 minutes. A new request will invalidate the previous OTP.

---

### POST /auth/login

Login with email and OTP code.

**Request Body**:

```json
{
  "email": "student@example.com",
  "otp": "123456"
}
```

**Parameters**:
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| email | string | Yes | Valid email format |
| otp | string | Yes | Exactly 6 digits, numeric |

**Success Response** (200):

```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "user": {
      "user_id": "USR123ABC45",
      "email": "student@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "student",
      "total_xp": 150,
      "current_level": 2
    }
  }
}
```

**Error Responses**:

- 400: Invalid OTP or OTP expired
- 404: User not found

---

### POST /auth/refresh

Refresh the access token using a valid refresh token.

**Request Body**:

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response** (201):

```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer"
  }
}
```

---

### GET /auth/profile

Get the current logged-in user's profile.

**Authentication**: Required (Bearer token)

**Success Response** (200):

```json
{
  "success": true,
  "data": {
    "user_id": "USR123ABC45",
    "email": "student@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "student",
    "is_verified": true,
    "created_at": "2025-01-15T10:30:00Z",
    "last_login": "2025-01-18T14:22:00Z",
    "total_xp": 450,
    "total_coins": 1200,
    "current_level": 3,
    "quizzes_completed": 15,
    "streak_days": 7,
    "longest_streak": 21
  }
}
```

---

### POST /auth/logout

Logout the current user.

**Authentication**: Required (Bearer token)

**Request Body**:

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response** (200):

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Quiz Management Endpoints

### POST /quiz/create

Create a new quiz (admin or teacher only).

**Authentication**: Required (Admin or Teacher role)

**Request Body**:

```json
{
  "title": "Form 1 Mathematics - Algebra Basics",
  "description": "Introduction to algebraic expressions and equations",
  "subject": "Mathematics",
  "category": "Algebra",
  "tags": ["equations", "expressions", "form-1"],
  "duration": 1800,
  "level": "Form 1",
  "questions": ["Q123", "Q124", "Q125"],
  "level_id": "LVL001",
  "xp_reward": 50,
  "difficulty_score": 1.5,
  "is_active": true
}
```

**Parameters**:
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| title | string | Yes | Quiz title |
| description | string | Yes | Quiz description |
| subject | string | Yes | e.g., "Mathematics", "Geography" |
| category | string | Yes | e.g., "Algebra", "Trigonometry" |
| tags | array | Yes | Min 1 tag |
| duration | integer | Yes | Duration in seconds |
| level | string | Yes | "Form 1", "Form 2", "Form 3", "Form 4" |
| questions | array | Yes | Array of question IDs |
| level_id | string | No | Associated level ID |
| xp_reward | integer | Yes | 1-500 XP |
| difficulty_score | float | Yes | 0.1-5.0 |
| is_active | boolean | Yes | Active/inactive status |

**Success Response** (201):

```json
{
  "success": true,
  "message": "Quiz created successfully",
  "data": {
    "quiz_id": "QZ123ABC45",
    "title": "Form 1 Mathematics - Algebra Basics",
    "created_at": "2025-01-18T14:30:00Z"
  }
}
```

---

### GET /quiz/list

List all quizzes with pagination and filtering.

**Authentication**: Required

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Page number (≥1) |
| page_size | integer | 20 | Items per page (1-100) |
| subject | string | null | Filter by subject |
| level | string | null | Filter by form level |

**Example Request**:

```bash
GET /quiz/list?page=1&page_size=20&subject=Mathematics&level=Form%201
Authorization: Bearer {access_token}
```

**Success Response** (200):

```json
{
  "success": true,
  "message": "Quizzes retrieved successfully",
  "data": {
    "items": [
      {
        "_id": "QZ123ABC45",
        "title": "Form 1 Mathematics - Algebra Basics",
        "description": "Introduction to algebraic expressions",
        "subject": "Mathematics",
        "category": "Algebra",
        "level": "Form 1",
        "duration": 1800,
        "question_count": 10,
        "xp_reward": 50,
        "difficulty_score": 1.5,
        "completion_count": 245,
        "average_score": 72.5,
        "is_active": true
      }
    ],
    "total": 87,
    "page": 1,
    "page_size": 20,
    "total_pages": 5
  }
}
```

---

### GET /quiz/game-mode/{mode}

Get quizzes optimized for a specific game mode.

**Authentication**: Required

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| mode | string | Game mode: "arcade", "speed-run", "wild-card" |

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| limit | integer | 10 | Number of quizzes (1-50) |

**Success Response** (200):

```json
{
  "success": true,
  "data": [
    {
      "_id": "QZ123ABC45",
      "title": "Quick Math Challenge",
      "subject": "Mathematics",
      "duration": 600,
      "question_count": 5,
      "xp_reward": 25
    }
  ]
}
```

---

## Question Management Endpoints

### POST /questions/create

Create a new question (admin or teacher only).

**Authentication**: Required (Admin or Teacher role)

**Request Body**:

```json
{
  "question_text": "What is the value of 2x + 3 when x = 5?",
  "answers": ["10", "13", "15", "18"],
  "correct_answer": "13",
  "subject": "Mathematics",
  "topic": "Algebra",
  "level": "Form 1",
  "explanation": "Substitute x = 5: 2(5) + 3 = 10 + 3 = 13",
  "hint": "Remember to multiply 2 by 5 first",
  "tags": ["algebra", "equations", "substitution"],
  "points": 10,
  "time_limit_seconds": 60
}
```

**Parameters**:
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| question_text | string | Yes | Min 10 characters |
| answers | array | Yes | 2-6 options |
| correct_answer | string | Yes | Must match one answer |
| subject | string | Yes | e.g., "Mathematics" |
| topic | string | No | Topic within subject |
| level | string | No | "Form 1"-"Form 4" |
| explanation | string | No | Answer explanation |
| hint | string | No | Hint for students |
| tags | array | No | Question tags |
| points | integer | No | Default: 10 |
| time_limit_seconds | integer | No | Default: 60 |

**Success Response** (201):

```json
{
  "success": true,
  "message": "Question created successfully",
  "data": {
    "question_id": "Q123ABC45"
  }
}
```

---

### POST /questions/bulk-upload

Upload multiple questions via CSV file.

**Authentication**: Required (Admin or Teacher role)

**Request**: Multipart form data with CSV file

**CSV Format**:

```csv
question_text,answers,correct_answer,subject,topic,level,explanation
"What is 2+2?","2|3|4|5","4","Mathematics","Arithmetic","Form 1","Basic addition"
```

**Success Response** (201):

```json
{
  "success": true,
  "message": "Questions imported successfully",
  "data": {
    "imported_count": 50,
    "failed_count": 0
  }
}
```

---

### GET /questions/{question_id}

Get a single question by ID.

**Authentication**: Required

**Success Response** (200):

```json
{
  "success": true,
  "data": {
    "_id": "Q123ABC45",
    "question_text": "What is the value of 2x + 3 when x = 5?",
    "answers": ["10", "13", "15", "18"],
    "correct_answer": "13",
    "subject": "Mathematics",
    "topic": "Algebra",
    "level": "Form 1",
    "explanation": "Substitute x = 5: 2(5) + 3 = 10 + 3 = 13",
    "points": 10,
    "tags": ["algebra", "equations"]
  }
}
```

---

## Level-Based Quiz Endpoints

### GET /level-quiz/list

List all level-based quizzes with pagination.

**Authentication**: Not required

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Page number |
| limit | integer | 10 | Items per page (1-100) |

**Success Response** (200):

```json
{
  "success": true,
  "data": {
    "quizzes": [
      {
        "_id": "QZ123ABC45",
        "title": "Level 1: Basic Algebra",
        "description": "Learn algebraic fundamentals",
        "xp_reward": 100,
        "question_count": 15
      }
    ],
    "total": 45,
    "page": 1,
    "limit": 10,
    "total_pages": 5
  }
}
```

---

### GET /level-quiz/by-level/{level}

Get quizzes filtered by difficulty level.

**Authentication**: Not required

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| level | string | "Form 1", "Form 2", "Form 3", or "Form 4" |

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Page number |
| limit | integer | 10 | Items per page |
| subject | string | null | Filter by subject |
| category | string | null | Filter by category |

**Example Request**:

```bash
GET /level-quiz/by-level/Form%201?subject=Mathematics&limit=20
```

**Success Response** (200):

```json
{
  "success": true,
  "data": {
    "quizzes": [
      {
        "_id": "QZ123ABC45",
        "title": "Form 1 Mathematics",
        "subject": "Mathematics",
        "category": "Algebra",
        "level": "Form 1",
        "xp_reward": 100
      }
    ],
    "total": 12,
    "page": 1,
    "limit": 10
  }
}
```

---

## Game Mode Endpoints

### POST /game-modes/arcade/start

Start an Arcade mode game session (practice without time pressure).

**Authentication**: Required

**Request Body**:

```json
{
  "subject_filter": "Mathematics",
  "limit": 10
}
```

**Parameters**:
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| subject_filter | string | No | Filter by subject (optional) |
| limit | integer | No | 1-20 quizzes (default: 10) |

**Success Response** (201):

```json
{
  "success": true,
  "message": "Arcade mode started successfully",
  "data": {
    "session_id": "SESS123ABC45",
    "mode": "arcade",
    "user_id": "USR123ABC45",
    "quizzes": ["QZ1", "QZ2", "QZ3"],
    "current_quiz_index": 0,
    "total_quizzes": 3,
    "started_at": "2025-01-18T14:30:00Z",
    "status": "active"
  }
}
```

---

### POST /game-modes/speed-run/start

Start a Speed Run mode game session (beat the clock).

**Authentication**: Required

**Request Body**:

```json
{
  "time_limit_minutes": 10
}
```

**Parameters**:
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| time_limit_minutes | integer | No | 1-15 minutes (default: 5) |

**Success Response** (201):

```json
{
  "success": true,
  "message": "Speed run mode started successfully",
  "data": {
    "session_id": "SESS123ABC45",
    "mode": "speed_run",
    "time_limit": 600,
    "quizzes": ["QZ1", "QZ2"],
    "status": "active"
  }
}
```

---

### POST /game-modes/wild-card/start

Start a Wild Card mode game session (random subjects mix).

**Authentication**: Required

**Request Body**:

```json
{
  "limit": 12
}
```

**Parameters**:
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| limit | integer | No | 8-15 quizzes (default: 10) |

**Success Response** (201):

```json
{
  "success": true,
  "message": "Wild card mode started successfully",
  "data": {
    "session_id": "SESS123ABC45",
    "mode": "wild_card",
    "quizzes": ["QZ1", "QZ2", ...],
    "status": "active"
  }
}
```

---

### GET /game-modes/session/{session_id}

Get details of an active game session.

**Authentication**: Required

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| session_id | string | Session ID from start endpoint |

**Success Response** (200):

```json
{
  "success": true,
  "data": {
    "session_id": "SESS123ABC45",
    "mode": "arcade",
    "user_id": "USR123ABC45",
    "quizzes": ["QZ1", "QZ2", "QZ3"],
    "current_quiz_index": 1,
    "total_quizzes": 3,
    "score": 85,
    "started_at": "2025-01-18T14:30:00Z",
    "status": "active"
  }
}
```

---

### POST /game-modes/session/{session_id}/submit-quiz

Submit a quiz result within a game session.

**Authentication**: Required

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| session_id | string | Session ID |

**Request Body**:

```json
{
  "quiz_id": "QZ123ABC45",
  "total_score": 85,
  "max_score": 100,
  "xp_earned": 50,
  "time_taken_seconds": 420
}
```

**Parameters**:
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| quiz_id | string | Yes | The quiz being submitted |
| total_score | integer | Yes | Score achieved |
| max_score | integer | Yes | Maximum possible score |
| xp_earned | integer | Yes | XP points earned |
| time_taken_seconds | integer | Yes | Time spent on quiz |

**Success Response** (200):

```json
{
  "success": true,
  "message": "Quiz submitted successfully",
  "data": {
    "session_id": "SESS123ABC45",
    "quiz_id": "QZ123ABC45",
    "score": 85,
    "xp_earned": 50,
    "current_quiz_index": 2,
    "total_quizzes": 3
  }
}
```

---

### POST /game-modes/session/{session_id}/complete

Complete a game session manually.

**Authentication**: Required

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| session_id | string | Session ID |

**Success Response** (200):

```json
{
  "success": true,
  "message": "Session completed successfully",
  "data": {
    "session_id": "SESS123ABC45",
    "mode": "arcade",
    "total_score": 255,
    "total_xp_earned": 150,
    "completed_quizzes": 3,
    "total_quizzes": 3,
    "status": "completed",
    "completed_at": "2025-01-18T14:45:00Z"
  }
}
```

---

### GET /game-modes/leaderboard/{mode}

Get leaderboard for a specific game mode.

**Authentication**: Required

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| mode | string | "arcade", "speed_run", or "wild_card" |

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| timeframe | string | "weekly" | "daily", "weekly", "monthly", "all-time" |

**Success Response** (200):

```json
{
  "success": true,
  "data": {
    "mode": "arcade",
    "timeframe": "weekly",
    "leaderboard": [
      {
        "rank": 1,
        "user_id": "USR456XYZ78",
        "user_name": "Jane Smith",
        "score": 2500,
        "xp_earned": 850,
        "sessions_completed": 5
      },
      {
        "rank": 2,
        "user_id": "USR123ABC45",
        "user_name": "John Doe",
        "score": 2300,
        "xp_earned": 780,
        "sessions_completed": 4
      }
    ]
  }
}
```

---

### GET /game-modes/user/stats

Get current user's game mode statistics.

**Authentication**: Required

**Success Response** (200):

```json
{
  "success": true,
  "data": {
    "arcade": {
      "attempts": 15,
      "completed": 14,
      "total_xp": 450,
      "average_score": 78.5,
      "best_score": 95
    },
    "speed_run": {
      "attempts": 8,
      "completed": 6,
      "total_xp": 250,
      "average_score": 72.0,
      "best_score": 88
    },
    "wild_card": {
      "attempts": 5,
      "completed": 5,
      "total_xp": 150,
      "average_score": 65.0,
      "best_score": 80
    }
  }
}
```

---

## User Progress & Analytics

### GET /user/progress

Get comprehensive user progress and statistics.

**Authentication**: Required

**Success Response** (200):

```json
{
  "success": true,
  "data": {
    "user_id": "USR123ABC45",
    "total_xp": 1250,
    "current_level": 4,
    "xp_to_next_level": 750,
    "quizzes_completed": 45,
    "total_questions_answered": 380,
    "correct_answers": 298,
    "accuracy": 78.4,
    "streak_days": 12,
    "longest_streak": 21,
    "last_activity": "2025-01-18T14:30:00Z",
    "game_mode_stats": {
      "arcade": {
        "attempts": 15,
        "completed": 14,
        "total_xp": 450
      },
      "speed_run": {
        "attempts": 8,
        "completed": 6,
        "total_xp": 250
      }
    },
    "subject_performance": {
      "Mathematics": {
        "quizzes_completed": 12,
        "average_score": 82.5,
        "accuracy": 85.0
      },
      "Geography": {
        "quizzes_completed": 8,
        "average_score": 75.0,
        "accuracy": 72.0
      }
    }
  }
}
```

---

### GET /user/analytics/questions

Get user's question performance analytics.

**Authentication**: Required

**Success Response** (200):

```json
{
  "success": true,
  "data": {
    "total_questions_attempted": 380,
    "mastery_breakdown": {
      "mastered": 240,
      "learning": 100,
      "struggling": 40
    },
    "subjects_performance": {
      "Mathematics": {
        "total_questions": 150,
        "mastered": 120,
        "learning": 25,
        "struggling": 5,
        "average_mastery": 0.85
      },
      "Geography": {
        "total_questions": 100,
        "mastered": 70,
        "learning": 25,
        "struggling": 5,
        "average_mastery": 0.78
      }
    },
    "overall_mastery": 0.82
  }
}
```

---

### GET /user/analytics/difficulty

Get global question difficulty analytics.

**Authentication**: Required

**Success Response** (200):

```json
{
  "success": true,
  "data": {
    "difficulty_distribution": {
      "easy": {
        "count": 150,
        "average_success_rate": 92.5
      },
      "medium": {
        "count": 200,
        "average_success_rate": 78.0
      },
      "hard": {
        "count": 100,
        "average_success_rate": 65.5
      }
    }
  }
}
```

---

### POST /user/streak/update

Manually update user's streak (usually done automatically).

**Authentication**: Required

**Success Response** (200):

```json
{
  "success": true,
  "message": "Streak updated",
  "data": {
    "streak_days": 13,
    "longest_streak": 21
  }
}
```

---

### GET /user/recommendations

Get personalized learning recommendations.

**Authentication**: Required

**Success Response** (200):

```json
{
  "success": true,
  "data": {
    "recommended_quizzes": [
      {
        "quiz_id": "QZ123",
        "title": "Quadratic Equations",
        "subject": "Mathematics",
        "reason": "You struggled with this topic"
      }
    ],
    "next_topics": [
      {
        "topic": "Trigonometry",
        "subject": "Mathematics",
        "difficulty": "Form 3"
      }
    ]
  }
}
```

---

## Achievements Endpoints

### GET /achievements

Get all available achievements in the system.

**Authentication**: Not required

**Success Response** (200):

```json
{
  "success": true,
  "data": [
    {
      "achievement_id": "ACH001",
      "name": "First Steps",
      "description": "Complete your first quiz",
      "icon": "badge_starter.png",
      "points": 10,
      "condition": "quizzes_completed >= 1"
    },
    {
      "achievement_id": "ACH002",
      "name": "Quiz Master",
      "description": "Complete 50 quizzes",
      "icon": "badge_master.png",
      "points": 100,
      "condition": "quizzes_completed >= 50"
    }
  ]
}
```

---

### GET /achievements/user

Get current user's achievements with progress.

**Authentication**: Required

**Success Response** (200):

```json
{
  "success": true,
  "data": {
    "unlocked_achievements": [
      {
        "achievement_id": "ACH001",
        "name": "First Steps",
        "unlocked_at": "2025-01-10T10:30:00Z",
        "points": 10
      }
    ],
    "in_progress": [
      {
        "achievement_id": "ACH002",
        "name": "Quiz Master",
        "progress": 45,
        "required": 50,
        "percentage": 90
      }
    ],
    "locked": [
      {
        "achievement_id": "ACH003",
        "name": "Streak Champion"
      }
    ]
  }
}
```

---

### GET /achievements/user/{user_id}

Get achievements for a specific user.

**Authentication**: Required

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| user_id | string | User ID to view achievements for |

**Success Response** (200):

```json
{
  "success": true,
  "data": {
    "user_id": "USR456XYZ78",
    "user_name": "Jane Smith",
    "total_achievements": 8,
    "unlocked_achievements": [...]
  }
}
```

---

### POST /achievements/check

Manually trigger achievement check for current user.

**Authentication**: Required

**Success Response** (200):

```json
{
  "success": true,
  "message": "Achievement check completed",
  "data": {
    "newly_unlocked": [
      {
        "achievement_id": "ACH002",
        "name": "Quiz Master",
        "points": 100
      }
    ]
  }
}
```

---

## Shop & Rewards Endpoints

### GET /shop/items/{user_id}

Get shop items and user's current rewards.

**Authentication**: Required

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| user_id | string | User ID |

**Success Response** (200):

```json
{
  "success": true,
  "data": {
    "user_coins": 1200,
    "user_xp": 1250,
    "available_items": [
      {
        "item_id": "ITEM001",
        "name": "Extra Time Booster",
        "description": "Get 30 seconds extra in Speed Run",
        "cost_coins": 100,
        "cost_xp": 50,
        "category": "booster"
      },
      {
        "item_id": "ITEM002",
        "name": "Hint Unlock",
        "description": "Unlock hints for 5 questions",
        "cost_coins": 150,
        "cost_xp": 0,
        "category": "hint"
      }
    ]
  }
}
```

---

### GET /

Get all downloadable packs.

**Authentication**: Not required

**Success Response** (200):

```json
{
  "success": true,
  "data": [
    {
      "pack_id": "PACK001",
      "name": "Form 1 Mathematics Essentials",
      "description": "Complete offline pack for Form 1 Math",
      "size_mb": 45,
      "questions_count": 200,
      "quizzes_count": 15,
      "version": "1.0.0"
    }
  ]
}
```

---

## User Management Endpoints

### POST /user/create

Create a new user account.

**Authentication**: Not required

**Request Body**:

```json
{
  "user_id": "USR123ABC45",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com"
}
```

**Parameters**:
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| user_id | string | No | Auto-generated if not provided |
| first_name | string | Yes | User's first name |
| last_name | string | Yes | User's last name |
| email | string | Yes | Valid email |

**Success Response** (201):

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user_id": "USR123ABC45",
    "email": "john@example.com"
  }
}
```

---

### GET /user/{user_id}

Get user details by ID.

**Authentication**: Not required

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| user_id | string | User ID |

**Success Response** (200):

```json
{
  "success": true,
  "data": {
    "user_id": "USR123ABC45",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "student",
    "total_xp": 1250,
    "current_level": 4,
    "created_at": "2025-01-10T10:30:00Z"
  }
}
```

---

## Data Models

### User Model

```json
{
  "user_id": "USR123ABC45",
  "email": "student@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "student",
  "status": "active",
  "is_verified": true,
  "created_at": "2025-01-10T10:30:00Z",
  "last_login": "2025-01-18T14:30:00Z",
  "total_xp": 1250,
  "total_coins": 1200,
  "current_level": 4,
  "quizzes_completed": 45,
  "streak_days": 12,
  "longest_streak": 21,
  "game_mode_stats": {
    "arcade": {
      "attempts": 15,
      "completed": 14,
      "total_xp": 450
    },
    "speed_run": {
      "attempts": 8,
      "completed": 6,
      "total_xp": 250
    },
    "wild_card": {
      "attempts": 5,
      "completed": 5,
      "total_xp": 150
    }
  },
  "achievements": ["ACH001", "ACH002"],
  "badges": ["BADGE001"],
  "preferences": {
    "theme": "light",
    "notifications_enabled": true
  }
}
```

### Quiz Model

```json
{
  "_id": "QZ123ABC45",
  "title": "Form 1 Mathematics - Algebra Basics",
  "description": "Introduction to algebraic expressions and equations",
  "subject": "Mathematics",
  "category": "Algebra",
  "tags": ["equations", "expressions", "form-1"],
  "duration": 1800,
  "level": "Form 1",
  "questions": ["Q123", "Q124", "Q125"],
  "level_id": "LVL001",
  "xp_reward": 50,
  "difficulty_score": 1.5,
  "completion_count": 245,
  "average_score": 72.5,
  "is_active": true,
  "created_at": "2025-01-01T10:00:00Z",
  "updated_at": "2025-01-18T14:30:00Z"
}
```

### Question Model

```json
{
  "_id": "Q123ABC45",
  "question_text": "What is the value of 2x + 3 when x = 5?",
  "answers": ["10", "13", "15", "18"],
  "correct_answer": "13",
  "subject": "Mathematics",
  "topic": "Algebra",
  "level": "Form 1",
  "explanation": "Substitute x = 5: 2(5) + 3 = 10 + 3 = 13",
  "hint": "Remember to multiply 2 by 5 first",
  "tags": ["algebra", "equations", "substitution"],
  "points": 10,
  "time_limit_seconds": 60,
  "difficulty_score": 1.2,
  "created_at": "2025-01-01T10:00:00Z"
}
```

### Game Session Model

```json
{
  "_id": "SESS123ABC45",
  "user_id": "USR123ABC45",
  "mode": "arcade",
  "quizzes": ["QZ1", "QZ2", "QZ3"],
  "current_quiz_index": 1,
  "score": 85,
  "total_questions": 15,
  "started_at": "2025-01-18T14:30:00Z",
  "status": "active",
  "xp_earned": 50,
  "time_limit": null
}
```

### Achievement Model

```json
{
  "_id": "ACH001",
  "name": "First Steps",
  "description": "Complete your first quiz",
  "icon": "badge_starter.png",
  "points": 10,
  "condition": "quizzes_completed >= 1",
  "category": "beginner",
  "rarity": "common"
}
```

---

## Common Query Parameters

### Pagination Parameters

| Parameter | Type    | Default | Description              |
| --------- | ------- | ------- | ------------------------ |
| page      | integer | 1       | Page number (1-indexed)  |
| page_size | integer | 20      | Items per page (1-100)   |
| limit     | integer | 10      | Alternative to page_size |

### Filter Parameters

| Parameter | Type   | Description                             |
| --------- | ------ | --------------------------------------- |
| subject   | string | Filter by subject (e.g., "Mathematics") |
| level     | string | Filter by form level (e.g., "Form 1")   |
| category  | string | Filter by category                      |
| tags      | array  | Filter by tags (comma-separated)        |
| status    | string | Filter by status                        |

### Sort Parameters

| Parameter | Type   | Description                                |
| --------- | ------ | ------------------------------------------ |
| sort_by   | string | Field to sort by                           |
| order     | string | "asc" for ascending, "desc" for descending |

### Example Query

```bash
GET /quiz/list?page=2&page_size=50&subject=Mathematics&sort_by=created_at&order=desc
```

---

## Rate Limiting

**Development**: No rate limiting  
**Production**: 100 requests per 60 seconds per IP

If rate limit exceeded:

```json
{
  "detail": "Rate limit exceeded"
}
```

---

## CORS Policy

**Development**: Allows all origins (`*`)  
**Production**: Allows only:

- `https://api.gradex.rapidshyft.com`
- Configured production domain

---

## Example Workflows

### Complete User Registration & Login Flow

```bash
# 1. Register
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }'

# 2. Request OTP
curl -X POST http://localhost:8000/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com"
  }'
# Check email for OTP code

# 3. Login with OTP
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "otp": "123456"
  }'
# Response includes access_token and refresh_token

# 4. Use access token
curl -X GET http://localhost:8000/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Complete Quiz Gameplay Flow

```bash
# 1. Get available quizzes
curl -X GET "http://localhost:8000/quiz/list?subject=Mathematics&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# 2. Start arcade mode
curl -X POST http://localhost:8000/game-modes/arcade/start \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subject_filter": "Mathematics",
    "limit": 5
  }'
# Response: session_id

# 3. Get session details
curl -X GET http://localhost:8000/game-modes/session/SESS123ABC45 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# 4. Submit quiz result
curl -X POST http://localhost:8000/game-modes/session/SESS123ABC45/submit-quiz \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "quiz_id": "QZ123",
    "total_score": 85,
    "max_score": 100,
    "xp_earned": 50,
    "time_taken_seconds": 420
  }'

# 5. Complete session
curl -X POST http://localhost:8000/game-modes/session/SESS123ABC45/complete \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Support & Documentation

- **API Documentation**: This file
- **Swagger UI**: `http://localhost:8000/docs` (Development only)
- **ReDoc**: `http://localhost:8000/redoc` (Development only)
- **GitHub**: https://github.com/rapidshyft/gradex-backend
- **Issues**: Report bugs on GitHub Issues

---

## Version History

| Version | Date       | Changes             |
| ------- | ---------- | ------------------- |
| 1.0.0   | 2025-01-18 | Initial API release |

---

**Last Updated**: January 18, 2025  
**API Maintainer**: GradeX Development Team
