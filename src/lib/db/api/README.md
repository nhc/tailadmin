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

// Create a notification
await notificationsApi.createNotification(
  supabase,
  userId,
  "task_claimed",
  'Your task "Fix login bug" has been claimed by John Doe'
);
```

## Best Practices

1. **Always handle errors** - Wrap API calls in try-catch blocks
2. **Use pagination** - For large datasets, use pagination to avoid performance issues
3. **Validate input** - Validate data before passing to API functions
4. **Use appropriate functions** - Use specific functions (e.g., `getByStatus`) instead of filtering general functions
5. **Cache when appropriate** - Cache frequently accessed data
6. **Use transactions** - For operations that modify multiple tables, consider using database transactions

## Migration Notes

When the database schema changes:

1. Update the types in `types.ts`
2. Update the corresponding API functions
3. Update any code that uses the changed functions
4. Test thoroughly to ensure backward compatibility
