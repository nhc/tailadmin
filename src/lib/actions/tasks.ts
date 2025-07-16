"use server";

import { createClient } from "@/lib/supabase/server";
import { tasksApi } from "@/lib/db/api/tasks";
import type { InsertTask, UpdateTask, TaskStatus, Task, ClaimStatus } from "@/lib/db/api/types";

export const getTasksByCreator = async (creatorId: string) => {
  if (!creatorId) {
    throw new Error("creatorId is required");
  }

  try {
    const supabase = await createClient();
    return await tasksApi.getByCreator(supabase, creatorId);
  } catch (error) {
    console.error("Failed to get tasks by creator:", error);
    throw new Error("Failed to get tasks by creator");
  }
};

export const getByCreatorAndStatus = async (creatorId: string, status: TaskStatus) => {
  if (!creatorId) {
    throw new Error("creatorId is required");
  }

  try {
    const supabase = await createClient();

    // Get tasks with claims data included
    const { data, error, count } = await supabase
      .from("tasks")
      .select(
        `
        *,
        creator:users!tasks_creator_id_fkey(id, name, email, avatar_url, nickname),
        primary_assignee:users!tasks_primary_assignee_id_fkey(id, name, email, avatar_url, nickname),
        claims(
          id,
          message,
          status,
          created_at,
          coder:users!claims_coder_id_fkey(id, name, email, avatar_url, nickname)
        )
      `
      )
      .eq("creator_id", creatorId)
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return {
      data: data as (Task & {
        creator: {
          id: string;
          name: string | null;
          email: string;
          avatar_url: string | null;
          nickname: string | null;
        };
        primary_assignee: {
          id: string;
          name: string | null;
          email: string;
          avatar_url: string | null;
          nickname: string | null;
        } | null;
        claims: {
          id: string;
          message: string | null;
          status: ClaimStatus;
          created_at: string;
          coder: {
            id: string;
            name: string | null;
            email: string;
            avatar_url: string | null;
            nickname: string | null;
          };
        }[];
      })[],
      count,
    };
  } catch (error) {
    console.error("Failed to get tasks by creator and status:", error);
    throw new Error("Failed to get tasks by creator and status");
  }
};

export const getTaskById = async (id: string) => {
  try {
    const supabase = await createClient();
    return await tasksApi.getById(supabase, id);
  } catch (error) {
    console.error("Failed to get task:", error);
    throw new Error("Failed to get task");
  }
};

export const getAllTasks = async (
  filters?: {
    status?: TaskStatus;
    category?: string;
    techStack?: string[];
    creatorId?: string;
    assigneeId?: string;
    isPrivate?: boolean;
    minPrice?: number;
    maxPrice?: number;
  },
  page = 1,
  limit = 50
) => {
  try {
    const supabase = await createClient();
    return await tasksApi.getAll(supabase, filters, page, limit);
  } catch (error) {
    console.error("Failed to get tasks:", error);
    throw new Error("Failed to get tasks");
  }
};

export const createTask = async (task: InsertTask) => {
  try {
    const supabase = await createClient();

    // Get the current session
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();

    if (authError || !session?.user) {
      throw new Error("Not authenticated");
    }

    // Ensure the creator_id matches the authenticated user
    const taskWithCreator = {
      ...task,
      creator_id: session.user.id,
    };

    return await tasksApi.create(supabase, taskWithCreator);
  } catch (error) {
    console.error("Failed to create task:", error);
    throw new Error("Failed to create task");
  }
};

export const updateTask = async (id: string, updates: UpdateTask) => {
  try {
    const supabase = await createClient();

    // Get the current session
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();

    if (authError || !session?.user) {
      throw new Error("Not authenticated");
    }

    // Optional: Add authorization check here
    const task = await tasksApi.getById(supabase, id);
    if (task.creator_id !== session.user.id) {
      throw new Error("Not authorized to update this task");
    }

    return await tasksApi.update(supabase, id, updates);
  } catch (error) {
    console.error("Failed to update task:", error);
    throw new Error("Failed to update task");
  }
};

export const deleteTask = async (id: string) => {
  try {
    const supabase = await createClient();

    // Get the current session
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();

    if (authError || !session?.user) {
      throw new Error("Not authenticated");
    }

    // Optional: Add authorization check here
    const task = await tasksApi.getById(supabase, id);
    if (task.creator_id !== session.user.id) {
      throw new Error("Not authorized to delete this task");
    }

    return await tasksApi.delete(supabase, id);
  } catch (error) {
    console.error("Failed to delete task:", error);
    throw new Error("Failed to delete task");
  }
};

