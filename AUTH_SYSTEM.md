# Authentication System Documentation

## Overview

This Next.js application uses a production-ready authentication system with HTTP-only cookies for secure session management. The backend (NestJS) handles authentication and sets cookies, while the frontend validates sessions and manages UI state.

## Architecture

### Backend (NestJS)
- **Cookie-based authentication** with `accessToken` and `refreshToken`
- **Secure cookie configuration** with httpOnly, secure, and sameSite flags
- **JWT tokens** for stateless authentication
- **Session validation** via `/auth/me` endpoint

### Frontend (Next.js)
- **Server-side session fetching** using `getSession()`
- **Middleware protection** for authenticated routes
- **Server actions** for logout functionality
- **Optimistic UI updates** with React transitions

## Key Files

### Core Authentication
- `lib/getSession.ts` - Server-side session fetcher
- `lib/actions/auth.ts` - Server actions (logout)
- `lib/fetcher.ts` - Authenticated API fetcher utility
- `middleware.ts` - Route protection middleware

### UI Components
- `components/ui/profile-dropdown.tsx` - User profile dropdown with logout
- `app/(main)/_components/navbar/index.tsx` - Main layout navbar
- `app/dashboard/_components/header/index.tsx` - Dashboard header

## Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Usage Examples

### Fetching User Session

```typescript
import { getSession } from "@/lib/getSession";

export default async function Page() {
  const user = await getSession();
  
  if (!user) {
    return <div>Please log in</div>;
  }
  
  return <div>Welcome, {user.name}!</div>;
}
```

### Using the Fetcher Utility

```typescript
import { fetcher } from "@/lib/fetcher";

// GET request
const users = await fetcher<User[]>("/users");

// POST request
const newUser = await fetcher<User>("/users", {
  method: "POST",
  body: JSON.stringify({ name: "John", email: "john@example.com" }),
});

// Public endpoint (no auth required)
const publicData = await fetcher("/public/data", { requireAuth: false });
```

### Logout Functionality

```typescript
import { logout } from "@/lib/actions/auth";

function LogoutButton() {
  return (
    <button onClick={() => logout()}>
      Logout
    </button>
  );
}
```

## Protected Routes

The middleware automatically protects these route patterns:
- `/dashboard/*` - Admin dashboard
- `/users/*` - User profiles

Unauthenticated users are redirected to `/auth/login` with a return URL.

## Cookie Configuration

Backend sets cookies with these security settings:
- `httpOnly: true` - Prevents XSS attacks
- `secure: true` (production) - HTTPS only
- `sameSite: 'none'` (production) or `'lax'` (development)
- `domain` - Configurable via `COOKIE_DOMAIN` env variable
- `path: '/'` - Available site-wide

## Session Flow

1. **Login**: User submits credentials → Backend validates → Sets cookies → Redirects
2. **Session Check**: Frontend calls `getSession()` → Sends cookies → Backend validates JWT → Returns user data
3. **Protected Route**: Middleware checks cookies → Redirects if missing
4. **Logout**: Frontend calls `logout()` → Backend clears cookies → Redirects to login

## Type Safety

The `User` interface provides full TypeScript support:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: string;
  isEmailVerified: boolean;
  isSellerVerified: boolean;
  stripeOnboardingComplete: boolean;
  isTwoFactorEnabled: boolean;
  roles: string[];
  permissions: string[];
}
```

## Best Practices

1. **Always use `getSession()` on the server** - Never expose tokens to client
2. **Use middleware for route protection** - Centralized auth logic
3. **Handle loading states** - Use React Suspense and transitions
4. **Error boundaries** - Catch and display auth errors gracefully
5. **Refresh tokens** - Backend handles automatic token refresh
6. **CORS configuration** - Ensure backend allows frontend origin

## Security Considerations

- ✅ HTTP-only cookies prevent XSS attacks
- ✅ Secure flag ensures HTTPS-only transmission
- ✅ SameSite prevents CSRF attacks
- ✅ Short-lived access tokens (24h)
- ✅ Long-lived refresh tokens (7 days)
- ✅ Server-side session validation
- ✅ Automatic token refresh
- ✅ Logout clears all tokens

## Troubleshooting

### Session not persisting
- Check cookie domain configuration
- Verify CORS settings on backend
- Ensure credentials: 'include' in fetch requests

### Redirect loops
- Check middleware matcher patterns
- Verify protected routes configuration
- Ensure auth routes are excluded from protection

### 401 Errors
- Verify backend is running
- Check API_URL environment variable
- Confirm cookies are being sent
- Check token expiration

## Production Deployment

1. Set environment variables:
   ```env
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

2. Backend configuration:
   ```env
   COOKIE_DOMAIN=.yourdomain.com
   NODE_ENV=production
   APP_CLIENT_URL=https://yourdomain.com
   ```

3. Ensure HTTPS is enabled on both frontend and backend

4. Configure CORS to allow your frontend domain

5. Test authentication flow thoroughly

## Next.js Rewrites

The `next.config.ts` includes a rewrite rule for `/backend/*` paths:

```typescript
async rewrites() {
  return [
    {
      source: "/backend/:path*",
      destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
    },
  ];
}
```

This allows calling backend APIs via `/backend/auth/me` instead of the full URL.
