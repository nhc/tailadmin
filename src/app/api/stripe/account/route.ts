import { stripe } from "@/lib/utils/stripe-connection";
import { createClient } from "@/lib/supabase/server";
import { usersApi } from "@/lib/db/api";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  return NextResponse.json({ message: "Stripe account API endpoint" });
};

export const POST = async (request: NextRequest) => {
  const { email, country } = await request.json();

  try {
    // Get authenticated user
    const supabase = await createClient();
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();

    if (authError || !session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Create Stripe account
    const account = await stripe.accounts.create({
      country: "GB",
      email: "neil@bleepsystems.com",
      controller: {
        fees: {
          payer: "application",
        },
        losses: {
          payments: "application",
        },
        stripe_dashboard: {
          type: "express",
        },
      },
    } as any);

    // Save account ID to database
    const updatedUser = await usersApi.updateStripeAccount(supabase, session.user.id, account.id);

    // Update onboarding status to mark Stripe as connected
    const currentOnboardingStatus = updatedUser.onboarding_status || {};
    const updatedOnboardingStatus = {
      ...currentOnboardingStatus,
      stripe_connected: true,
    };

    await usersApi.updateOnboardingStatus(supabase, session.user.id, updatedOnboardingStatus);

    return NextResponse.json({ account: account.id });
  } catch (error) {
    console.error("An error occurred when calling the Stripe API to create an account:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 }
    );
  }
};
