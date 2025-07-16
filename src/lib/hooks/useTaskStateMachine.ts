import { useMemo } from "react";
import {
  createTaskStateMachine,
  getTaskStateConfig,
} from "@/lib/state-machines/task-state-machine";
import type { TaskStatus, UserRole, ClaimStatus } from "@/lib/db/api/types";
import { useServerUser } from "./useServerUser";

export const useTaskStateMachine = (
  taskStatus: TaskStatus,
  userRole: UserRole,
  isAssignee: boolean = false,
  claimStatus?: ClaimStatus,
  coderInfo?: {
    nickname: string | null;
    name: string | null;
  }
) => {
  const stateMachine = useMemo(() => createTaskStateMachine(taskStatus), [taskStatus]);

  const stateConfig = useMemo(() => getTaskStateConfig(taskStatus), [taskStatus]);

  const statusMessage = useMemo(
    () => stateMachine.getStatusMessage(userRole, isAssignee, claimStatus, coderInfo),
    [stateMachine, userRole, isAssignee, claimStatus, coderInfo]
  );

  const availableActions = useMemo(
    () => stateMachine.getAvailableActions(userRole, isAssignee, claimStatus),
    [stateMachine, userRole, isAssignee, claimStatus]
  );

  const validTransitions = useMemo(
    () => stateMachine.getValidTransitions(userRole),
    [stateMachine, userRole]
  );

  return {
    stateMachine,
    stateConfig,
    statusMessage,
    availableActions,
    validTransitions,
    currentState: stateMachine.getCurrentState(),
    canTransitionTo: (newState: TaskStatus) => stateMachine.canTransitionTo(newState, userRole),
    isAssigned: stateMachine.isAssigned(userRole, isAssignee),
    isCompleted: stateMachine.isCompleted(),
    isDisputed: stateMachine.isDisputed(),
    isCancelled: stateMachine.isCancelled(),
  };
};
