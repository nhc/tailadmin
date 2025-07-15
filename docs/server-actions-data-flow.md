# Server Actions Data Flow Solution

## Problem

Server actions were returning `undefined` to client components when called from server-rendered pages, even though the server actions were executing successfully on the server side.

## Root Cause

Server actions cannot be called from server components. When a client component is rendered on the server (SSR), any server actions called from within that component will return `undefined` to the client.

## Solution: Server-Side Data Fetching with Client-Side Fallback

### Architecture

1. **Server Component** (`page.tsx`) fetches data using server actions
2. **Client Component** (`UserTasksView.tsx`) receives data as props
3. **Fallback**: Client component can fetch data if not provided via props

### Implementation

#### 1. Server Component (Page)

```tsx
// src/app/dashboard/tasks/[status]/page.tsx
export default async function OpenTasksPage() {
  const { userData: user, error } = await useServerUser();

  // Fetch tasks on the server side
  let tasks = null;
  try {
    const result = await getTasksByCreator(user.id);
    tasks = result?.data || null;
  } catch (taskError) {
    console.error("Failed to fetch tasks:", taskError);
  }

  return <UserTasksView taskType={status} user={user} initialTasks={tasks} />;
}
```

#### 2. Client Component

```tsx
// src/components/_pages/dashboard/UserTasksView.tsx
export const UserTasksView = ({
  user,
  taskType,
  initialTasks,
}: {
  user: User;
  taskType: TaskStatus;
  initialTasks?: TaskWithRelations[] | null;
}) => {
  const [tasks, setTasks] = useState<TaskWithRelations[]>(initialTasks || []);

  useEffect(() => {
    // If we have initialTasks, don't fetch again
    if (initialTasks) {
      return;
    }

    // Fallback: fetch data on client side if not provided
    const fetchUserTasks = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const result = await getTasksByCreator(user.id);
        if (result && result.data) {
          setTasks(result.data as TaskWithRelations[]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchUserTasks();
  }, [user, initialTasks]);

  // ... rest of component
};
```

### Data Flow

1. **Server**: `page.tsx` calls `getTasksByCreator()` server action
2. **Server**: Data is fetched and serialized
3. **Server**: Data is passed as `initialTasks` prop to client component
4. **Client**: Component uses `initialTasks` if available, otherwise fetches data
5. **Client**: Component renders with data

### Benefits

- ✅ Server actions work correctly on server side
- ✅ Data is available immediately on page load (no loading state)
- ✅ Fallback mechanism for client-side fetching
- ✅ Maintains SSR benefits
- ✅ Clean separation of concerns

### Key Points

- Server actions work fine when called from server components
- Server actions return `undefined` when called from client components that are SSR'd
- Always fetch data on server side when possible
- Provide fallback for client-side fetching when needed
- Use `JSON.parse(JSON.stringify())` to ensure data serialization
