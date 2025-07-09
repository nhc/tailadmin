import { SupabaseClient } from "@supabase/supabase-js";
import type { User, InsertUser, UpdateUser, UserRole } from "./types";

export const usersApi = {
  // Get user by ID
  getById: async (supabase: SupabaseClient, id: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as User;
  },

  // Get user by email
  getByEmail: async (supabase: SupabaseClient, email: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) throw error;
    return data as User;
  },

  // Get users by role
  getByRole: async (supabase: SupabaseClient, role: UserRole) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("role", role)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as User[];
  },

  // Get all users (with pagination)
  getAll: async (supabase: SupabaseClient, page = 1, limit = 50) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("users")
      .select("*", { count: "exact" })
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { data: data as User[], count };
  },

  // Create new user
  create: async (supabase: SupabaseClient, user: InsertUser) => {
    const { data, error } = await supabase
      .from("users")
      .insert(user)
      .select()
      .single();

    if (error) throw error;
    return data as User;
  },

  // Update user
  update: async (supabase: SupabaseClient, id: string, updates: UpdateUser) => {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as User;
  },

  // Delete user
  delete: async (supabase: SupabaseClient, id: string) => {
    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) throw error;
    return true;
  },

  // Update user role
  updateRole: async (supabase: SupabaseClient, id: string, role: UserRole) => {
    const { data, error } = await supabase
      .from("users")
      .update({ role })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as User;
  },

  // Update Stripe account ID
  updateStripeAccount: async (
    supabase: SupabaseClient,
    id: string,
    stripeAccountId: string
  ) => {
    const { data, error } = await supabase
      .from("users")
      .update({ stripe_account_id: stripeAccountId })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as User;
  },

  // Update onboarding status
  updateOnboardingStatus: async (
    supabase: SupabaseClient,
    id: string,
    status: Record<string, unknown>
  ) => {
    const { data, error } = await supabase
      .from("users")
      .update({ onboarding_status: status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as User;
  },

  // Search users by name or email
  search: async (supabase: SupabaseClient, query: string, limit = 10) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
      .limit(limit)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as User[];
  },
};
