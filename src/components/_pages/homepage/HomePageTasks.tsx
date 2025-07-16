import { HomePageTasksClient } from "./HomePageTasksClient";

import { createClient } from "@/lib/supabase/server";
import { tasksApi } from "@/lib/db/api";

export default async function HomePageTasks() {
  const supabase = await createClient();

  // Fetch open tasks (waiting to be claimed)
  const { data: tasks, count } = await tasksApi.getByStatus(supabase, "open");

  // return <HomePageTasksClient count={count || 0} tasks={tasks || []} />;
  return <div>HomePageTasks</div>;
}
