export type UserRole = "viber" | "coder" | "admin" | "superuser";
export type TaskStatus =
  | "open"
  | "claimed"
  | "delivered"
  | "completed"
  | "disputed"
  | "cancelled";
export type ClaimStatus = "pending" | "approved" | "rejected";
export type PaymentStatus =
  | "pending"
  | "held"
  | "released"
  | "refunded"
  | "disputed";
export type FileType = "image" | "video" | "code" | "other";
export type NotificationType =
  | "task_claimed"
  | "task_completed"
  | "payment_released"
  | "general";
export type AuditAction =
  | "task_created"
  | "task_claimed"
  | "task_delivered"
  | "task_completed"
  | "payment_processed"
  | "user_registered";
export type EntityType = "task" | "claim" | "payment" | "user";

export type User = {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: UserRole;
  stripe_account_id: string | null;
  onboarding_status: Record<string, unknown> | null;
  nickname: string | null;
  timezone: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  price: number;
  category: string;
  links: Record<string, unknown> | null;
  creator_id: string;
  primary_assignee_id: string | null;
  is_private: boolean;
  status: TaskStatus;
  status_timestamps: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export type TaskSecondaryAssignee = {
  id: string;
  task_id: string;
  user_id: string;
  created_at: string;
};

export type Claim = {
  id: string;
  task_id: string;
  coder_id: string;
  message: string | null;
  status: ClaimStatus;
  created_at: string;
  approved_at: string | null;
  rejected_at: string | null;
};

export type Payment = {
  id: string;
  task_id: string;
  viber_id: string;
  coder_id: string;
  amount: number;
  platform_fee: number;
  payout_amount: number;
  status: PaymentStatus;
  stripe_payment_intent_id: string | null;
  stripe_transfer_id: string | null;
  created_at: string;
  updated_at: string;
  refunded_at: string | null;
  disputed_at: string | null;
};

export type Attachment = {
  id: string;
  task_id: string | null;
  claim_id: string | null;
  uploader_id: string;
  file_url: string;
  file_type: FileType;
  created_at: string;
};

export type AuditTrail = {
  id: string;
  user_id: string | null;
  action_type: AuditAction;
  entity_type: EntityType;
  entity_id: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

export type Review = {
  id: string;
  task_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  type: NotificationType;
  content: string;
  sent_via: string;
  sent_at: string | null;
  created_at: string;
};

// Insert types (for creating new records)
export type InsertUser = Omit<User, "id" | "created_at" | "updated_at">;
export type InsertTask = Omit<Task, "id" | "created_at" | "updated_at">;
export type InsertTaskSecondaryAssignee = Omit<
  TaskSecondaryAssignee,
  "id" | "created_at"
>;
export type InsertClaim = Omit<
  Claim,
  "id" | "created_at" | "approved_at" | "rejected_at"
>;
export type InsertPayment = Omit<
  Payment,
  "id" | "created_at" | "updated_at" | "refunded_at" | "disputed_at"
>;
export type InsertAttachment = Omit<Attachment, "id" | "created_at">;
export type InsertAuditTrail = Omit<AuditTrail, "id" | "created_at">;
export type InsertReview = Omit<Review, "id" | "created_at">;
export type InsertNotification = Omit<
  Notification,
  "id" | "created_at" | "sent_at"
>;

// Update types (for updating existing records)
export type UpdateUser = Partial<
  Omit<User, "id" | "created_at" | "updated_at">
>;
export type UpdateTask = Partial<
  Omit<Task, "id" | "created_at" | "updated_at">
>;
export type UpdateClaim = Partial<Omit<Claim, "id" | "created_at">>;
export type UpdatePayment = Partial<
  Omit<Payment, "id" | "created_at" | "updated_at">
>;
export type UpdateReview = Partial<Omit<Review, "id" | "created_at">>;
export type UpdateNotification = Partial<
  Omit<Notification, "id" | "created_at">
>;
