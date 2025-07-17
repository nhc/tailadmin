import { SupabaseClient } from "@supabase/supabase-js";
import type { Payment, InsertPayment, UpdatePayment, PaymentStatus } from "./types";

export const paymentsApi = {
  // Get payment by ID
  getById: async (supabase: SupabaseClient, id: string) => {
    const { data, error } = await supabase
      .from("payments")
      .select(
        `
        *,
        task:tasks!payments_task_id_fkey(id, title, description, price),
        viber:users!payments_viber_id_fkey(id, name, email),
        coder:users!payments_coder_id_fkey(id, name, email)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Payment & {
      task: { id: string; title: string; description: string; price: number };
      viber: { id: string; name: string | null; email: string };
      coder: { id: string; name: string | null; email: string };
    };
  },

  // Get payments for a task
  getByTask: async (supabase: SupabaseClient, taskId: string) => {
    const { data, error } = await supabase
      .from("payments")
      .select(
        `
        *,
        viber:users!payments_viber_id_fkey(id, name, email),
        coder:users!payments_coder_id_fkey(id, name, email)
      `
      )
      .eq("task_id", taskId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as (Payment & {
      viber: { id: string; name: string | null; email: string };
      coder: { id: string; name: string | null; email: string };
    })[];
  },

  // Get payments by user (viber or coder)
  getByUser: async (
    supabase: SupabaseClient,
    userId: string,
    role: "viber" | "coder",
    page = 1,
    limit = 50
  ) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const field = role === "viber" ? "viber_id" : "coder_id";

    const { data, error, count } = await supabase
      .from("payments")
      .select(
        `
        *,
        task:tasks!payments_task_id_fkey(id, title, description, price),
        viber:users!payments_viber_id_fkey(id, name, email),
        coder:users!payments_coder_id_fkey(id, name, email)
      `,
        { count: "exact" }
      )
      .eq(field, userId)
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return {
      data: data as (Payment & {
        task: { id: string; title: string; description: string; price: number };
        viber: { id: string; name: string | null; email: string };
        coder: { id: string; name: string | null; email: string };
      })[],
      count,
    };
  },

  // Get payments by status
  getByStatus: async (supabase: SupabaseClient, status: PaymentStatus, page = 1, limit = 50) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("payments")
      .select(
        `
        *,
        task:tasks!payments_task_id_fkey(id, title, description, price),
        viber:users!payments_viber_id_fkey(id, name, email),
        coder:users!payments_coder_id_fkey(id, name, email)
      `,
        { count: "exact" }
      )
      .eq("status", status)
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return {
      data: data as (Payment & {
        task: { id: string; title: string; description: string; price: number };
        viber: { id: string; name: string | null; email: string };
        coder: { id: string; name: string | null; email: string };
      })[],
      count,
    };
  },

  // Create new payment
  create: async (supabase: SupabaseClient, payment: InsertPayment) => {
    const { data, error } = await supabase.from("payments").insert(payment).select().single();

    if (error) throw error;
    return data as Payment;
  },

  // Update payment
  update: async (supabase: SupabaseClient, id: string, updates: UpdatePayment) => {
    const { data, error } = await supabase
      .from("payments")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Payment;
  },

  // Delete payment
  delete: async (supabase: SupabaseClient, id: string) => {
    const { error } = await supabase.from("payments").delete().eq("id", id);

    if (error) throw error;
    return true;
  },

  // Update payment status
  updateStatus: async (supabase: SupabaseClient, id: string, status: PaymentStatus) => {
    const updates: UpdatePayment = { status };

    if (status === "refunded") {
      updates.refunded_at = new Date().toISOString();
    } else if (status === "disputed") {
      updates.disputed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("payments")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Payment;
  },

  // Update Stripe payment intent ID
  updateStripePaymentIntent: async (
    supabase: SupabaseClient,
    id: string,
    stripePaymentIntentId: string
  ) => {
    const { data, error } = await supabase
      .from("payments")
      .update({ stripe_payment_intent_id: stripePaymentIntentId })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Payment;
  },

  // Update Stripe transfer ID
  updateStripeTransfer: async (supabase: SupabaseClient, id: string, stripeTransferId: string) => {
    const { data, error } = await supabase
      .from("payments")
      .update({ stripe_transfer_id: stripeTransferId })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Payment;
  },

  // Get payment by Stripe payment intent ID
  getByStripePaymentIntent: async (supabase: SupabaseClient, stripePaymentIntentId: string) => {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("stripe_payment_intent_id", stripePaymentIntentId)
      .single();

    if (error) throw error;
    return data as Payment;
  },

  // Get payment by Stripe checkout session ID
  getByStripeCheckoutSessionId: async (
    supabase: SupabaseClient,
    stripeCheckoutSessionId: string
  ) => {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("stripe_checkout_session_id", stripeCheckoutSessionId)
      .single();

    if (error) throw error;
    return data as Payment;
  },

  // Get total earnings for a coder
  getCoderEarnings: async (supabase: SupabaseClient, coderId: string) => {
    const { data, error } = await supabase
      .from("payments")
      .select("payout_amount")
      .eq("coder_id", coderId)
      .eq("status", "released");

    if (error) throw error;
    return data.reduce((total, payment) => total + Number(payment.payout_amount), 0);
  },

  // Get total spent for a viber
  getViberSpent: async (supabase: SupabaseClient, viberId: string) => {
    const { data, error } = await supabase
      .from("payments")
      .select("amount")
      .eq("viber_id", viberId)
      .in("status", ["held", "released"]);

    if (error) throw error;
    return data.reduce((total, payment) => total + Number(payment.amount), 0);
  },
};
