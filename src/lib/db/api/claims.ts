import { SupabaseClient } from "@supabase/supabase-js";
import type { Claim, InsertClaim, UpdateClaim, ClaimStatus } from "./types";

export const claimsApi = {
  // Get claim by ID
  getById: async (supabase: SupabaseClient, id: string) => {
    const { data, error } = await supabase
      .from("claims")
      .select(
        `
        *,
        task:tasks!claims_task_id_fkey(id, title, description, price, status),
        coder:users!claims_coder_id_fkey(id, name, email, avatar_url)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Claim & {
      task: {
        id: string;
        title: string;
        description: string;
        price: number;
        status: string;
      };
      coder: {
        id: string;
        name: string | null;
        email: string;
        avatar_url: string | null;
      };
    };
  },

  // Get claims for a task
  getByTask: async (supabase: SupabaseClient, taskId: string) => {
    const { data, error } = await supabase
      .from("claims")
      .select(
        `
        *,
        coder:users!claims_coder_id_fkey(id, name, email, avatar_url, bio)
      `
      )
      .eq("task_id", taskId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as (Claim & {
      coder: {
        id: string;
        name: string | null;
        email: string;
        avatar_url: string | null;
        bio: string | null;
      };
    })[];
  },

  // Get claims by coder
  getByCoder: async (
    supabase: SupabaseClient,
    coderId: string,
    page = 1,
    limit = 50
  ) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("claims")
      .select(
        `
        *,
        task:tasks!claims_task_id_fkey(id, title, description, price, status, creator_id)
      `,
        { count: "exact" }
      )
      .eq("coder_id", coderId)
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return {
      data: data as (Claim & {
        task: {
          id: string;
          title: string;
          description: string;
          price: number;
          status: string;
          creator_id: string;
        };
      })[],
      count,
    };
  },

  // Get claims by status
  getByStatus: async (
    supabase: SupabaseClient,
    status: ClaimStatus,
    page = 1,
    limit = 50
  ) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("claims")
      .select(
        `
        *,
        task:tasks!claims_task_id_fkey(id, title, description, price, status),
        coder:users!claims_coder_id_fkey(id, name, email, avatar_url)
      `,
        { count: "exact" }
      )
      .eq("status", status)
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return {
      data: data as (Claim & {
        task: {
          id: string;
          title: string;
          description: string;
          price: number;
          status: string;
        };
        coder: {
          id: string;
          name: string | null;
          email: string;
          avatar_url: string | null;
        };
      })[],
      count,
    };
  },

  // Create new claim
  create: async (supabase: SupabaseClient, claim: InsertClaim) => {
    const { data, error } = await supabase
      .from("claims")
      .insert(claim)
      .select()
      .single();

    if (error) throw error;
    return data as Claim;
  },

  // Update claim
  update: async (
    supabase: SupabaseClient,
    id: string,
    updates: UpdateClaim
  ) => {
    const { data, error } = await supabase
      .from("claims")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Claim;
  },

  // Delete claim
  delete: async (supabase: SupabaseClient, id: string) => {
    const { error } = await supabase.from("claims").delete().eq("id", id);

    if (error) throw error;
    return true;
  },

  // Approve claim
  approve: async (supabase: SupabaseClient, id: string) => {
    const { data, error } = await supabase
      .from("claims")
      .update({
        status: "approved" as ClaimStatus,
        approved_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Claim;
  },

  // Reject claim
  reject: async (supabase: SupabaseClient, id: string) => {
    const { data, error } = await supabase
      .from("claims")
      .update({
        status: "rejected" as ClaimStatus,
        rejected_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Claim;
  },

  // Check if user has already claimed a task
  hasUserClaimed: async (
    supabase: SupabaseClient,
    taskId: string,
    coderId: string
  ) => {
    const { data, error } = await supabase
      .from("claims")
      .select("id, status")
      .eq("task_id", taskId)
      .eq("coder_id", coderId)
      .single();

    if (error && error.code !== "PGRST116") throw error; // PGRST116 is "not found"
    return data as Claim | null;
  },

  // Get pending claims count for a task
  getPendingCount: async (supabase: SupabaseClient, taskId: string) => {
    const { count, error } = await supabase
      .from("claims")
      .select("*", { count: "exact", head: true })
      .eq("task_id", taskId)
      .eq("status", "pending");

    if (error) throw error;
    return count || 0;
  },
};
