import type { SupabaseClient } from "@supabase/supabase-js";
import type { Task, InsertTask, UpdateTask, TaskStatus } from "./types";

export const tasksApi = {
  // Get task by ID
  getById: async (supabase: SupabaseClient, id: string) => {
    const { data, error } = await supabase
      .from("tasks")
      .select(
        `
        *,
        creator:users!tasks_creator_id_fkey(id, name, email, avatar_url, nickname),
        primary_assignee:users!tasks_primary_assignee_id_fkey(id, name, email, avatar_url, nickname)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Task & {
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
    };
  },

  // Get all tasks with filters
  getAll: async (
    supabase: SupabaseClient,
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
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase.from("tasks").select(
      `
        *,
        creator:users!tasks_creator_id_fkey(id, name, email, avatar_url, nickname),
        primary_assignee:users!tasks_primary_assignee_id_fkey(id, name, email, avatar_url, nickname)
      `,
      { count: "exact" }
    );

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }
    if (filters?.category) {
      query = query.eq("category", filters.category);
    }
    if (filters?.techStack && filters.techStack.length > 0) {
      query = query.overlaps("tech_stack", filters.techStack);
    }
    if (filters?.creatorId) {
      query = query.eq("creator_id", filters.creatorId);
    }
    if (filters?.assigneeId) {
      query = query.eq("primary_assignee_id", filters.assigneeId);
    }
    if (filters?.isPrivate !== undefined) {
      query = query.eq("is_private", filters.isPrivate);
    }
    if (filters?.minPrice) {
      query = query.gte("price", filters.minPrice);
    }
    if (filters?.maxPrice) {
      query = query.lte("price", filters.maxPrice);
    }

    const { data, error, count } = await query
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return {
      data: data as (Task & {
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
      })[],
      count,
    };
  },

  // Get tasks by creator
  getByCreator: async (supabase: SupabaseClient, creatorId: string, page = 1, limit = 50) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("tasks")
      .select(
        `
        *,
        creator:users!tasks_creator_id_fkey(id, name, email, avatar_url, nickname),
        primary_assignee:users!tasks_primary_assignee_id_fkey(id, name, email, avatar_url, nickname)
      `,
        { count: "exact" }
      )
      .eq("creator_id", creatorId)
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) throw error;
    const output = {
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
      })[],
      count,
    };
    // console.log("getByCreator output", output);
    return output;
  },

  // Get tasks by creator and status
  getByCreatorAndStatus: async (
    supabase: SupabaseClient,
    creatorId: string,
    status: TaskStatus,
    page = 1,
    limit = 50
  ) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("tasks")
      .select(
        `
        *,
        creator:users!tasks_creator_id_fkey(id, name, email, avatar_url, nickname),
        primary_assignee:users!tasks_primary_assignee_id_fkey(id, name, email, avatar_url, nickname)
      `,
        { count: "exact" }
      )
      .eq("creator_id", creatorId)
      .eq("status", status)
      .range(from, to)
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
      })[],
      count,
    };
  },

  // Get tasks by assignee
  getByAssignee: async (supabase: SupabaseClient, assigneeId: string, page = 1, limit = 50) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("tasks")
      .select(
        `
        *,
        creator:users!tasks_creator_id_fkey(id, name, email, avatar_url, nickname),
        primary_assignee:users!tasks_primary_assignee_id_fkey(id, name, email, avatar_url, nickname)
      `,
        { count: "exact" }
      )
      .eq("primary_assignee_id", assigneeId)
      .range(from, to)
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
      })[],
      count,
    };
  },

  // Get tasks by status
  getByStatus: async (supabase: SupabaseClient, status: TaskStatus, page = 1, limit = 50) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("tasks")
      .select(
        `
        *,
        creator:users!tasks_creator_id_fkey(id, name, email, avatar_url, nickname),
        primary_assignee:users!tasks_primary_assignee_id_fkey(id, name, email, avatar_url, nickname)
      `,
        { count: "exact" }
      )
      .eq("status", status)
      .range(from, to)
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
      })[],
      count,
    };
  },

  // Get tasks by status and user ID
  getByStatusWithUserId: async (
    supabase: SupabaseClient,
    status: TaskStatus,
    userId: string,
    page = 1,
    limit = 50
  ) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("tasks")
      .select(
        `
        *,
        creator:users!tasks_creator_id_fkey(id, name, email, avatar_url, nickname),
        primary_assignee:users!tasks_primary_assignee_id_fkey(id, name, email, avatar_url, nickname)
      `,
        { count: "exact" }
      )
      .eq("status", status)
      .or(`creator_id.eq.${userId},primary_assignee_id.eq.${userId}`)
      .range(from, to)
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
      })[],
      count,
    };
  },

  // Create new task
  create: async (supabase: SupabaseClient, task: InsertTask) => {
    const { data, error } = await supabase.from("tasks").insert(task).select().single();

    if (error) throw error;
    return data as Task;
  },

  // Update task
  update: async (supabase: SupabaseClient, id: string, updates: UpdateTask) => {
    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  },

  // Delete task
  delete: async (supabase: SupabaseClient, id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) throw error;
    return true;
  },

  // Update task status
  updateStatus: async (supabase: SupabaseClient, id: string, status: TaskStatus) => {
    const statusTimestamps = { [status]: new Date().toISOString() };

    const { data, error } = await supabase
      .from("tasks")
      .update({
        status,
        status_timestamps: statusTimestamps,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  },

  // Assign task to user
  assign: async (supabase: SupabaseClient, id: string, assigneeId: string) => {
    const { data, error } = await supabase
      .from("tasks")
      .update({
        primary_assignee_id: assigneeId,
        status: "claimed" as TaskStatus,
        status_timestamps: { claimed: new Date().toISOString() },
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  },

  // Search tasks by title or description
  search: async (supabase: SupabaseClient, query: string, limit = 10) => {
    const { data, error } = await supabase
      .from("tasks")
      .select(
        `
        *,
        creator:users!tasks_creator_id_fkey(id, name, email, avatar_url, nickname),
        primary_assignee:users!tasks_primary_assignee_id_fkey(id, name, email, avatar_url, nickname)
      `
      )
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(limit)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as (Task & {
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
    })[];
  },

  // Get task summary for a user (total tasks and claimed tasks)
  getSummary: async (supabase: SupabaseClient, userId: string) => {
    // Get total tasks created by user
    const { count: totalTasks, error: totalError } = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("creator_id", userId);

    if (totalError) throw totalError;

    // Get claimed tasks (tasks assigned to user)
    const { count: claimedTasks, error: claimedError } = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("primary_assignee_id", userId);

    if (claimedError) throw claimedError;

    return {
      totalTasks: totalTasks || 0,
      claimedTasks: claimedTasks || 0,
    };
  },

  // Get detailed task summary by status for a user
  getDetailedSummary: async (supabase: SupabaseClient, userId: string) => {
    // Get tasks created by user with status breakdown
    const { data: createdTasks, error: createdError } = await supabase
      .from("tasks")
      .select("status")
      .eq("creator_id", userId);

    if (createdError) throw createdError;

    // Get tasks assigned to user with status breakdown
    const { data: assignedTasks, error: assignedError } = await supabase
      .from("tasks")
      .select("status")
      .eq("primary_assignee_id", userId);

    if (assignedError) throw assignedError;

    // Count tasks by status for created tasks
    const createdByStatus = createdTasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Count tasks by status for assigned tasks
    const assignedByStatus = assignedTasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      created: createdByStatus,
      assigned: assignedByStatus,
      totalCreated: createdTasks.length,
      totalAssigned: assignedTasks.length,
    };
  },
};
