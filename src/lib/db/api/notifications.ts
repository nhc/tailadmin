import { SupabaseClient } from "@supabase/supabase-js";
import type {
  Notification,
  InsertNotification,
  UpdateNotification,
  NotificationType,
} from "./types";

export const notificationsApi = {
  // Get notification by ID
  getById: async (supabase: SupabaseClient, id: string) => {
    const { data, error } = await supabase
      .from("notifications")
      .select(
        `
        *,
        user:users!notifications_user_id_fkey(id, name, email)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Notification & {
      user: { id: string; name: string | null; email: string };
    };
  },

  // Get notifications by user
  getByUser: async (
    supabase: SupabaseClient,
    userId: string,
    page = 1,
    limit = 50
  ) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("notifications")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { data: data as Notification[], count };
  },

  // Get unread notifications by user
  getUnreadByUser: async (
    supabase: SupabaseClient,
    userId: string,
    page = 1,
    limit = 50
  ) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("notifications")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .is("sent_at", null)
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { data: data as Notification[], count };
  },

  // Get notifications by type
  getByType: async (
    supabase: SupabaseClient,
    type: NotificationType,
    page = 1,
    limit = 50
  ) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("notifications")
      .select(
        `
        *,
        user:users!notifications_user_id_fkey(id, name, email)
      `,
        { count: "exact" }
      )
      .eq("type", type)
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return {
      data: data as (Notification & {
        user: { id: string; name: string | null; email: string };
      })[],
      count,
    };
  },

  // Get notifications by sent status
  getBySentStatus: async (
    supabase: SupabaseClient,
    sent: boolean,
    page = 1,
    limit = 50
  ) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("notifications")
      .select(
        `
        *,
        user:users!notifications_user_id_fkey(id, name, email)
      `,
        { count: "exact" }
      )
      .is("sent_at", sent ? "not.null" : null)
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return {
      data: data as (Notification & {
        user: { id: string; name: string | null; email: string };
      })[],
      count,
    };
  },

  // Create new notification
  create: async (
    supabase: SupabaseClient,
    notification: InsertNotification
  ) => {
    const { data, error } = await supabase
      .from("notifications")
      .insert(notification)
      .select()
      .single();

    if (error) throw error;
    return data as Notification;
  },

  // Update notification
  update: async (
    supabase: SupabaseClient,
    id: string,
    updates: UpdateNotification
  ) => {
    const { data, error } = await supabase
      .from("notifications")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Notification;
  },

  // Delete notification
  delete: async (supabase: SupabaseClient, id: string) => {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  },

  // Mark notification as sent
  markAsSent: async (supabase: SupabaseClient, id: string) => {
    const { data, error } = await supabase
      .from("notifications")
      .update({ sent_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Notification;
  },

  // Mark multiple notifications as sent
  markMultipleAsSent: async (supabase: SupabaseClient, ids: string[]) => {
    const { data, error } = await supabase
      .from("notifications")
      .update({ sent_at: new Date().toISOString() })
      .in("id", ids)
      .select();

    if (error) throw error;
    return data as Notification[];
  },

  // Mark all user notifications as sent
  markAllUserAsSent: async (supabase: SupabaseClient, userId: string) => {
    const { data, error } = await supabase
      .from("notifications")
      .update({ sent_at: new Date().toISOString() })
      .eq("user_id", userId)
      .is("sent_at", null)
      .select();

    if (error) throw error;
    return data as Notification[];
  },

  // Delete old notifications
  deleteOld: async (supabase: SupabaseClient, daysOld: number) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const { error } = await supabase
      .from("notifications")
      .delete()
      .lt("created_at", cutoffDate.toISOString());

    if (error) throw error;
    return true;
  },

  // Get notification count by user
  getCountByUser: async (supabase: SupabaseClient, userId: string) => {
    const { count, error } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (error) throw error;
    return count || 0;
  },

  // Get unread notification count by user
  getUnreadCountByUser: async (supabase: SupabaseClient, userId: string) => {
    const { count, error } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .is("sent_at", null);

    if (error) throw error;
    return count || 0;
  },

  // Create notification with convenience method
  createNotification: async (
    supabase: SupabaseClient,
    userId: string,
    type: NotificationType,
    content: string,
    sentVia = "email"
  ) => {
    const notification: InsertNotification = {
      user_id: userId,
      type,
      content,
      sent_via: sentVia,
    };

    return notificationsApi.create(supabase, notification);
  },
};
