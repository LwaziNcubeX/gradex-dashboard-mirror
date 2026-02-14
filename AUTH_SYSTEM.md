# Authentication System Documentation

## Overview

The application now has a complete authentication system with:

- JWT token-based authentication
- Secure cookie storage (HttpOnly, Secure, SameSite)
- Route protection with middleware
- Client-side auth hooks
- Server-side session management

## Architecture

### 1. **Middleware** (`middleware.ts`)

- Protects routes at the request level
- Checks JWT token validity
- Redirects unauthenticated users to `/auth`
- Redirects authenticated users away from `/auth` to `/`
- Uses modern Next.js 13+ middleware API

### 2. **API Routes**

#### `GET /api/auth/check`

- Checks if user is currently authenticated
- Returns 200 if authenticated, 401 if not
- Clears expired tokens automatically

#### `POST /api/auth/logout`

- Logs out user and clears authentication cookies
- Called on client logout

### 3. **Client-Side Utilities**

#### `lib/api.ts`

- `saveAuth(data)` - Save auth tokens after login
- `logoutUser()` - Logout and clear tokens
- `getAccessToken()` - Get current access token
- `isAuthenticated()` - Check auth status (client-side)

#### `lib/hooks/useAuth.ts`

- Custom React hook for auth management
- Provides `isAuthenticated`, `isLoading`, `logout()`
- Handles auth checking and logout flow

### 4. **Token Management** (`lib/cookie-manager.ts`)

- Secure token storage with js-cookie
- Automatic expiration checking
- JWT decoding and validation
- Token refresh capability

## Flow Diagrams

### Login Flow

```
User → /auth (Auth Page)
  ↓
Enter Email → Call GET /auth/request-otp
  ↓
Receive OTP → Call POST /auth with OTP
  ↓
Success → saveAuth() → Tokens saved in cookies
  ↓
Middleware validates token → User redirected to /
  ↓
Access Dashboard
```

### Protected Route Access

```
User requests /content
  ↓
Middleware checks accessToken cookie
  ↓
If valid & not expired → Allow access
  ↓
If invalid or expired → Redirect to /auth
```

### Logout Flow

```
User clicks Logout
  ↓
Call logoutUser()
  ↓
API POST /api/auth/logout → Clear server-side
  ↓
Client-side: Clear cookies
  ↓
Redirect to /auth
  ↓
Middleware protects routes → User cannot access protected pages
```

## Protected Routes

The following routes are protected and require authentication:

- `/` - Dashboard
- `/content` - Content Management
- `/students` - Students Management
- `/feedback` - Feedback Management
- `/analytics` - Analytics
- `/settings` - Settings

## Public Routes

These routes are accessible without authentication:

- `/auth` - Authentication page
- `/api/auth/*` - Auth API endpoints

## Usage Examples

### Using the useAuth Hook

```tsx
"use client";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";

export function Dashboard() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    router.push("/auth");
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div>
      <h1>Welcome to Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
```

### Using the Auth API Functions

```tsx
import { saveAuth, logoutUser, getAccessToken } from "@/lib/api";

// Save tokens after login
await saveAuth({
  access_token: "token123...",
  refresh_token: "refresh123...",
});

// Get current token
const token = getAccessToken();

// Logout
await logoutUser();
```

### Using the Auth Config

```tsx
import { AUTH_CONFIG } from "@/lib/auth-config";

// Access configuration
console.log(AUTH_CONFIG.api.REQUEST_OTP);
console.log(AUTH_CONFIG.redirects.AFTER_LOGIN);
console.log(AUTH_CONFIG.cookies.ACCESS_TOKEN);
```

## Security Features

✅ **Secure Cookies**

- `secure: true` - HTTPS only
- `sameSite: 'strict'` - CSRF protection
- `httpOnly: true` (via cookie-manager)

✅ **JWT Validation**

- Automatic expiration checking
- Token format validation
- Graceful error handling

✅ **Route Protection**

- Server-side middleware validation
- No client-side only protection
- Automatic redirect on auth failure

✅ **Error Handling**

- Comprehensive error messages
- Automatic token cleanup on expiration
- Fallback logout mechanism

## Configuration

Update `lib/auth-config.ts` to modify:

- API endpoints
- Cookie names
- Token expiration times
- Route definitions
- Redirect paths

## Migration Notes

### From Old System

✅ Upgraded from deprecated middleware API
✅ Using latest Next.js 13+ features
✅ Improved security with middleware-first approach
✅ Better type safety throughout

### For Existing Components

- Update logout calls to use async `logoutUser()`
- Use `useAuth()` hook instead of direct cookie checks
- Ensure components are marked with "use client" when using hooks

## Troubleshooting

### User redirected to /auth despite being logged in

- Check if access token is valid
- Verify token expiration via middleware logs
- Clear browser cookies and re-login

### Cookies not persisting

- Ensure credentials: "include" in fetch calls
- Check if running on HTTPS in production
- Verify domain and path settings

### Middleware not working

- Check `middleware.ts` is in project root
- Verify route matcher pattern
- Check Next.js version >= 13

## Testing the System

1. **Test Login Flow**

   - Go to `/auth`
   - Enter email and validate OTP
   - Verify redirected to `/` dashboard

2. **Test Protected Routes**

   - Clear cookies
   - Try accessing `/content`
   - Verify redirected to `/auth`

3. **Test Logout**

   - Login successfully
   - Click logout button
   - Verify redirected to `/auth`
   - Try accessing `/content` - should redirect to `/auth`

4. **Test Token Expiration**
   - Wait for token to expire (14 days)
   - Try accessing protected route
   - Verify redirected to `/auth` or cookie cleared
