import { SupabaseClient } from "@supabase/supabase-js";
import type {
  AuditTrail,
  InsertAuditTrail,
  AuditAction,
  EntityType,
} from "./types";

export const auditTrailApi = {
  // Get audit log by ID
  getById: async (supabase: SupabaseClient, id: string) => {
    const { data, error } = await supabase
      .from("audit_trail")
      .select(
        `
        *,
        user:users!audit_trail_user_id_fkey(id, name, email)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as AuditTrail & {
      user: { id: string; name: string | null; email: string } | null;
    };
  },

  // Get audit logs by user
  getByUser: async (
    supabase: SupabaseClient,
    userId: string,
    page = 1,
    limit = 50
  ) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("audit_trail")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { data: data as AuditTrail[], count };
  },

  // Get audit logs by entity
  getByEntity: async (
    supabase: SupabaseClient,
    entityType: EntityType,
    entityId: string,
    page = 1,
    limit = 50
  ) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("audit_trail")
      .select(
        `
        *,
        user:users!audit_trail_user_id_fkey(id, name, email)
      `,
        { count: "exact" }
      )
      .eq("entity_type", entityType)
      .eq("entity_id", entityId)
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return {
      data: data as (AuditTrail & {
        user: { id: string; name: string | null; email: string } | null;
      })[],
      count,
    };
  },

  // Get audit logs by action type
  getByAction: async (
    supabase: SupabaseClient,
    actionType: AuditAction,
    page = 1,
    limit = 50
  ) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("audit_trail")
      .select(
        `
        *,
        user:users!audit_trail_user_id_fkey(id, name, email)
      `,
        { count: "exact" }
      )
      .eq("action_type", actionType)
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return {
      data: data as (AuditTrail & {
        user: { id: string; name: string | null; email: string } | null;
      })[],
      count,
    };
  },

  // Get all audit logs with filters
  getAll: async (
    supabase: SupabaseClient,
    filters?: {
      userId?: string;
      actionType?: AuditAction;
      entityType?: EntityType;
      entityId?: string;
      startDate?: string;
      endDate?: string;
    },
    page = 1,
    limit = 50
  ) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase.from("audit_trail").select(
      `
        *,
        user:users!audit_trail_user_id_fkey(id, name, email)
      `,
      { count: "exact" }
    );

    if (filters?.userId) {
      query = query.eq("user_id", filters.userId);
    }
    if (filters?.actionType) {
      query = query.eq("action_type", filters.actionType);
    }
    if (filters?.entityType) {
      query = query.eq("entity_type", filters.entityType);
    }
    if (filters?.entityId) {
      query = query.eq("entity_id", filters.entityId);
    }
    if (filters?.startDate) {
      query = query.gte("created_at", filters.startDate);
    }
    if (filters?.endDate) {
      query = query.lte("created_at", filters.endDate);
    }

    const { data, error, count } = await query
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return {
      data: data as (AuditTrail & {
        user: { id: string; name: string | null; email: string } | null;
      })[],
      count,
    };
  },

  // Create new audit log entry
  create: async (supabase: SupabaseClient, auditLog: InsertAuditTrail) => {
    const { data, error } = await supabase
      .from("audit_trail")
      .insert(auditLog)
      .select()
      .single();

    if (error) throw error;
    return data as AuditTrail;
  },

  // Create audit log entry with convenience method
  logAction: async (
    supabase: SupabaseClient,
    actionType: AuditAction,
    entityType: EntityType,
    entityId: string,
    userId?: string,
    metadata?: Record<string, unknown>
  ) => {
    const auditLog: InsertAuditTrail = {
      user_id: userId || null,
      action_type: actionType,
      entity_type: entityType,
      entity_id: entityId,
      metadata: metadata || null,
    };

    return auditTrailApi.create(supabase, auditLog);
  },

  // Delete audit log
  delete: async (supabase: SupabaseClient, id: string) => {
    const { error } = await supabase.from("audit_trail").delete().eq("id", id);

    if (error) throw error;
    return true;
  },

  // Get audit logs for a specific time period
  getByDateRange: async (
    supabase: SupabaseClient,
    startDate: string,
    endDate: string,
    page = 1,
    limit = 50
  ) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("audit_trail")
      .select(
        `
        *,
        user:users!audit_trail_user_id_fkey(id, name, email)
      `,
        { count: "exact" }
      )
      .gte("created_at", startDate)
      .lte("created_at", endDate)
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return {
      data: data as (AuditTrail & {
        user: { id: string; name: string | null; email: string } | null;
      })[],
      count,
    };
  },
};
