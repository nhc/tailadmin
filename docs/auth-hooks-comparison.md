# Authentication Hooks Comparison

This document explains the differences between `useAuth.ts` and `useUser.ts` hooks and when to use each one.

## Overview

The application has two distinct authentication-related hooks that serve different purposes:

- **`useAuth.ts`**: Manages authentication state and Supabase auth user
- **`useUser.ts`**: Manages application user data and business logic

## Provider Setup

The application uses a `UserProvider` context to manage user state globally. This is set up in the layout files:

```typescript
// In layout.tsx
import { UserProvider } from "@/context/UserContext";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>
          <UserProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

## useAuth.ts - Authentication State Management

### Purpose

Handles authentication state and manages the Supabase auth user.

### Data Source

- Uses `supabase.auth.getUser()`
- Listens to auth state changes via `onAuthStateChange`

### Returns

Supabase `User` object (from `@supabase/supabase-js`)

### Key Features

- Tracks if user is authenticated (`isAuthenticated`)
- Provides `signOut()` function
- Listens to auth state changes (sign in/out events)
- Simple loading/error states

### Usage

```typescript
const { user, isAuthenticated, signOut } = useAuth();
```

### When to Use

- Login/logout functionality
- Checking if user is authenticated
- Basic auth state management
- Components that only need auth status

## useUser.ts - Application User Data Management

### Purpose

Manages application-specific user data and extends authentication with business logic.

### Data Source

1. First gets auth user via `supabase.auth.getUser()`
2. Then fetches complete user profile from database via `usersApi.getById()`

### Returns

Custom `User` type (from your database schema)

### Key Features

- Fetches complete user profile from database
- Provides role-based helpers (`isViber`, `isCoder`, `isAdmin`)
- Includes `updateUser()` function for profile updates
- More complex state management with database operations

### Usage

```typescript
const { user, isAdmin, updateUser } = useUser();
```

### When to Use

- Components that need full user profile data
- Role-based access control
- User profile management
- Business logic that depends on user data

## Key Differences

| Aspect            | useAuth         | useUser               |
| ----------------- | --------------- | --------------------- |
| **Data Scope**    | Auth state only | Full user profile     |
| **User Type**     | Supabase User   | Custom User type      |
| **Functionality** | Basic auth      | Business logic + CRUD |
| **Dependencies**  | None            | Depends on useAuth    |
| **Complexity**    | Simple          | Complex               |

## Architecture Pattern

```
useAuth (Authentication Layer)
    ↓
useUser (Application Layer)
    ↓
Components (UI Layer)
```

`useUser` essentially builds on top of `useAuth` to provide a complete user management solution for your application.

## Best Practices

### Use useAuth when:

- You only need to check if user is logged in
- Implementing login/logout functionality
- Components that don't need user profile data
- Performance is critical (useAuth is lighter)

### Use useUser when:

- You need user profile information
- Implementing role-based features
- User profile management
- Components that need business logic

### Avoid:

- Using both hooks in the same component unnecessarily
- Calling useUser when you only need auth state
- Mixing auth and user data concerns

## Provider Setup

The application uses a `UserProvider` context to manage user state globally. This is set up in the layout files:

```typescript
// In layout.tsx
import { UserProvider } from "@/context/UserContext";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>
          <UserProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

## Example Implementation

```typescript
// Auth-only component
export const LoginButton = () => {
  const { isAuthenticated, signOut } = useAuth();

  return isAuthenticated ? (
    <button onClick={signOut}>Sign Out</button>
  ) : (
    <button>Sign In</button>
  );
};

// User data component (using context)
export const UserProfile = () => {
  const { user, isAdmin, updateUser } = useUserContext();

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>{user.nickname}</h1>
      {isAdmin && <AdminPanel />}
      <button onClick={() => updateUser({ nickname: "New Name" })}>
        Update Profile
      </button>
    </div>
  );
};

// Alternative: Direct hook usage
export const UserProfileDirect = () => {
  const { user, isAdmin, updateUser } = useUser();

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>{user.nickname}</h1>
      {isAdmin && <AdminPanel />}
    </div>
  );
};
```

## Provider vs Direct Hook Usage

### Use `useUserContext()` when:

- You want to share user state across multiple components
- Performance is important (prevents multiple API calls)
- You need consistent user state throughout the app

### Use `useUser()` directly when:

- You need isolated user state for a specific component
- The component is outside the provider tree
- You want to avoid context dependencies

## Dashboard Route Usage

For dashboard routes that need user information like name and email, use `useUserContext()`:

```typescript
export const DashboardPage = () => {
  const { user, loading, error, isAdmin } = useUserContext();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>Not authenticated</div>;

  return (
    <div>
      <h1>Welcome, {user.nickname}!</h1>
      <p>Email: {user.email}</p>
      {isAdmin && <AdminPanel />}
    </div>
  );
};
```

### Why use `useUserContext()` for Dashboard Routes:

1. **Full User Profile**: Fetches complete user profile from database
2. **Role-Based Features**: Provides role helpers (`isAdmin`, `isCoder`, `isViber`)
3. **Profile Updates**: Includes `updateUser()` function for profile management
4. **Performance**: Shared state prevents multiple API calls
5. **Consistency**: Same user state across all dashboard components
