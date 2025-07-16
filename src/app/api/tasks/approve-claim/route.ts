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

    // Check Stripe Connect setup
    const stripeSetup = checkStripeConnectSetup(userResult.data);

    if (stripeSetup.needsSetup) {
      return NextResponse.json({
        type: "stripe_setup_required",
        message: stripeSetup.message,
      });
    }

    // Get the claim to find the task ID
    const { claimsApi } = await import("@/lib/db/api");
    const claim = await claimsApi.getById(supabase, claimId);

    // Approve the claim
    const approvedClaim = await claimsApi.approve(supabase, claimId);

    // Update the task status to inprogress
    const { tasksApi } = await import("@/lib/db/api");
    const updatedTask = await tasksApi.updateStatus(supabase, claim.task_id, "inprogress");

    // Create audit log entry
    const { auditTrailApi } = await import("@/lib/db/api");
    await auditTrailApi.create(supabase, {
      user_id: session.user.id,
      action_type: "claim_approved",
      entity_type: "claim",
      entity_id: claimId,
      metadata: {
        claimId,
        taskId: claim.task_id,
        approvedBy: session.user.id,
        approvedAt: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      approvedClaim,
      updatedTask,
      type: "claim_approved",
    });
  } catch (error) {
    console.error("Failed to approve claim:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 }
    );
  }
};