export const updateTaskStatus = async (id: string, status: TaskStatus) => {
  try {
    const supabase = await createClient();
    return await tasksApi.updateStatus(supabase, id, status);
  } catch (error) {
    console.error("Failed to update task status:", error);
    throw new Error("Failed to update task status");
  }
};

export const assignTask = async (id: string, assigneeId: string) => {
  try {
    const supabase = await createClient();
    return await tasksApi.assign(supabase, id, assigneeId);
  } catch (error) {
    console.error("Failed to assign task:", error);
    throw new Error("Failed to assign task");
  }
};

export const searchTasks = async (query: string, limit = 10) => {
  try {
    const supabase = await createClient();
    return await tasksApi.search(supabase, query, limit);
  } catch (error) {
    console.error("Failed to search tasks:", error);
    throw new Error("Failed to search tasks");
  }
};

export const getTaskSummary = async (userId: string) => {
  try {
    const supabase = await createClient();
    return await tasksApi.getSummary(supabase, userId);
  } catch (error) {
    console.error("Failed to get task summary:", error);
    throw new Error("Failed to get task summary");
  }
};

// Task transition actions
export const transitionTask = async (
  taskId: string,
  action: string,
  metadata?: Record<string, unknown>
) => {
  try {
    const supabase = await createClient();

    // Get the current session
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();

    if (authError || !session?.user) {
      throw new Error("Not authenticated");
    }

    // Get current task
    const taskResult = await tasksApi.getById(supabase, taskId);
    if (!taskResult) {
      throw new Error("Task not found");
    }

    const task = taskResult;
    const currentStatus = task.status as TaskStatus;

    // Get user info
    const userResult = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (!userResult.data) {
      throw new Error("User not found");
    }

    const userRole = userResult.data.role;
    const isAssignee = task.primary_assignee_id === session.user.id;

    // Import state machine functions
    const { getValidTransitions } = await import("@/lib/state-machines/task-state-machine");

    // Get valid transitions for current state and user role
    const validTransitions = getValidTransitions(currentStatus, userRole);
    const transition = validTransitions.find((t) => t.action === action);

    if (!transition) {
      throw new Error(`Invalid transition: ${action} from ${currentStatus} for role ${userRole}`);
    }

    // Handle special case for claim action - also update assignee
    let updatedTask;
    if (action === "claim") {
      // For claim action, also assign the task to the user
      updatedTask = await tasksApi.assign(supabase, taskId, session.user.id);
    } else {
      // For other actions, just update status
      updatedTask = await tasksApi.updateStatus(supabase, taskId, transition.to);
    }

    // Create audit log entry
    const { auditTrailApi } = await import("@/lib/db/api");
    await auditTrailApi.logAction(
      supabase,
      `task_${transition.to}` as any,
      "task",
      taskId,
      session.user.id,
      {
        action,
        fromStatus: currentStatus,
        toStatus: transition.to,
        description: transition.description,
        ...metadata,
      }
    );

    return updatedTask;
  } catch (error) {
    console.error("Failed to transition task:", error);
    throw new Error("Failed to transition task");
  }
};

// Specific transition actions for better UX
export const claimTask = async (taskId: string, claimMessage?: string) => {
  try {
    const supabase = await createClient();

    // Get the current session
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();

    if (authError || !session?.user) {
      throw new Error("Not authenticated");
    }

    // Check if user has already claimed this task
    const { claimsApi } = await import("@/lib/db/api");
    const existingClaim = await claimsApi.hasUserClaimed(supabase, taskId, session.user.id);

    if (existingClaim) {
      throw new Error("You have already claimed this task");
    }

    // Create the claim record first
    const claim = await claimsApi.create(supabase, {
      task_id: taskId,
      coder_id: session.user.id,
      message: claimMessage || null,
      status: "pending",
    });

    // Then transition the task status
    const updatedTask = await transitionTask(taskId, "claim", {
      claimMessage,
      claimId: claim.id,
    });

    return updatedTask;
  } catch (error) {
    console.error("Failed to claim task:", error);
    throw error;
  }
};

export const startWorkOnTask = async (taskId: string) => {
  return transitionTask(taskId, "start_work");
};

