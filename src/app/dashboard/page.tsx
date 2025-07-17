import { redirect } from "next/navigation";
import ActionCards from "@/components/_pages/dashboard/ActionCards";
import { StripeAccountUpdate } from "@/components/_pages/dashboard/StripeAccountUpdate";
import { useServerUser } from "@/lib/hooks/useServerUser";
import { GetStartedInfo } from "@/components/_pages/dashboard/GetStartedInfo";

export default async function Dashboard() {
  const { authUser, userData, error } = await useServerUser();

  if (error || !authUser) {
    redirect("/auth/signin?error=" + error);
  }

  return (
    <section>
      <GetStartedInfo />
      {/* <div className="">
        <h1>Dashboard</h1>
        <p>Welcome, {userData?.nickname || userData?.email || authUser.email}!</p>
        {userData && (
          <div>
            <p>Role: {userData.role}</p>
            <p>User ID: {userData.id}</p>
            {userData.stripe_account_id && <p>Stripe Connected: Yes</p>}
          </div>
        )}
        {!userData && (
          <div className="text-yellow-600">
            <p>Note: User profile not found in database</p>
          </div>
        )}
      </div> */}

      {/* Add Stripe Account Update component */}
      {/* <div className="mt-6">
        <StripeAccountUpdate hasStripeAccount={!!userData?.stripe_account_id} />
      </div>

      <ActionCards /> */}
    </section>
  );
}
