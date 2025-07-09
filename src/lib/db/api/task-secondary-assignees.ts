import { SupabaseClient } from "@supabase/supabase-js";
import type {
  TaskSecondaryAssignee,
  InsertTaskSecondaryAssignee,
} from "./types";

export const taskSecondaryAssigneesApi = {
  // Get secondary assignee by ID
  getById: async (supabase: SupabaseClient, id: string) => {
    const { data, error } = await supabase
      .from("task_secondary_assignees")
      .select(
        `
        *,
        task:tasks!task_secondary_assignees_task_id_fkey(id, title, description),
        user:users!task_secondary_assignees_user_id_fkey(id, name, email, avatar_url)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as TaskSecondaryAssignee & {
      task: { id: string; title: string; description: string };
      user: {
        id: string;
        name: string | null;
        email: string;
        avatar_url: string | null;
      };
    };
  },

  // Get secondary assignees by task
  getByTask: async (supabase: SupabaseClient, taskId: string) => {
    const { data, error } = await supabase
      .from("task_secondary_assignees")
      .select(
        `
        *,
        user:users!task_secondary_assignees_user_id_fkey(id, name, email, avatar_url, bio)
      `
      )
      .eq("task_id", taskId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as (TaskSecondaryAssignee & {
      user: {
        id: string;
        name: string | null;
        email: string;
        avatar_url: string | null;
        bio: string | null;
      };
    })[];
  },

  // Get secondary assignments by user
  getByUser: async (
    supabase: SupabaseClient,
    userId: string,
    page = 1,
    limit = 50
  ) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("task_secondary_assignees")
      .select(
        `
        *,
        task:tasks!task_secondary_assignees_task_id_fkey(id, title, description, status, creator_id)
      `,
        { count: "exact" }
      )
      .eq("user_id", userId)
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return {
      data: data as (TaskSecondaryAssignee & {
        task: {
          id: string;
          title: string;
          description: string;
          status: string;
          creator_id: string;
        };
      })[],
      count,
    };
  },

  // Create new secondary assignee
  create: async (
    supabase: SupabaseClient,
    assignment: InsertTaskSecondaryAssignee
  ) => {
    const { data, error } = await supabase
      .from("task_secondary_assignees")
      .insert(assignment)
      .select()
      .single();

    if (error) throw error;
    return data as TaskSecondaryAssignee;
  },

  // Delete secondary assignee
  delete: async (supabase: SupabaseClient, id: string) => {
    const { error } = await supabase
      .from("task_secondary_assignees")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  },

  // Remove user from task (by task and user IDs)
  removeUserFromTask: async (
    supabase: SupabaseClient,
    taskId: string,
    userId: string
  ) => {
    const { error } = await supabase
      .from("task_secondary_assignees")
      .delete()
      .eq("task_id", taskId)
      .eq("user_id", userId);

    if (error) throw error;
    return true;
  },

  // Add user to task
  addUserToTask: async (
    supabase: SupabaseClient,
    taskId: string,
    userId: string
  ) => {
    const assignment: InsertTaskSecondaryAssignee = {
      task_id: taskId,
      user_id: userId,
    };

    return taskSecondaryAssigneesApi.create(supabase, assignment);
  },

  // Check if user is secondary assignee for task
  isUserSecondaryAssignee: async (
    supabase: SupabaseClient,
    taskId: string,
    userId: string
  ) => {
    const { data, error } = await supabase
      .from("task_secondary_assignees")
      .select("id")
      .eq("task_id", taskId)
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") throw error; // PGRST116 is "not found"
    return !!data;
  },

  // Get secondary assignee count for a task
  getCountByTask: async (supabase: SupabaseClient, taskId: string) => {
    const { count, error } = await supabase
      .from("task_secondary_assignees")
      .select("*", { count: "exact", head: true })
      .eq("task_id", taskId);

    if (error) throw error;
    return count || 0;
  },

  // Get all secondary assignments for a user
  getAllByUser: async (supabase: SupabaseClient, userId: string) => {
    const { data, error } = await supabase
      .from("task_secondary_assignees")
      .select(
        `
        *,
        task:tasks!task_secondary_assignees_task_id_fkey(id, title, description, status)
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as (TaskSecondaryAssignee & {
      task: { id: string; title: string; description: string; status: string };
    })[];
  },
};
