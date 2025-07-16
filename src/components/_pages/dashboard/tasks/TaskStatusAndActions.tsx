import { Task, TaskStatus, TaskWithRelations, User } from "@/lib/db/api/types";
import { useTaskStateMachine } from "@/lib/hooks/useTaskStateMachine";
import { UserIcon, MessageSquareIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { TaskActions } from "./TaskActions";
import { useState } from "react";
import { formatDate } from "@/lib/utils/date-numbers";
import Badge from "@/components/ui/badge/Badge";

// Task Status Message Component
export const TaskStatusAndActions = ({
  task,
  user,
  isViber,
  isCoder,
  context,
  onTaskUpdated,
}: {
  task: TaskWithRelations;
  user: User;
  isViber: boolean;
  isCoder: boolean;
  context: "dashboard" | "view"; // dashboard is for the user tasks view, view is for the task view page
  onTaskUpdated?: (updatedTask: Task) => void;
}) => {
  const [showMessage, setShowMessage] = useState(false);
  const router = useRouter();
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

  // Get coder information for status messages
  const coderInfo = task.primary_assignee
    ? {
        nickname: task.primary_assignee.nickname || null,
        name: task.primary_assignee.name || null,
      }
    : undefined;

  const { statusMessage } = useTaskStateMachine(
    task.status as TaskStatus,
    userRole,
    isAssignee,
    claimStatus,
    coderInfo
  );

  const handleAction = (action: string, taskId: string) => {
    console.log(`Action ${action} performed on task ${taskId}`);
  };

  // Get badge color for claim status
  const getClaimStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "approved":
        return "success";
      case "rejected":
        return "error";
      default:
        return "info";
    }
  };

  return (
    <>
      {showMessage && (
        <div className="flex items-center gap-2 text-sm font-semibold bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
          <UserIcon className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600 dark:text-gray-400">{statusMessage}</span>
        </div>
      )}

      {/* Claims Status Section */}
      {task.claims && task.claims.length > 0 && (
        <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Claims Status
          </h3>
          <div className="space-y-4">
            {task.claims.map((claim) => (
              <div
                key={claim.id}
                className="flex items-start justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <MessageSquareIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800 dark:text-white">
                        {claim.coder.nickname || claim.coder.name || "Anonymous"}
                      </span>
                      <Badge color={getClaimStatusColor(claim.status)} size="sm">
                        {claim.status}
                      </Badge>
                    </div>
                  </div>
                  {claim.message && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{claim.message}</p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Submitted {formatDate(claim.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Task Actions Section */}
      <div>
        <div className="flex flex-row items-start justify-start gap-2">
          <TaskActions
            task={task}
            user={user}
            onAction={handleAction}
            onTaskUpdated={onTaskUpdated}
          />
        </div>
      </div>
    </>
  );
};
