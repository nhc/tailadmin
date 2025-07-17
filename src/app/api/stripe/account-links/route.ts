import { stripe } from "@/lib/utils/stripe-connection";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  return NextResponse.json({ message: "Stripe account API endpoint" });
};

export const POST = async (request: NextRequest) => {
  const { accountId } = await request.json();

  try {
    const origin = request.headers.get("origin");
    const refreshUrl = `${origin}/stripe/refresh/${accountId}`;
    const returnUrl = `${origin}/stripe/return/${accountId}`;

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: "account_onboarding",
    });

    return NextResponse.json({ accountLink: accountLink.url });
  } catch (error) {
    console.error("Error creating account link:", error);
    return NextResponse.json({ error: "Failed to create account link" }, { status: 500 });
  }
};
