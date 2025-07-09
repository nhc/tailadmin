# User Context Pattern

## Overview

This project uses a dual-user data pattern where user information is stored in both Supabase Auth and a custom `users` table. The pattern separates authentication concerns from business logic data.

## Architecture

### 1. Authentication Layer (`useAuth`)

- **Location**: `src/lib/hooks/useAuth.ts`
- **Purpose**: Handles Supabase Auth authentication
- **Data**: Basic auth info (id, email, auth metadata)
- **Usage**: Public pages, auth flows

### 2. User Data Layer (`useUser`)

- **Location**: `src/lib/hooks/useUser.ts`
- **Purpose**: Fetches business logic user data from database
- **Data**: Role, stripe_account_id, onboarding_status, etc.
- **Usage**: Dashboard pages, protected routes

### 3. Context Provider (`UserContext`)

- **Location**: `src/context/UserContext.tsx`
- **Purpose**: Provides user data throughout dashboard
- **Wrapping**: Dashboard layout (`src/app/(dashboard)/layout.tsx`)

## Implementation Details

### User Hook (`useUser`)

```typescript
export const useUser = () => {
  // Fetches user data from database API
  // Listens to auth state changes
  // Provides updateUser function
  return {
    user: User | null,
    loading: boolean,
    error: string | null,
    updateUser: (updates: Partial<User>) => Promise<void>,
  };
};
```

### Context Provider

```typescript
export const UserProvider = ({ children }: UserProviderProps) => {
  const userData = useUser();
  return (
    <UserContext.Provider value={userData}>{children}</UserContext.Provider>
  );
};
```

### Dashboard Integration

```typescript
// src/app/(dashboard)/layout.tsx
<ThemeProvider>
  <UserProvider>
    <SidebarProvider>{children}</SidebarProvider>
  </UserProvider>
</ThemeProvider>
```

## Usage Patterns

### In Dashboard Pages

```typescript
import { useUserContext } from "@/context/UserContext";

export const DashboardPage = () => {
  const { user, loading, error, updateUser } = useUserContext();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <p>Role: {user?.role}</p>
    </div>
  );
};
```

### In Auth Pages

```typescript
import { useAuth } from "@/lib/hooks/useAuth";

export const AuthPage = () => {
  const { user, isAuthenticated, signOut } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={signOut}>Sign Out</button>
      ) : (
        <LoginForm />
      )}
    </div>
  );
};
```

## Data Flow

1. **Auth State Change** → `useAuth` detects change
2. **User Hook** → `useUser` fetches database data
3. **Context Update** → `UserContext` provides data to components
4. **Component Re-render** → Components receive updated user data

## Error Handling

- **Auth Errors**: Handled by `useAuth`
- **Database Errors**: Handled by `useUser`
- **Missing User Record**: Gracefully handled with null states
- **Network Errors**: Retry logic in user hook

## Type Safety

```typescript
// Auth User (Supabase)
type AuthUser = {
  id: string;
  email: string;
  // ... auth metadata
};

// Business User (Database)
type User = {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  stripe_account_id: string | null;
  onboarding_status: Record<string, unknown> | null;
  // ... business fields
};
```

## Best Practices

1. **Use `useAuth`** for authentication flows and public pages
2. **Use `useUserContext`** for dashboard pages and business logic
3. **Handle loading states** in components
4. **Provide error boundaries** for user data errors
5. **Update user data** through the `updateUser` function
6. **Keep auth and business data separate** for clean architecture

## File Structure

```
src/
├── lib/
│   ├── hooks/
│   │   ├── useAuth.ts          # Auth hook
│   │   └── useUser.ts          # User data hook
│   └── db/
│       └── api/
│           ├── users.ts         # User API functions
│           └── types.ts         # User types
├── context/
│   └── UserContext.tsx         # User context provider
└── app/
    └── (dashboard)/
        └── layout.tsx          # Dashboard layout with UserProvider
```

## Migration Notes

- **Existing Code**: Continue using `useAuth` for auth-only needs
- **New Dashboard Code**: Use `useUserContext` for business data
- **Gradual Migration**: Can migrate existing dashboard pages one by one
- **Backward Compatibility**: `useAuth` remains unchanged
