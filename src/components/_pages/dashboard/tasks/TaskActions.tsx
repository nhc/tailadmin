"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTaskStateMachine } from "@/lib/hooks/useTaskStateMachine";
import type { Task, TaskStatus, ClaimStatus } from "@/lib/db/api/types";
import type { User } from "@/lib/db/api/types";
import {
  claimTask,
  startWorkOnTask,
  deliverTask,
  completeTask,
  disputeTask,
  cancelTask,
  resolveDisputeForCoder,
  resolveDisputeForViber,
  approveClaim,
  rejectClaim,
} from "@/lib/actions/tasks";

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
  claims?: {
    id: string;
    message: string | null;
    status: ClaimStatus;
    created_at: string;
    coder: {
      id: string;
      name: string | null;
      email: string;
      avatar_url: string | null;
    };
  }[];
};

type TaskActionsProps = {
  task: TaskWithRelations;
  user: User | null;
  onAction: (action: string, taskId: string) => void;
  onTaskUpdated?: (updatedTask: Task) => void;
};

export const TaskActions = ({ task, user, onAction, onTaskUpdated }: TaskActionsProps) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  if (!user) return null;

  const isAssignee = task.primary_assignee?.id === user.id;
  const userRole = user.role;

  // Find the relevant claim for this task
  let userClaim;
  let claimStatus;

  if (userRole === "viber") {
    // For Viber users, find any pending claim on their task
    userClaim = task.claims?.find((claim) => claim.status === "pending");
    claimStatus = userClaim?.status;
  } else {
    // For Coder users, find their own claim
    userClaim = task.claims?.find((claim) => claim.coder.id === user.id);
    claimStatus = userClaim?.status;
  }

  const { availableActions, validTransitions } = useTaskStateMachine(
    task.status as TaskStatus,
    userRole,
    isAssignee,
    claimStatus
  );

  const handleAction = async (action: string, taskId: string) => {
    setLoadingAction(action);
    setError(null);

    try {
      let result;

      switch (action) {
        case "claim":
          result = await claimTask(taskId);
          break;
        case "start_work":
          result = await startWorkOnTask(taskId);
          break;
        case "deliver":
          result = await deliverTask(taskId);
          break;
        case "complete":
          result = await completeTask(taskId);
          break;
        case "dispute":
          result = await disputeTask(taskId);
          break;
        case "cancel":
          result = await cancelTask(taskId);
          break;
        case "resolve_for_coder":
          result = await resolveDisputeForCoder(taskId);
          break;
        case "resolve_for_viber":
          result = await resolveDisputeForViber(taskId);
          break;
        case "approve_claim":
          if (userClaim?.id) {
            result = await approveClaim(userClaim.id);
          }
          break;
        case "reject_claim":
          if (userClaim?.id) {
            result = await rejectClaim(userClaim.id);
          }
          break;
        default:
          throw new Error(`Unknown action: ${action}`);
      }

      // Call the parent callback
      onAction(action, taskId);

      // Call the optional callback with updated task (only for task actions, not claim actions)
      if (onTaskUpdated && result && "title" in result) {
        onTaskUpdated(result as Task);
      }
      router.refresh();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to perform action";
      setError(errorMessage);
      console.error("Task action failed:", err);
    } finally {
      setLoadingAction(null);
    }
  };
  console.log("TaskActions availableActions", availableActions);
  console.log("TaskActions validTransitions", validTransitions);
  if (availableActions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {error && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md p-2">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {availableActions.map((action) => (
          <button
            key={action}
            onClick={() => handleAction(action, task.id)}
            disabled={loadingAction === action}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              action === "claim"
                ? "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                : action === "deliver"
                ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
                : action === "complete"
                ? "bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/30"
                : action === "dispute"
                ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                : action === "approve_claim"
                ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
                : action === "reject_claim"
                ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:hover:bg-gray-900/30"
            }`}
          >
            {loadingAction === action ? (
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                Loading...
              </span>
            ) : action === "claim" ? (
              "Claim Task"
            ) : action === "start_work" ? (
              "Start Work"
            ) : action === "deliver" ? (
              "Deliver Work"
            ) : action === "complete" ? (
              "Accept Delivery"
            ) : action === "dispute" ? (
              "Dispute Delivery"
            ) : action === "cancel" ? (
              "Cancel Task"
            ) : action === "resolve_for_coder" ? (
              "Resolve for Coder"
            ) : action === "resolve_for_viber" ? (
              "Resolve for Viber"
            ) : action === "approve_claim" ? (
              "Approve Claim"
            ) : action === "reject_claim" ? (
              "Reject Claim"
            ) : (
              action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
