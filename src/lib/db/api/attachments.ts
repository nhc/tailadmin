import { SupabaseClient } from "@supabase/supabase-js";
import type { Attachment, InsertAttachment, FileType } from "./types";

export const attachmentsApi = {
  // Get attachment by ID
  getById: async (supabase: SupabaseClient, id: string) => {
    const { data, error } = await supabase
      .from("attachments")
      .select(
        `
        *,
        uploader:users!attachments_uploader_id_fkey(id, name, email),
        task:tasks!attachments_task_id_fkey(id, title),
        claim:claims!attachments_claim_id_fkey(id, message)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Attachment & {
      uploader: { id: string; name: string | null; email: string };
      task: { id: string; title: string } | null;
      claim: { id: string; message: string | null } | null;
    };
  },

  // Get attachments by task
  getByTask: async (supabase: SupabaseClient, taskId: string) => {
    const { data, error } = await supabase
      .from("attachments")
      .select(
        `
        *,
        uploader:users!attachments_uploader_id_fkey(id, name, email)
      `
      )
      .eq("task_id", taskId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as (Attachment & {
      uploader: { id: string; name: string | null; email: string };
    })[];
  },

  // Get attachments by claim
  getByClaim: async (supabase: SupabaseClient, claimId: string) => {
    const { data, error } = await supabase
      .from("attachments")
      .select(
        `
        *,
        uploader:users!attachments_uploader_id_fkey(id, name, email)
      `
      )
      .eq("claim_id", claimId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as (Attachment & {
      uploader: { id: string; name: string | null; email: string };
    })[];
  },

  // Get attachments by uploader
  getByUploader: async (
    supabase: SupabaseClient,
    uploaderId: string,
    page = 1,
    limit = 50
  ) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("attachments")
      .select(
        `
        *,
        task:tasks!attachments_task_id_fkey(id, title),
        claim:claims!attachments_claim_id_fkey(id, message)
      `,
        { count: "exact" }
      )
      .eq("uploader_id", uploaderId)
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return {
      data: data as (Attachment & {
        task: { id: string; title: string } | null;
        claim: { id: string; message: string | null } | null;
      })[],
      count,
    };
  },

  // Get attachments by file type
  getByFileType: async (
    supabase: SupabaseClient,
    fileType: FileType,
    page = 1,
    limit = 50
  ) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("attachments")
      .select(
        `
        *,
        uploader:users!attachments_uploader_id_fkey(id, name, email),
        task:tasks!attachments_task_id_fkey(id, title),
        claim:claims!attachments_claim_id_fkey(id, message)
      `,
        { count: "exact" }
      )
      .eq("file_type", fileType)
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return {
      data: data as (Attachment & {
        uploader: { id: string; name: string | null; email: string };
        task: { id: string; title: string } | null;
        claim: { id: string; message: string | null } | null;
      })[],
      count,
    };
  },

  // Create new attachment
  create: async (supabase: SupabaseClient, attachment: InsertAttachment) => {
    const { data, error } = await supabase
      .from("attachments")
      .insert(attachment)
      .select()
      .single();

    if (error) throw error;
    return data as Attachment;
  },

  // Delete attachment
  delete: async (supabase: SupabaseClient, id: string) => {
    const { error } = await supabase.from("attachments").delete().eq("id", id);

    if (error) throw error;
    return true;
  },

  // Delete attachments by task
  deleteByTask: async (supabase: SupabaseClient, taskId: string) => {
    const { error } = await supabase
      .from("attachments")
      .delete()
      .eq("task_id", taskId);

    if (error) throw error;
    return true;
  },

  // Delete attachments by claim
  deleteByClaim: async (supabase: SupabaseClient, claimId: string) => {
    const { error } = await supabase
      .from("attachments")
      .delete()
      .eq("claim_id", claimId);

    if (error) throw error;
    return true;
  },

  // Get attachment count by task
  getCountByTask: async (supabase: SupabaseClient, taskId: string) => {
    const { count, error } = await supabase
      .from("attachments")
      .select("*", { count: "exact", head: true })
      .eq("task_id", taskId);

    if (error) throw error;
    return count || 0;
  },

  // Get attachment count by claim
  getCountByClaim: async (supabase: SupabaseClient, claimId: string) => {
    const { count, error } = await supabase
      .from("attachments")
      .select("*", { count: "exact", head: true })
      .eq("claim_id", claimId);

    if (error) throw error;
    return count || 0;
  },
};
