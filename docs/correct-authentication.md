I'll analyze this Next.js with Supabase repository to understand how authentication works, including SSR vs client usage and any hooks/context patterns. Let me start by exploring the codebase structure and key authentication files.

Read file: lib/supabase/client.ts
Read file: lib/supabase/server.ts
Read file: lib/supabase/middleware.ts
Read file: middleware.ts
Read file: components/auth-button.tsx
Read file: components/logout-button.tsx
Read file: app/auth/login/page.tsx
Read file: components/login-form.tsx
Read file: app/protected/page.tsx
Read file: app/protected/layout.tsx
Read file: app/auth/confirm/route.ts
Read file: components/sign-up-form.tsx
Search files...
Based on my analysis of this Next.js with Supabase repository, here's a comprehensive overview of how authentication works:

## Authentication Architecture Overview

This repository implements a **hybrid SSR/Client authentication system** using Supabase with Next.js 15 App Router. The authentication is primarily **server-side rendered** with minimal client-side state management.

## Key Authentication Components

### 1. **Supabase Client Setup**

**Server Client** (`lib/supabase/server.ts`):

```typescript
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          /* handle cookie setting */
        },
      },
    }
  );
}
```

**Browser Client** (`lib/supabase/client.ts`):

```typescript
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### 2. **Middleware-Based Route Protection**

The middleware (`middleware.ts` and `lib/supabase/middleware.ts`) handles:

- **Session management** across all routes
- **Automatic redirects** for unauthenticated users
- **Cookie synchronization** between browser and server

```typescript
// Middleware checks user on every request
const {
  data: { user },
} = await supabase.auth.getUser();

if (!user && !request.nextUrl.pathname.startsWith("/auth")) {
  return NextResponse.redirect(new URL("/auth/login", request.url));
}
```

## SSR vs Client Usage Patterns

### **Server-Side Rendering (SSR) Usage:**

1. **User Authentication Status** (`components/auth-button.tsx`):

```typescript
export async function AuthButton() {
  const supabase = await createClient(); // Server client
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div>
      Hey, {user.email}! <LogoutButton />
    </div>
  ) : (
    <div>Sign in / Sign up buttons</div>
  );
}
```

2. **Protected Page Access** (`app/protected/page.tsx`):

```typescript
export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return <div>Protected content...</div>;
}
```

3. **Email Confirmation** (`app/auth/confirm/route.ts`):

```typescript
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ type, token_hash });
  // Handle verification server-side
}
```

### **Client-Side Usage:**

1. **Login Form** (`components/login-form.tsx`):

```typescript
"use client";
const handleLogin = async (e: React.FormEvent) => {
  const supabase = createClient(); // Browser client
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  router.push("/protected");
};
```

2. **Logout Button** (`components/logout-button.tsx`):

```typescript
"use client";
const logout = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  router.push("/auth/login");
};
```

3. **Sign-up Form** (`components/sign-up-form.tsx`):

```typescript
"use client";
const handleSignUp = async (e: React.FormEvent) => {
  const supabase = createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${window.location.origin}/protected` },
  });
};
```

## Authentication Flow

### **1. User Registration:**

1. Client-side form submission → `supabase.auth.signUp()`
2. Email confirmation sent
3. User clicks email link → `/auth/confirm/route.ts`
4. Server-side OTP verification
5. Redirect to protected page

### **2. User Login:**

1. Client-side form submission → `supabase.auth.signInWithPassword()`
2. Session established via cookies
3. Middleware validates session on subsequent requests
4. Redirect to protected page

### **3. Route Protection:**

1. Middleware runs on every request
2. Checks user session via `supabase.auth.getUser()`
3. Redirects unauthenticated users to `/auth/login`
4. Allows access to protected routes for authenticated users

## Key Design Patterns

### **No Context Provider Needed:**

- **No React Context** for auth state management
- **No custom hooks** for authentication
- **Server-side session validation** on every request
- **Minimal client-side state** (only form state)

### **Hybrid Approach Benefits:**

- **SEO-friendly**: Server renders authenticated content
- **Security**: Session validation happens server-side
- **Performance**: No client-side auth state synchronization
- **Simplicity**: No complex state management

### **When to Use Each Client:**

**Server Client** (`createClient()` from `server.ts`):

- Server Components
- API Routes
- Middleware
- Initial page loads

**Browser Client** (`createClient()` from `client.ts`):

- Client Components with "use client"
- Form submissions
- Interactive auth actions (login/logout)

This architecture prioritizes **server-side rendering** for security and SEO while using client-side interactions only for user-initiated actions like form submissions. The middleware ensures consistent authentication across all routes without requiring complex client-side state management.
