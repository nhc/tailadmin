import { stripe } from "@/lib/utils/stripe-connection";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { paymentsApi } from "@/lib/db/api/payments";
import { createClient } from "@/lib/supabase/server";
import { ClaimStatus, PaymentStatus, TaskStatus } from "@/lib/db/api/types";
import { tasksApi } from "@/lib/db/api/tasks";
import { claimsApi } from "@/lib/db/api/claims";

export const GET = async (request: NextRequest) => {
  return NextResponse.json({ message: "Stripe payment complete API endpoint unprotected" });
};

const processPaymentCompletion = async (checkoutSession: Stripe.Checkout.Session) => {
  try {
    console.log("[checkout.session.completed] checkoutSession", checkoutSession);

    const supabase = await createClient();
    const payment = await paymentsApi.getByStripeCheckoutSessionId(supabase, checkoutSession.id);
    if (!payment) {
      console.log(
        `[checkout.session.completed] Payment not found for checkout session ${checkoutSession.id}`
      );
      return;
    }

    const updatedPayment = await paymentsApi.update(supabase, payment.id, {
      checkout_completed: true,
      stripe_payment_intent_id: checkoutSession.payment_intent as string,
      status: "held" as PaymentStatus,
    });

    if (!updatedPayment) {
      console.log(`[checkout.session.completed] Failed to update payment ${payment.id}`);
      return;
    }

    // Change the task status to "in progress"
    const task = await tasksApi.getById(supabase, payment.task_id);
    if (!task) {
      console.log(`[checkout.session.completed] Task not found for payment ${payment.id}`);
      return;
    }

    const updatedTask = await tasksApi.update(supabase, task.id, {
      status: "inprogress" as TaskStatus,
    });

    if (payment.claim_id && updatedTask) {
      await claimsApi.update(supabase, payment.claim_id, {
        status: "approved" as ClaimStatus,
      });
    }
  } catch (error) {
    console.error("[checkout.session.completed] Error processing payment completion:", error);
  }
};

export const POST = async (request: NextRequest) => {
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature) {
    console.log("⚠️  No Stripe signature found in headers");
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  if (!endpointSecret) {
    console.log("⚠️  No webhook secret configured");
    return NextResponse.json({ error: "No webhook secret" }, { status: 400 });
  }

  let event;

  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err) {
    console.log(
      `⚠️  Webhook signature verification failed.`,
      err instanceof Error ? err.message : "Unknown error"
    );
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      // TODO: Implement payment intent success handling
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case "payment_method.attached":
      const paymentMethod = event.data.object as Stripe.PaymentMethod;
      console.log(`PaymentMethod ${paymentMethod.id} was attached!`);
      // TODO: Implement payment method attachment handling
      // handlePaymentMethodAttached(paymentMethod);
      break;
    case "checkout.session.completed":
      const checkoutSession = event.data.object as Stripe.Checkout.Session;
      console.log(`CheckoutSession for ${checkoutSession.amount_total} was successful!`);

      // Fire and forget - don't await to return quickly
      processPaymentCompletion(checkoutSession);
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }

  // Return a 200 response to acknowledge receipt of the event
  return NextResponse.json({ received: true });
};
