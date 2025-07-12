"use client";

import { useUser } from "@/lib/hooks/useUser";

export default function UserDataExample() {
  const { user, loading, error } = useUser();

  if (loading) {
    return <div>Loading user data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>No user data available</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">User Data Example</h2>

      <div className="space-y-2">
        <div>
          <strong>Auth User ID:</strong> {user.id}
        </div>
        <div>
          <strong>Database User ID:</strong> {user.id}
        </div>
        <div>
          <strong>Name:</strong> {user.name || "Not set"}
        </div>
        <div>
          <strong>Email:</strong> {user.email}
        </div>
        <div>
          <strong>Role:</strong> {user.role}
        </div>
        <div>
          <strong>Stripe Account:</strong>{" "}
          {user.stripe_account_id || "Not connected"}
        </div>
        <div>
          <strong>Onboarding Status:</strong>{" "}
          {user.onboarding_status ? "In Progress" : "Completed"}
        </div>
        <div>
          <strong>Created:</strong>{" "}
          {new Date(user.created_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
