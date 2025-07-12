# Database API Functions

This directory contains comprehensive CRUD functions for all database tables in the Last20 platform. All functions are designed to be secure, performant, and follow best practices.

## Structure

- `types.ts` - TypeScript type definitions for all database entities
- `users.ts` - User management functions
- `tasks.ts` - Task management functions
- `claims.ts` - Task claim management functions
- `payments.ts` - Payment processing functions
- `attachments.ts` - File attachment management functions
- `audit-trail.ts` - Audit logging functions
- `reviews.ts` - User review functions
- `notifications.ts` - Notification management functions
- `task-secondary-assignees.ts` - Secondary task assignment functions
- `index.ts` - Main export file

## Usage

### Basic Usage

```typescript
import { createClient } from "@/lib/supabase/client";
import { usersApi, tasksApi } from "@/lib/db/api";

const supabase = createClient();

// Get a user by ID
const user = await usersApi.getById(supabase, "user-id");

// Create a new task
const task = await tasksApi.create(supabase, {
  title: "Fix login bug",
  description: "Users cannot log in with Google OAuth",
  tech_stack: ["React", "Next.js", "Supabase"],
  price: 150.0,
  category: "frontend",
  creator_id: "user-id",
});
```

### Server-Side Usage

```typescript
import { createClient } from "@/lib/supabase/server";
import { tasksApi } from "@/lib/db/api";

export async function GET() {
  const supabase = await createClient();

  // Get all open tasks
  const { data: tasks, count } = await tasksApi.getAll(supabase, {
    status: "open",
  });

  return Response.json({ tasks, count });
}
```

## Key Features

### Security

- All functions use parameterized queries to prevent SQL injection
- Proper error handling with meaningful error messages
- Input validation where appropriate

### Performance

- Efficient queries with proper indexing
- Pagination support for large datasets
- Optimized joins for related data

### Type Safety

- Full TypeScript support with strict typing
- Separate types for insert, update, and full entities
- Proper enum types for status fields

### Common Patterns

#### Pagination

Most list functions support pagination:

```typescript
const { data, count } = await tasksApi.getAll(supabase, {}, 1, 20);
```

#### Filtering

Many functions support filtering:

```typescript
const { data } = await tasksApi.getAll(supabase, {
  status: "open",
  category: "frontend",
  minPrice: 100,
  maxPrice: 500,
});
```

#### Related Data

Functions automatically include related data where appropriate:

```typescript
const task = await tasksApi.getById(supabase, "task-id");
// task includes creator and assignee information
```

## Error Handling

All functions throw errors that should be caught and handled appropriately:

```typescript
try {
  const user = await usersApi.getById(supabase, "user-id");
} catch (error) {
  console.error("Failed to get user:", error.message);
  // Handle error appropriately
}
```

## Common Queries

### Get all open tasks

```typescript
const { data: openTasks } = await tasksApi.getByStatus(supabase, "open");
```

### Get user's tasks

```typescript
const { data: userTasks } = await tasksApi.getByCreator(supabase, userId);
```

### Get claims for a task

```typescript
const claims = await claimsApi.getByTask(supabase, taskId);
```

### Get user's earnings

```typescript
const earnings = await paymentsApi.getCoderEarnings(supabase, coderId);
```

### Get user's average rating

```typescript
const avgRating = await reviewsApi.getAverageRating(supabase, userId);
```

## Audit Logging

The audit trail API provides comprehensive logging:

```typescript
import { auditTrailApi } from "@/lib/db/api";

// Log a task creation
await auditTrailApi.logAction(
  supabase,
  "task_created",
  "task",
  taskId,
  userId,
  { price: 150.0, category: "frontend" }
);
```

## Notifications

Create notifications easily:

```typescript
import { notificationsApi } from "@/lib/db/api";

// Create a notification for a user
await notificationsApi.create(supabase, {
  user_id: userId,
  type: "task_claimed",
  title: "Task Claimed",
  message: "Your task has been claimed by a coder",
  metadata: { taskId: "task-123" },
});
```

## Unified Client Architecture

This project uses a unified approach with `@supabase/supabase-js` for all database interactions:

### Client-Side Usage

```typescript
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
```

### Server-Side Usage

```typescript
import { createClient } from "@/lib/supabase/server";
const supabase = await createClient();
```

### Benefits

- **Consistent API**: Same client type for all operations
- **Type Safety**: Full TypeScript support without type casting
- **Performance**: Optimized client creation and reuse
- **Simplicity**: Single client configuration for all environments
