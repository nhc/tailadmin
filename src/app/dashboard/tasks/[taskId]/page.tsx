"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { tasksApi, claimsApi } from "@/lib/db/api";
import type { Task, TaskStatus } from "@/lib/db/api/types";
import { useParams } from "next/navigation";
import { ClockIcon, DollarSignIcon, TagIcon, UserIcon } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";
import { useUser } from "@/lib/hooks/useUser";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import { z } from "zod";

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
};

export const TaskDetailsPage = () => {
  const { user } = useUser();
  const { isOpen, openModal, closeModal } = useModal();
  const {
    isOpen: isViberModalOpen,
    openModal: openViberModal,
    closeModal: closeViberModal,
  } = useModal();

  const params = useParams();
  const taskId = params.taskId as string;

  const [task, setTask] = useState<TaskWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [claimMessage, setClaimMessage] = useState("");
  const [isSubmittingClaim, setIsSubmittingClaim] = useState(false);
  const [claimValidationError, setClaimValidationError] = useState<
    string | null
  >(null);

  // Zod validation schema for claim message
  const claimMessageSchema = z.object({
    message: z
      .string()
      .min(200, "Your pitch must be at least 200 characters long"),
  });

  // Function to detect and strip contact details
  const stripContactDetails = (text: string): string => {
    // Email patterns
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

    // Phone number patterns (various formats)
    const phoneRegex = /(\+?[\d\s\-\(\)\.]{7,})/g;

    // Social media handles
    const socialMediaRegex = /@[a-zA-Z0-9_]{1,15}/g;

    // URLs/websites
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // Discord/Slack/Telegram handles
    const messagingHandles =
      /(discord|slack|telegram|whatsapp|signal|skype|zoom|meet)[\s:]*[a-zA-Z0-9_\-\.]+/gi;

    // Common contact phrases
    const contactPhrases =
      /(contact me|reach me|dm me|message me|call me|text me|email me|ping me|hit me up|get in touch|my number|my email|my discord|my telegram|my whatsapp|my slack)/gi;

    let filteredText = text;

    // Replace all detected patterns
    filteredText = filteredText.replace(
      emailRegex,
      "[CONTACT DETAILS REMOVED]"
    );
    filteredText = filteredText.replace(
      phoneRegex,
      "[CONTACT DETAILS REMOVED]"
    );
    filteredText = filteredText.replace(
      socialMediaRegex,
      "[CONTACT DETAILS REMOVED]"
    );
    filteredText = filteredText.replace(urlRegex, "[CONTACT DETAILS REMOVED]");
    filteredText = filteredText.replace(
      messagingHandles,
      "[CONTACT DETAILS REMOVED]"
    );
    filteredText = filteredText.replace(
      contactPhrases,
      "[CONTACT DETAILS REMOVED]"
    );

    return filteredText;
  };

  const handleClaimTask = async () => {
    if (!user || !task) return;

    // Validate the claim message
    const validationResult = claimMessageSchema.safeParse({
      message: claimMessage,
    });

    if (!validationResult.success) {
      setClaimValidationError(validationResult.error.errors[0].message);
      return;
    }

    setClaimValidationError(null);
    setIsSubmittingClaim(true);

    try {
      const supabase = createClient();

      // Strip contact details from the message
      const sanitizedMessage = stripContactDetails(claimMessage);

      await claimsApi.create(supabase, {
        task_id: task.id,
        coder_id: user.id,
        message: sanitizedMessage || null,
        status: "pending",
      });

      closeModal();
      setClaimMessage("");
      setClaimValidationError(null);
      // TODO: Show success message or redirect
    } catch (err) {
      console.error("Failed to claim task:", err);
      // TODO: Show error message
    } finally {
      setIsSubmittingClaim(false);
    }
  };

  useEffect(() => {
    const fetchTask = async () => {
      if (!taskId) return;

      setLoading(true);
      setError(null);

      try {
        const supabase = createClient();
        const data = await tasksApi.getById(supabase, taskId);

        if (!data) {
          throw new Error("Task not found");
        }

        setTask(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch task");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
              Error
            </h2>
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Task Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              The task you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          {/* Creator Information */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Task Creator
            </h3>
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <UserIcon className="w-6 h-6 text-gray-600" />
              <div>
                <p className="font-medium text-gray-800 dark:text-white">
                  {task.creator.name || "Anonymous"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Member since {formatDate(user?.created_at || "")}
                </p>
              </div>
            </div>
          </div>

          {/* Task Header */}
          <div className="m-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              {task.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              {task.description}
            </p>
          </div>

          {/* Task Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Price */}
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <DollarSignIcon className="w-6 h-6 text-green-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Budget
                </p>
                <p className="text-xl font-bold text-green-600">
                  {formatPrice(task.price)}
                </p>
              </div>
            </div>

            {/* Category */}
            <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <TagIcon className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Category
                </p>
                <p className="text-xl font-bold text-blue-600 capitalize">
                  {task.category}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-purple-600"></div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Status
                </p>
                <p className="text-xl font-bold text-purple-600 capitalize">
                  {task.status}
                </p>
              </div>
            </div>

            {/* Created Date */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <ClockIcon className="w-6 h-6 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Posted
                </p>
                <p className="text-xl font-bold text-gray-800 dark:text-white">
                  {formatDate(task.created_at)}
                </p>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          {task.tech_stack.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Required Knowledge
              </h3>
              <div className="flex flex-wrap gap-2">
                {task.tech_stack.map((tech, index) => (
                  <Badge key={index} color="info" size="md">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={openModal}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Claim Task
            </button>
            <button
              onClick={openViberModal}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Contact Viber
            </button>
          </div>
        </div>
      </div>

      {/* Claim Task Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] m-4">
        <div className="no-scrollbar relative w-full max-w-[500px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Claim Task
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Submit your claim for this task. Include a message explaining why
              you're the best fit. Mention your experience and approach.
            </p>
            <p>
              We will send your Bio along with this, so make sure you have got
              something in there.
            </p>
          </div>

          <div className="px-2">
            <div className="mb-6">
              <Label>Your pitch</Label>
              <TextArea
                value={claimMessage}
                onChange={(value) => {
                  setClaimMessage(value);
                  // Clear validation error when user starts typing
                  if (claimValidationError) {
                    setClaimValidationError(null);
                  }
                }}
                placeholder="Explain why you're the best fit for this task..."
                rows={6}
              />
              {claimValidationError && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {claimValidationError}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Note: Contact details (emails, phone numbers, social media
                handles, URLs) will be automatically removed. We use Stripe.com
                to hold the money in escrow until the task is completed and we
                can not deal with any disputes for work done outside of the
                platform.
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Minimum 200 characters required.
              </p>
            </div>

            {/* Preview of filtered message */}
            {/* {claimMessage && (
              <div className="mb-6">
                <Label>Preview (after filtering):</Label>
                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                  {stripContactDetails(claimMessage) || "No message"}
                </div>
              </div>
            )} */}
          </div>

          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleClaimTask}
              disabled={isSubmittingClaim || !claimMessage.trim()}
            >
              {isSubmittingClaim ? "Submitting..." : "Submit Claim"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Contact Viber Modal */}
      <Modal
        isOpen={isViberModalOpen}
        onClose={closeViberModal}
        className="max-w-[500px] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-[500px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Messaging
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Messaging is coming soon.
            </p>
          </div>

          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button size="sm" onClick={closeViberModal}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TaskDetailsPage;
