import { stripe } from "@/lib/utils/stripe-connection";
import { createClient } from "@/lib/supabase/server";
import { usersApi } from "@/lib/db/api";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  return NextResponse.json({ message: "Stripe account API endpoint" });
};

export const PUT = async (request: NextRequest) => {
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

    // Get user data
    const userResult = await supabase
      .from("users")
      .select("email, name, stripe_account_id")
      .eq("id", session.user.id)
      .single();

    if (!userResult.data || !userResult.data.stripe_account_id) {
      return NextResponse.json({ error: "No Stripe account found" }, { status: 404 });
    }

    // Update the existing Stripe account with business information
    const updatedAccount = await stripe.accounts.update(userResult.data.stripe_account_id, {
      business_profile: {
        name: userResult.data.name || "Last20 Platform",
        url: "https://last20.com",
        mcc: "5734", // Computer Software Stores
      },
    });

    return NextResponse.json({ account: updatedAccount.id, updated: true });
  } catch (error) {
    console.error("An error occurred when updating the Stripe account:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 }
    );
  }
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

    // Get user data to use their actual email and name
    const userResult = await supabase
      .from("users")
      .select("email, name")
      .eq("id", session.user.id)
      .single();

    if (!userResult.data) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create Stripe account with business information
    const account = await stripe.accounts.create({
      country: country || "GB",
      email: userResult.data.email, // Use the user's actual email
      business_type: "individual",
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
      capabilities: {
        card_payments: {
          requested: true,
        },
        transfers: {
          requested: true,
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
