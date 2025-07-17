"use client";

import { useState } from "react";
import Button from "@/components/ui/button/Button";

type StripeAccountUpdateProps = {
  hasStripeAccount: boolean;
};

export const StripeAccountUpdate = ({ hasStripeAccount }: StripeAccountUpdateProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const updateStripeAccount = async () => {
    if (!hasStripeAccount) {
      setMessage("No Stripe account found. Please set up Stripe Connect first.");
      return;
    }

    setIsUpdating(true);
    setMessage(null);

    try {
      const response = await fetch("/api/stripe/account", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update Stripe account");
      }

      setMessage("Stripe account updated successfully! You can now use checkout.");
    } catch (error) {
      console.error("Failed to update Stripe account:", error);
      setMessage(error instanceof Error ? error.message : "Failed to update Stripe account");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!hasStripeAccount) {
    return null;
  }

  return (
    <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
      <h3 className="text-lg font-semibold text-yellow-800 mb-2">Stripe Account Setup</h3>
      <p className="text-yellow-700 mb-3">
        Your Stripe account needs business information to use checkout. Click the button below to
        update it.
      </p>

      <Button
        onClick={updateStripeAccount}
        disabled={isUpdating}
        className="bg-yellow-600 hover:bg-yellow-700 text-white"
      >
        {isUpdating ? "Updating..." : "Update Stripe Account"}
      </Button>

      {message && (
        <div
          className={`mt-3 p-2 rounded text-sm ${
            message.includes("successfully")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};
