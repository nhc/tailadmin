import UserTasksView from "@/components/_pages/dashboard/UserTasksView";

import { useServerUser } from "@/lib/hooks/useServerUser";
import { TaskStatus } from "@/lib/db/api/types";
import { headers } from "next/headers";

export default async function OpenTasksPage() {
  const { userData: user, error } = await useServerUser();

  const headerList = await headers();
  const pathname = headerList.get("x-current-path");

  const status = pathname?.split("/").pop() || "open";

  if (!user || error) {
    return <div>Error: {error}</div>;
  }

  return <UserTasksView taskType={status as TaskStatus} user={user} />;
}
