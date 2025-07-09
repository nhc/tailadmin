export type OnboardingStatus = {
  // Core verification statuses
  email_verified: boolean;
  phone_verified: boolean;
  profile_complete: boolean;

  // Security & compliance
  two_factor_enabled: boolean;
  terms_accepted: boolean;
  privacy_policy_accepted: boolean;

  // Payment & billing
  stripe_connected: boolean;
  plan_selected: boolean;
  payment_method_added: boolean;

  // User engagement
  first_login: boolean;
  tutorial_completed: boolean;
  welcome_message_read: boolean;

  // Collaboration & team features
  team_created: boolean;
  invitation_accepted: boolean;
  team_member_added: boolean;

  // Product adoption
  first_feature_used: boolean;
  data_imported: boolean;
  integrations_connected: boolean;

  // Communication preferences
  notification_preferences_set: boolean;
  communication_opt_in: boolean;

  // Advanced features
  api_key_generated: boolean;
  webhook_configured: boolean;
  custom_domain_setup: boolean;

  // Task marketplace - Viber specific
  first_task_posted: boolean;
  task_description_guidelines_read: boolean;
  pricing_strategy_understood: boolean;
  task_categories_explored: boolean;
  task_attachments_uploaded: boolean;
  task_links_added: boolean;
  task_tech_stack_specified: boolean;

  // Task marketplace - Coder specific
  first_claim_submitted: boolean;
  claim_message_guidelines_read: boolean;
  task_browsing_experience: boolean;
  task_filtering_used: boolean;
  task_search_used: boolean;
  task_categories_explored_coder: boolean;

  // Task workflow - Viber
  first_claim_received: boolean;
  claim_approval_process_understood: boolean;
  payment_hold_mechanism_understood: boolean;
  task_delivery_reviewed: boolean;
  task_completion_confirmed: boolean;
  payment_release_processed: boolean;

  // Task workflow - Coder
  first_task_delivered: boolean;
  delivery_guidelines_understood: boolean;
  task_requirements_met: boolean;
  delivery_attachments_uploaded: boolean;
  delivery_links_provided: boolean;
  task_completion_communicated: boolean;

  // Dispute & resolution
  dispute_process_understood: boolean;
  refund_process_understood: boolean;
  communication_channel_established: boolean;

  // Reputation & reviews
  first_review_received: boolean;
  first_review_given: boolean;
  rating_system_understood: boolean;
  feedback_guidelines_read: boolean;
};

export const defaultOnboardingStatus: OnboardingStatus = {
  // Core verification statuses
  email_verified: false,
  phone_verified: false,
  profile_complete: false,

  // Security & compliance
  two_factor_enabled: false,
  terms_accepted: false,
  privacy_policy_accepted: false,

  // Payment & billing
  stripe_connected: false,
  plan_selected: false,
  payment_method_added: false,

  // User engagement
  first_login: false,
  tutorial_completed: false,
  welcome_message_read: false,

  // Collaboration & team features
  team_created: false,
  invitation_accepted: false,
  team_member_added: false,

  // Product adoption
  first_feature_used: false,
  data_imported: false,
  integrations_connected: false,

  // Communication preferences
  notification_preferences_set: false,
  communication_opt_in: false,

  // Advanced features
  api_key_generated: false,
  webhook_configured: false,
  custom_domain_setup: false,

  // Task marketplace - Viber specific
  first_task_posted: false,
  task_description_guidelines_read: false,
  pricing_strategy_understood: false,
  task_categories_explored: false,
  task_attachments_uploaded: false,
  task_links_added: false,
  task_tech_stack_specified: false,

  // Task marketplace - Coder specific
  first_claim_submitted: false,
  claim_message_guidelines_read: false,
  task_browsing_experience: false,
  task_filtering_used: false,
  task_search_used: false,
  task_categories_explored_coder: false,

  // Task workflow - Viber
  first_claim_received: false,
  claim_approval_process_understood: false,
  payment_hold_mechanism_understood: false,
  task_delivery_reviewed: false,
  task_completion_confirmed: false,
  payment_release_processed: false,

  // Task workflow - Coder
  first_task_delivered: false,
  delivery_guidelines_understood: false,
  task_requirements_met: false,
  delivery_attachments_uploaded: false,
  delivery_links_provided: false,
  task_completion_communicated: false,

  // Dispute & resolution
  dispute_process_understood: false,
  refund_process_understood: false,
  communication_channel_established: false,

  // Reputation & reviews
  first_review_received: false,
  first_review_given: false,
  rating_system_understood: false,
  feedback_guidelines_read: false,
};

