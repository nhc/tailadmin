"use client";

import { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import type { Task, TaskStatus, User, TaskWithRelations, TaskGroup } from "@/lib/db/api/types";
import Badge from "@/components/ui/badge/Badge";
import { ClockIcon, DollarSignIcon, UserIcon, TagIcon, InfoIcon } from "lucide-react";
import { useTaskStateMachine } from "@/lib/hooks/useTaskStateMachine";

import { TaskActions } from "./TaskActions";

// Task Status Message Component
const TaskStatusMessage = ({
  task,
  user,
  isViber,
  isCoder,
  onTaskUpdated,
}: {
  task: TaskWithRelations;
  user: any;
  isViber: boolean;
  isCoder: boolean;
  onTaskUpdated?: (updatedTask: Task) => void;
}) => {
  const isAssignee = task.primary_assignee?.id === user?.id && task.creator.id !== user?.id;

  const userRole = isViber ? "viber" : "coder";

  // Find the relevant claim for this task
  let userClaim;
  let claimStatus;

  if (isViber) {
    // For Viber users, find any pending claim on their task
    userClaim = task.claims?.find((claim) => claim.status === "pending");
    claimStatus = userClaim?.status;
  } else {
    // For Coder users, find their own claim
    userClaim = task.claims?.find((claim) => claim.coder.id === user?.id);
    claimStatus = userClaim?.status;
  }

  const { statusMessage } = useTaskStateMachine(
    task.status as TaskStatus,
    userRole,
    isAssignee,
    claimStatus
  );

  const handleAction = (action: string, taskId: string) => {
    console.log(`Action ${action} performed on task ${taskId}`);
  };

  return (
    <>
      <div className="flex items-center gap-2 text-sm font-semibold bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
        <UserIcon className="w-4 h-4 text-gray-500" />
        <span className="text-gray-600 dark:text-gray-400">{statusMessage}</span>
      </div>
      <div></div>
      <div className="flex flex-row items-center justify-center gap-2">
        <TaskActions
          task={task}
          user={user}
          onAction={handleAction}
          onTaskUpdated={onTaskUpdated}
        />
      </div>
    </>
  );
};

export const UserTasksView = ({
  user,
  taskType,
  initialTasks,
}: {
  user: User;
  taskType: TaskStatus;
  initialTasks?: TaskWithRelations[] | null;
}) => {
  const { isViber, isCoder } = useUserContext();
  const [tasks, setTasks] = useState<TaskWithRelations[]>(initialTasks || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? { ...task, ...updatedTask } : task))
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "success";
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

  const getStatusDescription = (status: string, userRole: string) => {
    if (userRole === "viber") {
      switch (status) {
        case "open":
          return "Tasks that are open and have not yet been claimed by a coder";
        case "claimed":
          return "Tasks that have been claimed by a coder";
        case "delivered":
          return "Tasks that have been delivered by a coder";
        case "completed":
          return "Tasks that have been completed by a coder";
        case "disputed":
          return "Tasks that have been disputed by a coder";
        case "cancelled":
          return "Tasks that have been cancelled by a coder";
        default:
          return "Status not known";
      }
    }

    if (userRole === "coder") {
      switch (status) {
        case "claimed":
          return "Tasks that have been claimed by you, but you have not started";
        default:
          return "Status not known";
      }
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
          Your {getStatusTitle(taskType)} Tasks
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-xl animate-pulse dark:bg-gray-700" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Your Tasks</h2>
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
          Your {getStatusTitle(taskType)} Tasks
        </h2>
        <div className="p-8 text-center bg-gray-50 rounded-xl dark:bg-gray-800">
          <p className="text-gray-500 dark:text-gray-400">
            You don't have any <span className="lowercase">{getStatusTitle(taskType)}</span> tasks
            yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Your {getStatusTitle(taskType)} Tasks
        </h2>
        <div className="flex items-center gap-2">
          <InfoIcon size={20} className="" />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {getStatusDescription(taskType, user.role)}
          </span>
        </div>
      </div>

      {taskGroups.map((group) => (
        <div key={group.status} className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge color={group.color as any}>{group.title}</Badge>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {group.tasks.length} task{group.tasks.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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
                    <span className="font-medium text-green-600">{formatPrice(task.price)}</span>
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
                        : `Created by ${task.creator.name || task.creator.email}`}
                    </span>
                  </div>

                  {/* Assignment Status - Using state machine for consistent messaging */}
                  <TaskStatusMessage
                    task={task}
                    user={user}
                    isViber={isViber}
                    isCoder={isCoder}
                    onTaskUpdated={handleTaskUpdated}
                  />
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
