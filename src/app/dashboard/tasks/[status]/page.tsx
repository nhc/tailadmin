import UserTasksView from "@/components/_pages/dashboard/UserTasksView";
import { useServerUser } from "@/lib/hooks/useServerUser";
import { TaskStatus } from "@/lib/db/api/types";
import { headers } from "next/headers";
import { getByCreatorAndStatus } from "@/lib/actions/tasks";

export default async function OpenTasksPage() {
  const { userData: user, error } = await useServerUser();

  const headerList = await headers();
  const pathname = headerList.get("x-current-path");

  const status = pathname?.split("/").pop() || "open";

  if (!user || error) {
    return <div>Error: {error}</div>;
  }

  // Fetch tasks on the server side
  let tasks = null;
  try {
    const result = await getByCreatorAndStatus(user.id, status as TaskStatus);
    tasks = result?.data || null;
  } catch (taskError) {
    console.error("Failed to fetch tasks:", taskError);
  }

  return <UserTasksView taskType={status as TaskStatus} user={user} initialTasks={tasks} />;
}
