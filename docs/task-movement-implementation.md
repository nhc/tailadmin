# Task Movement Implementation

## Overview

This document describes the implementation of task movement functionality throughout the system, allowing users to move tasks between different statuses based on their roles and permissions.

## Architecture

The implementation follows the server actions data flow pattern described in `docs/server-actions-data-flow.md`:

1. **Server Actions** (`src/lib/actions/tasks.ts`) - Handle task transitions and audit logging
2. **Client Components** (`src/components/_pages/dashboard/TaskActions.tsx`) - UI for triggering actions
3. **State Machine** (`src/lib/state-machines/task-state-machine.ts`) - Enforces valid transitions
4. **Audit Trail** (`src/lib/db/api/audit-trail.ts`) - Logs all task transitions

## Key Components

### 1. Task Transition Server Actions

**File:** `src/lib/actions/tasks.ts`

New server actions added:

- `transitionTask()` - Generic transition function with validation
- `claimTask()` - Specific action for claiming tasks
- `startWorkOnTask()` - Specific action for starting work
- `deliverTask()` - Specific action for delivering work
- `completeTask()` - Specific action for completing tasks
- `disputeTask()` - Specific action for disputing deliveries
- `cancelTask()` - Specific action for cancelling tasks
- `resolveDisputeForCoder()` - Resolve dispute in favor of coder
- `resolveDisputeForViber()` - Resolve dispute in favor of viber

Each action:

- Validates user authentication
- Checks user permissions using the state machine
- Updates task status in the database
- Creates audit log entries
- Returns updated task data

### 2. Enhanced TaskActions Component

**File:** `src/components/_pages/dashboard/TaskActions.tsx`

Updates include:

- Integration with server actions
- Loading states for each action
- Error handling and display
- Optimistic updates via `onTaskUpdated` callback
- Proper button styling and accessibility

### 3. Updated UserTasksView Component

**File:** `src/components/_pages/dashboard/UserTasksView.tsx`

Updates include:

- Task state management for real-time updates
- Integration with TaskActions component
- Proper callback handling for task updates

### 4. Enhanced Type Definitions

**File:** `src/lib/db/api/types.ts`

Added missing audit action types:

- `task_disputed`
- `task_cancelled`

## User Role Permissions

The system enforces role-based permissions for task transitions:

### Coder Role

- Can claim open tasks
- Can start work on claimed tasks
- Can deliver work from in-progress tasks
- Can pause work (move from in-progress to claimed)
- Can cancel tasks they've claimed

### Viber Role

- Can cancel open tasks
- Can accept deliveries (complete tasks)
- Can dispute deliveries
- Can resolve disputes in their favor

### Admin/Superuser Role

- Can perform all transitions
- Can assign tasks directly
- Can resolve disputes in favor of either party

## Task Status Flow

```
open → claimed → inprogress → delivered → completed
  ↓       ↓         ↓           ↓
cancelled ← ← ← ← ← ← ← ← ← ← ← ←
  ↑                           ↑
disputed ← ← ← ← ← ← ← ← ← ← ← ←
```

## Audit Logging

Every task transition is logged with:

- User ID who performed the action
- Action type (e.g., `task_claimed`, `task_delivered`)
- Entity type (`task`)
- Entity ID (task ID)
- Metadata including:
  - From status
  - To status
  - Action description
  - Additional context (delivery notes, dispute reasons, etc.)

## Error Handling

The implementation includes comprehensive error handling:

1. **Authentication Errors** - User must be logged in
2. **Authorization Errors** - User must have permission for the action
3. **Validation Errors** - Invalid transitions are prevented
4. **Database Errors** - Failed updates are caught and reported
5. **Network Errors** - API failures are handled gracefully

## Testing

A test page has been created at `/dashboard/test-task-actions` to verify:

- Action button visibility based on user role and task status
- Loading states during action execution
- Error handling and display
- Task status updates
- Audit log creation

## Usage Examples

### Basic Task Claiming

```typescript
// In a component
const handleClaimTask = async (taskId: string) => {
  try {
    const updatedTask = await claimTask(taskId);
    // Handle successful update
  } catch (error) {
    // Handle error
  }
};
```

### With UI Integration

```typescript
<TaskActions
  task={task}
  user={user}
  onAction={(action, taskId) => console.log(action, taskId)}
  onTaskUpdated={(updatedTask) => setTask(updatedTask)}
/>
```

## Security Considerations

1. **Server-side validation** - All transitions are validated on the server
2. **Role-based permissions** - Users can only perform actions allowed for their role
3. **Audit trail** - All actions are logged for accountability
4. **Authentication required** - All actions require valid user session
5. **Input sanitization** - All inputs are validated and sanitized

## Performance Considerations

1. **Optimistic updates** - UI updates immediately while server processes
2. **Minimal re-renders** - Only affected components update
3. **Efficient queries** - Database operations are optimized
4. **Caching** - Task data is cached appropriately

## Future Enhancements

Potential improvements:

1. **Real-time updates** - WebSocket integration for live status changes
2. **Bulk actions** - Allow multiple task transitions at once
3. **Advanced notifications** - Email/SMS notifications for status changes
4. **Workflow automation** - Automatic actions based on time or conditions
5. **Approval workflows** - Multi-step approval processes for certain transitions
