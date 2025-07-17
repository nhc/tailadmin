import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

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

    // Get user info to check if they're a viber
    const userResult = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (!userResult.data || userResult.data.role !== "viber") {
      return NextResponse.json({ error: "Only viber users can approve claims" }, { status: 403 });
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
