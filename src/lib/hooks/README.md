# Authentication Hooks

## useAuth

A React hook that provides authentication state and user information using Supabase client-side authentication.

### Usage

```tsx
import { useAuth } from "@/lib/hooks/useAuth";

export const MyComponent = () => {
  const { user, loading, error, isAuthenticated } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {isAuthenticated ? <p>Welcome, {user?.email}!</p> : <p>Please sign in</p>}
    </div>
  );
};
```

### API

The hook returns an object with the following properties:

- `user: User | null` - The current user object from Supabase, or null if not authenticated
- `loading: boolean` - Whether the authentication state is being determined
- `error: string | null` - Any error that occurred during authentication
- `isAuthenticated: boolean` - Convenience boolean indicating if user is logged in

### Features

- Automatically handles authentication state changes
- Provides loading states for better UX
- Error handling for authentication failures
- Real-time updates when user logs in/out
- TypeScript support with proper types
