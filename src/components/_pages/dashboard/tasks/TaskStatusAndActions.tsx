import { Task, TaskStatus, TaskWithRelations, User } from "@/lib/db/api/types";
import { useTaskStateMachine } from "@/lib/hooks/useTaskStateMachine";
import { UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { TaskActions } from "./TaskActions";
import { useState } from "react";

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

  return (
    <>
      {showMessage && (
        <div className="flex items-center gap-2 text-sm font-semibold bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
          <UserIcon className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600 dark:text-gray-400">{statusMessage}</span>
        </div>
      )}
      <div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={() => {
            router.push(`/dashboard/tasks/view/${task.id}`);
          }}
        >
          View Task
        </button>
      </div>
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