export const deliverTask = async (taskId: string, deliveryNotes?: string) => {
  return transitionTask(taskId, "deliver", { deliveryNotes });
};

export const completeTask = async (taskId: string) => {
  return transitionTask(taskId, "complete");
};

export const disputeTask = async (taskId: string, disputeReason?: string) => {
  return transitionTask(taskId, "dispute", { disputeReason });
};

export const cancelTask = async (taskId: string, cancelReason?: string) => {
  return transitionTask(taskId, "cancel", { cancelReason });
};

export const resolveDisputeForCoder = async (taskId: string) => {
  return transitionTask(taskId, "resolve_for_coder");
};

export const resolveDisputeForViber = async (taskId: string) => {
  return transitionTask(taskId, "resolve_for_viber");
};

// Get claimed tasks for a coder by status
export const getClaimedTasksByStatus = async (coderId: string, status: TaskStatus) => {
  try {
    const supabase = await createClient();

    // Get tasks that are claimed by the coder with the specified status
    const { data, error, count } = await supabase
      .from("tasks")
      .select(
        `
        *,
        creator:users!tasks_creator_id_fkey(id, name, email, avatar_url, nickname),
        primary_assignee:users!tasks_primary_assignee_id_fkey(id, name, email, avatar_url, nickname),
        claims(
          id,
          message,
          status,
          created_at,
          coder:users!claims_coder_id_fkey(id, name, email, avatar_url, nickname)
        )
      `
      )
      .eq("status", status)
      .eq("primary_assignee_id", coderId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return {
      data: data as (Task & {
        creator: {
          id: string;
          name: string | null;
          email: string;
          avatar_url: string | null;
          nickname: string | null;
        };
        primary_assignee: {
          id: string;
          name: string | null;
          email: string;
          avatar_url: string | null;
          nickname: string | null;
        } | null;
        claims: {
          id: string;
          message: string | null;
          status: ClaimStatus;
          created_at: string;
          coder: {
            id: string;
            name: string | null;
            email: string;
            avatar_url: string | null;
            nickname: string | null;
          };
        }[];
      })[],
      count,
    };
  } catch (error) {
    console.error("Failed to get claimed tasks by status:", error);
    throw new Error("Failed to get claimed tasks by status");
  }
};

// Approve a claim
export const approveClaim = async (claimId: string) => {
  try {
    const supabase = await createClient();

    // Get the current session
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();

    if (authError || !session?.user) {
      throw new Error("Not authenticated");
    }

    // Get user info to check if they're a viber
    const userResult = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (!userResult.data || userResult.data.role !== "viber") {
      throw new Error("Only viber users can approve claims");
    }

    // Approve the claim
    const { claimsApi } = await import("@/lib/db/api");
    const approvedClaim = await claimsApi.approve(supabase, claimId);

    // Create audit log entry
    const { auditTrailApi } = await import("@/lib/db/api");
    await auditTrailApi.create(supabase, {
      user_id: session.user.id,
      action_type: "claim_approved",
      entity_type: "claim",
      entity_id: claimId,
      metadata: {
        claimId,
        approvedBy: session.user.id,
        approvedAt: new Date().toISOString(),
      },
    });

    return approvedClaim;
  } catch (error) {
    console.error("Failed to approve claim:", error);
    throw error;
  }
};

// Reject a claim
export const rejectClaim = async (claimId: string) => {
  try {
    const supabase = await createClient();

    // Get the current session
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();

    if (authError || !session?.user) {
      throw new Error("Not authenticated");
    }

    // Get user info to check if they're a viber
    const userResult = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (!userResult.data || userResult.data.role !== "viber") {
      throw new Error("Only viber users can reject claims");
    }

    // Reject the claim
    const { claimsApi } = await import("@/lib/db/api");
    const rejectedClaim = await claimsApi.reject(supabase, claimId);

    // Create audit log entry
    const { auditTrailApi } = await import("@/lib/db/api");
    await auditTrailApi.create(supabase, {
      user_id: session.user.id,
      action_type: "claim_rejected",
      entity_type: "claim",
      entity_id: claimId,
      metadata: {
        claimId,
        rejectedBy: session.user.id,
        rejectedAt: new Date().toISOString(),
      },
    });

    return rejectedClaim;
  } catch (error) {
    console.error("Failed to reject claim:", error);
    throw error;
  }
};
