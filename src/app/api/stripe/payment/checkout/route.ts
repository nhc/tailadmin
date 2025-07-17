import { stripe } from "@/lib/utils/stripe-connection";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { calculatePricing } from "@/config/pricing";
import { createClient } from "@/lib/supabase/server";
import { paymentsApi } from "@/lib/db/api/payments";
import { supabase } from "@/lib/supabase/client-db-conn";
import { tasksApi } from "@/lib/db/api/tasks";
import { claimsApi } from "@/lib/db/api/claims";

export const POST = async (request: NextRequest) => {
  const { amount, currency, taskId, claimId, stripeConnectedAccountId } = await request.json();

  if (!stripeConnectedAccountId) {
    return NextResponse.json({ error: "Stripe connected account ID is required" }, { status: 400 });
  }

  // Validate Stripe account ID format (should start with 'acct_')
  if (!stripeConnectedAccountId.startsWith("acct_")) {
    return NextResponse.json(
      { error: "Invalid Stripe connected account ID format" },
      { status: 400 }
    );
  }

  if (!amount || amount <= 0) {
    return NextResponse.json({ error: "Valid amount is required" }, { status: 400 });
  }

  if (!currency) {
    return NextResponse.json({ error: "Currency is required" }, { status: 400 });
  }

  // Validate currency format
  const validCurrencies = ["gbp", "usd", "eur"];
  const normalizedCurrency = currency.toLowerCase();
  if (!validCurrencies.includes(normalizedCurrency)) {
    return NextResponse.json(
      { error: "Invalid currency. Supported currencies: GBP, USD, EUR" },
      { status: 400 }
    );
  }

  // Determine the final task ID
  let finalTaskId = taskId;

  if (!finalTaskId && claimId) {
    // If we only have claimId, fetch the task_id from the claim
    try {
      const supabase = await createClient();
      const { claimsApi } = await import("@/lib/db/api");
      const claim = await claimsApi.getById(supabase, claimId);
      finalTaskId = claim.task_id;
    } catch (error) {
      console.error("Failed to fetch claim:", error);
      return NextResponse.json({ error: "Invalid claim ID" }, { status: 400 });
    }
  }

  if (!finalTaskId) {
    return NextResponse.json({ error: "Task ID or Claim ID is required" }, { status: 400 });
  }

  const pricing_calculation = calculatePricing(amount, {
    currency: normalizedCurrency.toUpperCase() as "GBP" | "USD" | "EUR",
  });

  try {
    const headersList = await headers();
    const origin = headersList.get("origin");

    if (!origin) {
      return NextResponse.json({ error: "Origin header is required" }, { status: 400 });
    }

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create(
      {
        line_items: [
          {
            price_data: {
              currency: normalizedCurrency, // Use normalized currency
              product_data: {
                name: `Viber Task Payment`,
              },
              unit_amount: amount, // Amount is already in smallest currency unit
            },
            quantity: 1,
          },
        ],
        payment_intent_data: {
          application_fee_amount: Math.round(pricing_calculation.platformFee), // Convert platform fee to smallest unit
        },
        mode: "payment",
        success_url: `${origin}/dashboard/tasks/view/${finalTaskId}?checkout_success=true`,
        cancel_url: `${origin}/dashboard/tasks/view/${finalTaskId}?checkout_canceled=true`,
      },
      {
        stripeAccount: stripeConnectedAccountId,
      }
    );

    // Fetch task and claim data to get required IDs

    const task = await tasksApi.getById(supabase, finalTaskId);
    const claim = claimId ? await claimsApi.getById(supabase, claimId) : null;

    const payment = await paymentsApi.create(supabase, {
      amount: amount,
      currency: currency,
      task_id: finalTaskId,
      viber_id: task.creator_id,
      coder_id: claim?.coder_id || task.primary_assignee_id || "",
      platform_fee: pricing_calculation.platformFee,
      payout_amount: pricing_calculation.netAmount,
      status: "pending",
      stripe_payment_intent_id: null,
      stripe_transfer_id: null,
      stripe_checkout_session_id: session.id,
      claim_id: claimId || null,
      checkout_completed: false,
    });
    if (!payment) {
      return NextResponse.json({ error: "Failed to create payment" }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout session creation failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 }
    );
  }
};
