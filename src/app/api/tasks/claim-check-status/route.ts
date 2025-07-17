import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Helper function to check if user needs Stripe Connect setup
const checkStripeConnectSetup = (user: any) => {
  if (user.stripe_account_id) {
    return { needsSetup: false };
  }

  return {
    needsSetup: true,
    message: "Please complete Stripe Connect setup to approve claims",
  };
};

// Helper function to check if there's a payment for the task
const checkStripePaymentForTask = async (supabase: any, taskId: string) => {
  const { paymentsApi } = await import("@/lib/db/api");
  const payments = await paymentsApi.getByTask(supabase, taskId);

  if (payments && payments.length > 0) {
    return { needsSetup: false };
  }

  return {
    needsSetup: true,
    message: "No Payment Found for this task",
  };
};

export const POST = async (request: NextRequest) => {
  try {
    const { claimId } = await request.json();

    const supabase = await createClient();

    // Get the current session
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();

    if (authError || !session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get user info to check if they're a viber and their Stripe status
    const userResult = await supabase
      .from("users")
      .select("role, stripe_account_id, email")
      .eq("id", session.user.id)
      .single();

    if (!userResult.data || userResult.data.role !== "viber") {
      return NextResponse.json({ error: "Only viber users can approve claims" }, { status: 403 });
    }

    // Get the claim to find the task ID
    const { claimsApi } = await import("@/lib/db/api");
    const claim = await claimsApi.getById(supabase, claimId);

    // Check Stripe Connect setup
    const stripeSetup = checkStripeConnectSetup(userResult.data);

    // Check payment for task
    const paymentCheck = await checkStripePaymentForTask(supabase, claim.task_id);

    // Build checks object
    const checks = {
      stripe_connect: stripeSetup,
      stripe_task_payment: paymentCheck,
    };

    // Check if any setup is required
    const needsSetup = stripeSetup.needsSetup || paymentCheck.needsSetup;

    if (needsSetup) {
      return NextResponse.json({
        type: "setup_required",
        checks,
        userEmail: userResult.data.email,
      });
    }

    return NextResponse.json({
      type: "ready_to_approve",
      message: "User is ready to approve claims",
      checks,
    });
  } catch (error) {
    console.error("Failed to check claim status:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 }
    );
  }
};
