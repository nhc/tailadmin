import { redirect } from "next/navigation";

// These are Stripe connect callbacks
export default async function ReturnPage({ params }: { params: Promise<{ accountId: string }> }) {
  const { accountId } = await params;

  // TODO: Add logic to verify account status and update user onboarding

  // Redirect back to dashboard
  redirect("/dashboard?return=true");
}
