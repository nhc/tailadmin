"use client";

import { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { createClient } from "@/lib/supabase/client";
import { tasksApi } from "@/lib/db/api";
import type { Task } from "@/lib/db/api/types";
import Badge from "@/components/ui/badge/Badge";
import { ClockIcon, DollarSignIcon, UserIcon, TagIcon } from "lucide-react";

type TaskWithRelations = Task & {
  creator: {
    id: string;
    name: string | null;
    email: string;
    avatar_url: string | null;
  };
  primary_assignee: {
    id: string;
    name: string | null;
    email: string;
    avatar_url: string | null;
  } | null;
};

type TaskGroup = {
  status: string;
  title: string;
  color: string;
  tasks: TaskWithRelations[];
};

export const UserTasksView = () => {
  const { user } = useUserContext();
  const [tasks, setTasks] = useState<TaskWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserTasks = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const supabase = createClient();

        // Fetch tasks created by the user
        const { data: createdTasks } = await tasksApi.getByCreator(
          supabase as any,
          user.id
        );

        // Fetch tasks assigned to the user
        const { data: assignedTasks } = await tasksApi.getByAssignee(
          supabase as any,
          user.id
        );

        // Combine and deduplicate tasks
        const allTasks = [...(createdTasks || []), ...(assignedTasks || [])];
        const uniqueTasks = allTasks.filter(
          (task, index, self) =>
            index === self.findIndex((t) => t.id === task.id)
        );

        setTasks(uniqueTasks);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchUserTasks();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "info";
      case "claimed":
        return "warning";
      case "delivered":
        return "primary";
      case "completed":
        return "success";
      case "disputed":
        return "error";
      case "cancelled":
        return "light";
      default:
        return "light";
    }
  };

  const getStatusTitle = (status: string) => {
    switch (status) {
      case "open":
        return "Open";
      case "claimed":
        return "Claimed";
      case "delivered":
        return "Delivered";
      case "completed":
        return "Completed";
      case "disputed":
        return "Disputed";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const groupTasksByStatus = (tasks: TaskWithRelations[]): TaskGroup[] => {
    const groups: Record<string, TaskWithRelations[]> = {};

    tasks.forEach((task) => {
      if (!groups[task.status]) {
        groups[task.status] = [];
      }
      groups[task.status].push(task);
    });

    return Object.entries(groups).map(([status, tasks]) => ({
      status,
      title: getStatusTitle(status),
      color: getStatusColor(status),
      tasks,
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Your Tasks
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-48 bg-gray-200 rounded-xl animate-pulse dark:bg-gray-700"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Your Tasks
        </h2>
        <div className="p-6 text-center bg-red-50 rounded-xl dark:bg-red-900/20">
          <p className="text-red-600 dark:text-red-400">Error: {error}</p>
        </div>
      </div>
    );
  }

  const taskGroups = groupTasksByStatus(tasks);

  if (tasks.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Your Tasks
        </h2>
        <div className="p-8 text-center bg-gray-50 rounded-xl dark:bg-gray-800">
          <p className="text-gray-500 dark:text-gray-400">
            You don't have any tasks yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        Your Tasks ({tasks.length})
      </h2>

      {taskGroups.map((group) => (
        <div key={group.status} className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge color={group.color as any}>{group.title}</Badge>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {group.tasks.length} task{group.tasks.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.tasks.map((task) => (
              <div
                key={task.id}
                className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                      {task.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      {task.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Price */}
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSignIcon className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-600">
                      {formatPrice(task.price)}
                    </span>
                  </div>

                  {/* Category */}
                  <div className="flex items-center gap-2 text-sm">
                    <TagIcon className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400 capitalize">
                      {task.category}
                    </span>
                  </div>

                  {/* Tech Stack */}
                  {task.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {task.tech_stack.slice(0, 3).map((tech, index) => (
                        <Badge key={index} color="info" size="sm">
                          {tech}
                        </Badge>
                      ))}
                      {task.tech_stack.length > 3 && (
                        <Badge color="light" size="sm">
                          +{task.tech_stack.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Created Date */}
                  <div className="flex items-center gap-2 text-sm">
                    <ClockIcon className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Created {formatDate(task.created_at)}
                    </span>
                  </div>

                  {/* Creator/Assignee Info */}
                  <div className="flex items-center gap-2 text-sm">
                    <UserIcon className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {task.creator.id === user?.id
                        ? "You created this task"
                        : `Created by ${
                            task.creator.name || task.creator.email
                          }`}
                    </span>
                  </div>

                  {task.primary_assignee && (
                    <div className="flex items-center gap-2 text-sm">
                      <UserIcon className="w-4 h-4 text-blue-500" />
                      <span className="text-blue-600 dark:text-blue-400">
                        {task.primary_assignee.id === user?.id
                          ? "Assigned to you"
                          : `Assigned to ${
                              task.primary_assignee.name ||
                              task.primary_assignee.email
                            }`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserTasksView;
