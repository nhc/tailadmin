"use server";

import { createClient } from "@/lib/supabase/server";
import { tasksApi } from "@/lib/db/api/tasks";
import type { InsertTask, UpdateTask, TaskStatus } from "@/lib/db/api/types";

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
    return await tasksApi.getByCreatorAndStatus(supabase, creatorId, status);
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
