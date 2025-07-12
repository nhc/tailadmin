import type { TaskStatus, UserRole } from "@/lib/db/api/types";

export type TaskState = TaskStatus;

export type TaskTransition = {
  from: TaskState;
  to: TaskState;
  allowedRoles: UserRole[];
  requiresApproval?: boolean;
  description: string;
  action: string;
};

export type TaskStateConfig = {
  state: TaskState;
  title: string;
  description: string;
  color: "success" | "warning" | "primary" | "error" | "light";
  canBeAssigned: boolean;
  canBeClaimed: boolean;
  canBeDelivered: boolean;
  canBeCompleted: boolean;
  canBeDisputed: boolean;
  canBeCancelled: boolean;
};

// State configurations
export const TASK_STATES: Record<TaskState, TaskStateConfig> = {
  open: {
    state: "open",
    title: "Open",
    description: "Task is available for coders to claim",
    color: "success",
    canBeAssigned: false,
    canBeClaimed: true,
    canBeDelivered: false,
    canBeCompleted: false,
    canBeDisputed: false,
    canBeCancelled: true,
  },
  claimed: {
    state: "claimed",
    title: "Claimed",
    description: "Task has been claimed by a coder and is in progress",
    color: "warning",
    canBeAssigned: true,
    canBeClaimed: false,
    canBeDelivered: true,
    canBeCompleted: false,
    canBeDisputed: false,
    canBeCancelled: true,
  },
  delivered: {
    state: "delivered",
    title: "Delivered",
    description: "Coder has delivered the work and is waiting for viber review",
    color: "primary",
    canBeAssigned: true,
    canBeClaimed: false,
    canBeDelivered: false,
    canBeCompleted: true,
    canBeDisputed: true,
    canBeCancelled: false,
  },
  completed: {
    state: "completed",
    title: "Completed",
    description: "Task has been completed and payment released",
    color: "success",
    canBeAssigned: true,
    canBeClaimed: false,
    canBeDelivered: false,
    canBeCompleted: false,
    canBeDisputed: false,
    canBeCancelled: false,
  },
  disputed: {
    state: "disputed",
    title: "Disputed",
    description: "Task delivery has been disputed and requires resolution",
    color: "error",
    canBeAssigned: true,
    canBeClaimed: false,
    canBeDelivered: false,
    canBeCompleted: false,
    canBeDisputed: false,
    canBeCancelled: false,
  },
  cancelled: {
    state: "cancelled",
    title: "Cancelled",
    description: "Task has been cancelled",
    color: "light",
    canBeAssigned: false,
    canBeClaimed: false,
    canBeDelivered: false,
    canBeCompleted: false,
    canBeDisputed: false,
    canBeCancelled: false,
  },
};

// Valid transitions
export const TASK_TRANSITIONS: TaskTransition[] = [
  {
    from: "open",
    to: "claimed",
    allowedRoles: ["coder", "admin", "superuser"],
    description: "Coder claims the task",
    action: "claim",
  },
  {
    from: "open",
    to: "cancelled",
    allowedRoles: ["viber", "admin", "superuser"],
    description: "Viber cancels the task",
    action: "cancel",
  },
  {
    from: "claimed",
    to: "delivered",
    allowedRoles: ["coder", "admin", "superuser"],
    description: "Coder delivers the work",
    action: "deliver",
  },
  {
    from: "claimed",
    to: "cancelled",
    allowedRoles: ["viber", "coder", "admin", "superuser"],
    description: "Task is cancelled",
    action: "cancel",
  },
  {
    from: "delivered",
    to: "completed",
    allowedRoles: ["viber", "admin", "superuser"],
    requiresApproval: true,
    description: "Viber accepts the delivery",
    action: "complete",
  },
  {
    from: "delivered",
    to: "disputed",
    allowedRoles: ["viber", "admin", "superuser"],
    description: "Viber disputes the delivery",
    action: "dispute",
  },
  {
    from: "disputed",
    to: "completed",
    allowedRoles: ["viber", "admin", "superuser"],
    requiresApproval: true,
    description: "Dispute resolved in favor of coder",
    action: "resolve_for_coder",
  },
  {
    from: "disputed",
    to: "cancelled",
    allowedRoles: ["viber", "admin", "superuser"],
    description: "Dispute resolved in favor of viber",
    action: "resolve_for_viber",
  },
];

// State machine class
export class TaskStateMachine {
  private currentState: TaskState;

  constructor(initialState: TaskState = "open") {
    this.currentState = initialState;
  }

  getCurrentState(): TaskState {
    return this.currentState;
  }

