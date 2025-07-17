"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTaskStateMachine } from "@/lib/hooks/useTaskStateMachine";
import type { Task, TaskStatus, ClaimStatus } from "@/lib/db/api/types";
import type { User } from "@/lib/db/api/types";
import {
  claimTask,
  startWorkOnTask,
  deliverTask,
  completeTask,
  disputeTask,
  cancelTask,
  resolveDisputeForCoder,
  resolveDisputeForViber,
  approveClaim,
  rejectClaim,
} from "@/lib/actions/tasks";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";

type TaskWithRelations = Task & {
  creator: {
    id: string;
    name: string | null;
    email: string;
    avatar_url: string | null;
  };
  primary_assignee: {
    id: string;
    name: string | null;
    email: string;
    avatar_url: string | null;
  } | null;
  claims?: {
    id: string;
    message: string | null;
    status: ClaimStatus;
    created_at: string;
    coder: {
      id: string;
      name: string | null;
      email: string;
      avatar_url: string | null;
    };
  }[];
};

type TaskActionsProps = {
  task: TaskWithRelations;
  user: User | null;
  onAction: (action: string, taskId: string) => void;
  onTaskUpdated?: (updatedTask: Task) => void;
  refetchTask?: () => Promise<void>;
};

export const TaskActions = ({
  task,
  user,
  onAction,
  onTaskUpdated,
  refetchTask,
}: TaskActionsProps) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {
    isOpen: isStripeModalOpen,
    openModal: openStripeModal,
    closeModal: closeStripeModal,
  } = useModal();

  const router = useRouter();

  if (!user) return null;

  const isAssignee = task.primary_assignee?.id === user.id;
  const userRole = user.role;

  // Find the relevant claim for this task
  let userClaim;
  let claimStatus;

  if (userRole === "viber") {
    // For Viber users, find any pending claim on their task
    userClaim = task.claims?.find((claim) => claim.status === "pending");
    claimStatus = userClaim?.status;
  } else {
    // For Coder users, find their own claim
    userClaim = task.claims?.find((claim) => claim.coder.id === user.id);
    claimStatus = userClaim?.status;
  }

  const { availableActions, validTransitions } = useTaskStateMachine(
    task.status as TaskStatus,
    userRole,
    isAssignee,
    claimStatus
  );

  const handleStripeConnectSetup = async () => {
    closeStripeModal();
    setLoadingAction("approve_claim");

    try {
      // Step 1: Create Stripe account
      const accountResponse = await fetch("/api/stripe/account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          country: "GB", // Default to GB, could be made configurable
        }),
      });

      if (!accountResponse.ok) {
        const errorText = await accountResponse.text();
        throw new Error("Failed to create Stripe account");
      }

      const accountData = await accountResponse.json();
      const accountId = accountData.account;

      // Step 2: Create account link
      const accountLinkResponse = await fetch("/api/stripe/account-links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountId: accountId,
        }),
      });

      if (!accountLinkResponse.ok) {
        const errorText = await accountLinkResponse.text();
        throw new Error("Failed to create account link");
      }

      const accountLinkData = await accountLinkResponse.json();

      // Redirect to Stripe Connect onboarding
      window.location.href = accountLinkData.accountLink;
    } catch (error) {
      console.error("Stripe Connect setup failed:", error);
      setError("Failed to setup Stripe Connect");
      setLoadingAction(null);
    }
  };

  const startStripeCheckout = async (claimId: string) => {
    try {
      const response = await fetch("/api/stripe/payment/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          claimId,
          stripeConnectedAccountId: user.stripe_account_id,
          amount: task.price,
          currency: "GBP",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Check if it's the business name error
        if (errorData.error && errorData.error.includes("business name")) {
          // Try to update the Stripe account with business information
          await updateStripeAccount();
          // Retry the checkout
          return startStripeCheckout(claimId);
        }

        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Stripe Checkout failed:", error);
      setError("Failed to start Stripe Checkout");
      setLoadingAction(null);
    }
  };

  const updateStripeAccount = async () => {
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

      console.log("Stripe account updated successfully");
    } catch (error) {
      console.error("Failed to update Stripe account:", error);
      throw error;
    }
  };

  const handleAction = async (action: string, taskId: string) => {
    setLoadingAction(action);
    setError(null);

    try {
      let result;

      switch (action) {
        case "claim":
          result = await claimTask(taskId);
          break;
        case "start_work":
          result = await startWorkOnTask(taskId);
          break;
        case "deliver":
          result = await deliverTask(taskId);
          break;
        case "complete":
          result = await completeTask(taskId);
          break;
        case "dispute":
          result = await disputeTask(taskId);
          break;
        case "cancel":
          result = await cancelTask(taskId);
          break;
        case "resolve_for_coder":
          result = await resolveDisputeForCoder(taskId);
          break;
        case "resolve_for_viber":
          result = await resolveDisputeForViber(taskId);
          break;
        case "approve_claim":
          if (userClaim?.id) {
            try {
              // First, check if user needs Stripe Connect setup
              const statusResponse = await fetch("/api/tasks/claim-check-status", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  claimId: userClaim.id,
                }),
              });

              if (!statusResponse.ok) {
                const errorData = await statusResponse.json();
                throw new Error(errorData.error || "Failed to check claim status");
              }

              const statusResult = await statusResponse.json();

              // Handle setup requirements
              if (statusResult.type === "setup_required") {
                // Check if Stripe Connect setup is needed
                if (statusResult.checks.stripe_connect.needsSetup) {
                  openStripeModal();
                  return; // Exit early to prevent further processing
                }

                // If we get here, it means Stripe Connect is set up but payment is missing
                // You might want to handle this case differently - perhaps redirect to payment setup
                //
                startStripeCheckout(userClaim.id);
              }

              // NOTE: The claim is updated in the backend after the checkout is completed
              // where it should be
            } catch (error) {
              console.error("approveClaim error:", error);
              throw error;
            }
          }
          break;
        case "reject_claim":
          if (userClaim?.id) {
            result = await rejectClaim(userClaim.id);
          }
          break;
        default:
          throw new Error(`Unknown action: ${action}`);
      }

      // Call the parent callback
      onAction(action, taskId);

      // Call the optional callback with updated task (only for task actions that return a task object)
      if (onTaskUpdated && result && typeof result === "object" && "title" in result) {
        onTaskUpdated(result as Task);
      }

      // Always refetch the task data to ensure we have the latest state
      // This is especially important for claim actions that don't return task data
      await refetchTask?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to perform action";
      setError(errorMessage);
      console.error("Task action failed:", err);
    } finally {
      setLoadingAction(null);
    }
  };

  if (availableActions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {error && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md p-2">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {availableActions.map((action) => (
          <button
            key={action}
            onClick={() => handleAction(action, task.id)}
            disabled={loadingAction === action}
            className={`px-6 py-4 text-sm font-medium rounded-md transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              action === "claim"
                ? "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                : action === "deliver"
                ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
                : action === "complete"
                ? "bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/30"
                : action === "dispute"
                ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                : action === "approve_claim"
                ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
                : action === "reject_claim"
                ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:hover:bg-gray-900/30"
            }`}
          >
            {loadingAction === action ? (
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                Loading...
              </span>
            ) : action === "claim" ? (
              "Claim Task"
            ) : action === "start_work" ? (
              "Start Work"
            ) : action === "deliver" ? (
              "Deliver Work"
            ) : action === "complete" ? (
              "Accept Delivery"
            ) : action === "dispute" ? (
              "Dispute Delivery"
            ) : action === "cancel" ? (
              "Cancel Task"
            ) : action === "resolve_for_coder" ? (
              "Resolve for Coder"
            ) : action === "resolve_for_viber" ? (
              "Resolve for Viber"
            ) : action === "approve_claim" ? (
              "Approve Claim"
            ) : action === "reject_claim" ? (
              "Reject Claim"
            ) : (
              action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
            )}
          </button>
        ))}
      </div>

      {/* Stripe Connect Setup Modal */}
      <Modal
        isOpen={isStripeModalOpen}
        onClose={closeStripeModal}
        className="max-w-[600px] p-6 lg:p-10"
      >
        <div className="text-center">
          <div className="relative flex items-center justify-center z-1 mb-7">
            <svg
              className="fill-blue-light-50 dark:fill-blue-light-500/15"
              width="90"
              height="90"
              viewBox="0 0 90 90"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M34.364 6.85053C38.6205 -2.28351 51.3795 -2.28351 55.636 6.85053C58.0129 11.951 63.5594 14.6722 68.9556 13.3853C78.6192 11.0807 86.5743 21.2433 82.2185 30.3287C79.7862 35.402 81.1561 41.5165 85.5082 45.0122C93.3019 51.2725 90.4628 63.9451 80.7747 66.1403C75.3648 67.3661 71.5265 72.2695 71.5572 77.9156C71.6123 88.0265 60.1169 93.6664 52.3918 87.3184C48.0781 83.7737 41.9219 83.7737 37.6082 87.3184C29.8831 93.6664 18.3877 88.0266 18.4428 77.9156C18.4735 72.2695 14.6352 67.3661 9.22531 66.1403C-0.462787 63.9451 -3.30193 51.2725 4.49185 45.0122C8.84391 41.5165 10.2138 35.402 7.78151 30.3287C3.42572 21.2433 11.3808 11.0807 21.0444 13.3853C26.4406 14.6722 31.9871 11.951 34.364 6.85053Z"
                fill=""
                fillOpacity=""
              />
            </svg>
            <svg
              className="absolute z-2 fill-blue-light-500"
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.5 24.5L8.5 17.5L9.91 16.09L15.5 21.67L26.09 11.09L27.5 12.5L15.5 24.5Z"
                fill=""
              />
            </svg>
          </div>

          <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
            Connect Your Stripe Account
          </h4>

          <div className="text-sm leading-6 text-gray-500 dark:text-gray-400 space-y-3">
            <p>
              We'll now connect you to Stripe Connect where you'll need to set up an account. Stripe
              Connect allows us to safely store your money in an escrow arrangement until you're
              satisfied with the work the Coder has completed.
            </p>

            <p>
              When you accept the delivered work, the Coder will be paid automatically. This ensures
              a secure and fair payment process for everyone involved.
            </p>

            <p>
              <strong>Important:</strong> You only need to register with Stripe Connect once. After
              this setup, approving future tasks will only require payment processing without any
              additional registration steps.
            </p>

            <p>
              Once you've connected your Stripe account, you'll be redirected back here to complete
              the claim approval and make the payment for this work.
            </p>
          </div>

          <div className="flex items-center justify-center w-full gap-3 mt-8">
            <button
              type="button"
              onClick={closeStripeModal}
              className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg shadow-theme-xs hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleStripeConnectSetup}
              disabled={loadingAction === "approve_claim"}
              className="flex justify-center px-4 py-3 text-sm font-medium text-white rounded-lg bg-blue-light-500 shadow-theme-xs hover:bg-blue-light-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingAction === "approve_claim" ? (
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                  Setting up...
                </span>
              ) : (
                "Connect Stripe Account"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