// Grouped statuses for different onboarding phases
export const onboardingPhases = {
  verification: [
    "email_verified",
    "phone_verified",
    "profile_complete",
  ] as const,
  security: [
    "two_factor_enabled",
    "terms_accepted",
    "privacy_policy_accepted",
  ] as const,
  billing: [
    "stripe_connected",
    "plan_selected",
    "payment_method_added",
  ] as const,
  engagement: [
    "first_login",
    "tutorial_completed",
    "welcome_message_read",
  ] as const,
  collaboration: [
    "team_created",
    "invitation_accepted",
    "team_member_added",
  ] as const,
  adoption: [
    "first_feature_used",
    "data_imported",
    "integrations_connected",
  ] as const,
  communication: [
    "notification_preferences_set",
    "communication_opt_in",
  ] as const,
  advanced: [
    "api_key_generated",
    "webhook_configured",
    "custom_domain_setup",
  ] as const,

  // New task marketplace phases
  task_posting: [
    "first_task_posted",
    "task_description_guidelines_read",
    "pricing_strategy_understood",
    "task_categories_explored",
    "task_attachments_uploaded",
    "task_links_added",
    "task_tech_stack_specified",
  ] as const,
  task_claiming: [
    "first_claim_submitted",
    "claim_message_guidelines_read",
    "task_browsing_experience",
    "task_filtering_used",
    "task_search_used",
    "task_categories_explored_coder",
  ] as const,
  task_management_viber: [
    "first_claim_received",
    "claim_approval_process_understood",
    "payment_hold_mechanism_understood",
    "task_delivery_reviewed",
    "task_completion_confirmed",
    "payment_release_processed",
  ] as const,
  task_delivery_coder: [
    "first_task_delivered",
    "delivery_guidelines_understood",
    "task_requirements_met",
    "delivery_attachments_uploaded",
    "delivery_links_provided",
    "task_completion_communicated",
  ] as const,
  dispute_resolution: [
    "dispute_process_understood",
    "refund_process_understood",
    "communication_channel_established",
  ] as const,
  reputation_system: [
    "first_review_received",
    "first_review_given",
    "rating_system_understood",
    "feedback_guidelines_read",
  ] as const,
} as const;

// Helper function to check if a phase is complete
export const isPhaseComplete = (
  status: OnboardingStatus,
  phase: keyof typeof onboardingPhases
): boolean => {
  const phaseStatuses = onboardingPhases[phase];
  return phaseStatuses.every((key) => status[key]);
};

// Helper function to get completion percentage
export const getCompletionPercentage = (status: OnboardingStatus): number => {
  const totalSteps = Object.keys(status).length;
  const completedSteps = Object.values(status).filter(Boolean).length;
  return Math.round((completedSteps / totalSteps) * 100);
};

// Helper function to get next incomplete step
export const getNextIncompleteStep = (
  status: OnboardingStatus
): keyof OnboardingStatus | null => {
  for (const [key, value] of Object.entries(status)) {
    if (!value) {
      return key as keyof OnboardingStatus;
    }
  }
  return null;
};

// Helper function to get role-specific completion percentage
export const getRoleCompletionPercentage = (
  status: OnboardingStatus,
  role: "viber" | "coder"
): number => {
  const roleSpecificPhases =
    role === "viber"
      ? (["task_posting", "task_management_viber"] as const)
      : (["task_claiming", "task_delivery_coder"] as const);

  const roleSpecificSteps = roleSpecificPhases.flatMap(
    (phase) => onboardingPhases[phase]
  );
  const completedRoleSteps = roleSpecificSteps.filter(
    (key) => status[key]
  ).length;

  return Math.round((completedRoleSteps / roleSpecificSteps.length) * 100);
};

// Helper function to get next role-specific step
export const getNextRoleStep = (
  status: OnboardingStatus,
  role: "viber" | "coder"
): keyof OnboardingStatus | null => {
  const roleSpecificPhases =
    role === "viber"
      ? (["task_posting", "task_management_viber"] as const)
      : (["task_claiming", "task_delivery_coder"] as const);

  const roleSpecificSteps = roleSpecificPhases.flatMap(
    (phase) => onboardingPhases[phase]
  );

  for (const step of roleSpecificSteps) {
    if (!status[step]) {
      return step;
    }
  }
  return null;
};