  getStateConfig(): TaskStateConfig {
    return TASK_STATES[this.currentState];
  }

  canTransitionTo(newState: TaskState, userRole: UserRole): boolean {
    const transition = TASK_TRANSITIONS.find(
      (t) => t.from === this.currentState && t.to === newState
    );

    if (!transition) {
      return false;
    }

    return transition.allowedRoles.includes(userRole);
  }

  getValidTransitions(userRole: UserRole): TaskTransition[] {
    return TASK_TRANSITIONS.filter(
      (t) => t.from === this.currentState && t.allowedRoles.includes(userRole)
    );
  }

  transitionTo(newState: TaskState, userRole: UserRole): boolean {
    if (!this.canTransitionTo(newState, userRole)) {
      return false;
    }

    this.currentState = newState;
    return true;
  }

  // Helper methods for common operations
  canBeClaimed(): boolean {
    return TASK_STATES[this.currentState].canBeClaimed;
  }

  canBeDelivered(): boolean {
    return TASK_STATES[this.currentState].canBeDelivered;
  }

  canBeCompleted(): boolean {
    return TASK_STATES[this.currentState].canBeCompleted;
  }

  canBeDisputed(): boolean {
    return TASK_STATES[this.currentState].canBeDisputed;
  }

  canBeCancelled(): boolean {
    return TASK_STATES[this.currentState].canBeCancelled;
  }

  isAssigned(): boolean {
    return this.currentState !== "open";
  }

  isCompleted(): boolean {
    return this.currentState === "completed";
  }

  isDisputed(): boolean {
    return this.currentState === "disputed";
  }

  isCancelled(): boolean {
    return this.currentState === "cancelled";
  }

  // Get user-friendly messages based on state and role
  getStatusMessage(userRole: UserRole, isAssignee: boolean = false): string {
    const stateConfig = TASK_STATES[this.currentState];

    switch (this.currentState) {
      case "open":
        return userRole === "viber"
          ? "Waiting for coders to claim"
          : "Available to claim";

      case "claimed":
        if (isAssignee) {
          return "You are working on this task";
        }
        return userRole === "viber"
          ? "Task claimed by a coder"
          : "Task is in progress";

      case "delivered":
        if (userRole === "viber") {
          return "Review the delivery";
        }
        return isAssignee
          ? "Waiting for viber review"
          : "Task has been delivered";

      case "completed":
        return "Task completed successfully";

      case "disputed":
        return "Task delivery disputed";

      case "cancelled":
        return "Task has been cancelled";

      default:
        return stateConfig.description;
    }
  }

  // Get action buttons that should be shown
  getAvailableActions(
    userRole: UserRole,
    isAssignee: boolean = false
  ): string[] {
    const actions: string[] = [];

    // Admin users can perform all actions
    if (userRole === "admin" || userRole === "superuser") {
      if (this.canBeClaimed()) {
        actions.push("claim");
      }
      if (this.canBeDelivered()) {
        actions.push("deliver");
      }
      if (this.canBeCompleted()) {
        actions.push("complete");
      }
      if (this.canBeDisputed()) {
        actions.push("dispute");
      }
      if (this.canBeCancelled()) {
        actions.push("cancel");
      }
      // Admin can resolve disputes
      if (this.currentState === "disputed") {
        actions.push("resolve_for_coder");
        actions.push("resolve_for_viber");
      }
      return actions;
    }

    // Regular user role-based permissions
    if (this.canBeClaimed() && userRole === "coder") {
      actions.push("claim");
    }

    if (this.canBeDelivered() && userRole === "coder" && isAssignee) {
      actions.push("deliver");
    }

    if (this.canBeCompleted() && userRole === "viber") {
      actions.push("complete");
    }

    if (this.canBeDisputed() && userRole === "viber") {
      actions.push("dispute");
    }

    if (this.canBeCancelled()) {
      if (userRole === "viber") {
        actions.push("cancel");
      } else if (userRole === "coder" && isAssignee) {
        actions.push("cancel");
      }
    }

    return actions;
  }
}

// Utility functions
export const createTaskStateMachine = (initialState: TaskState = "open") => {
  return new TaskStateMachine(initialState);
};

export const getTaskStateConfig = (state: TaskState): TaskStateConfig => {
  return TASK_STATES[state];
};

export const getValidTransitions = (
  fromState: TaskState,
  userRole: UserRole
): TaskTransition[] => {
  return TASK_TRANSITIONS.filter(
    (t) => t.from === fromState && t.allowedRoles.includes(userRole)
  );
};
