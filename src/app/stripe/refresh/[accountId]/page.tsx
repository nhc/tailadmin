import { redirect } from "next/navigation";

// These are Stripe connect callbacks
export default async function RefreshPage({ params }: { params: { accountId: string } }) {
  // TODO: Add logic to create new account link and redirect back to Stripe

  // Redirect back to dashboard
  redirect("/dashboard?refresh=true");
}
