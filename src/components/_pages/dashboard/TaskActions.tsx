"use client";

import { useTaskStateMachine } from "@/lib/hooks/useTaskStateMachine";
import type { Task, TaskStatus } from "@/lib/db/api/types";
import type { User } from "@/lib/db/api/types";

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

type TaskActionsProps = {
  task: TaskWithRelations;
  user: User | null;
  onAction: (action: string, taskId: string) => void;
};

export const TaskActions = ({ task, user, onAction }: TaskActionsProps) => {
  if (!user) return null;

  const isAssignee = task.primary_assignee?.id === user.id;
  const userRole = user.role;

  const { availableActions, validTransitions } = useTaskStateMachine(
    task.status as TaskStatus,
    userRole,
    isAssignee
  );

  if (availableActions.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {availableActions.map((action) => (
        <button
          key={action}
          onClick={() => onAction(action, task.id)}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors border border-gray-200 ${
            action === "claim"
              ? "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
              : action === "deliver"
              ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
              : action === "complete"
              ? "bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/30"
              : action === "dispute"
              ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:hover:bg-gray-900/30"
          }`}
        >
          {action === "claim" && "Claim Task"}
          {action === "deliver" && "Deliver Work"}
          {action === "complete" && "Accept Delivery"}
          {action === "dispute" && "Dispute Delivery"}
          {action === "cancel" && "Cancel Task"}
          {action === "resolve_for_coder" && "Resolve for Coder"}
          {action === "resolve_for_viber" && "Resolve for Viber"}
        </button>
      ))}
    </div>
  );
};
