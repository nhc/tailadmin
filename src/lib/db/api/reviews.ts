import { SupabaseClient } from "@supabase/supabase-js";
import type { Review, InsertReview, UpdateReview } from "./types";

export const reviewsApi = {
  // Get review by ID
  getById: async (supabase: SupabaseClient, id: string) => {
    const { data, error } = await supabase
      .from("reviews")
      .select(
        `
        *,
        task:tasks!reviews_task_id_fkey(id, title, description),
        reviewer:users!reviews_reviewer_id_fkey(id, name, email, avatar_url),
        reviewee:users!reviews_reviewee_id_fkey(id, name, email, avatar_url)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Review & {
      task: { id: string; title: string; description: string };
      reviewer: {
        id: string;
        name: string | null;
        email: string;
        avatar_url: string | null;
      };
      reviewee: {
        id: string;
        name: string | null;
        email: string;
        avatar_url: string | null;
      };
    };
  },

  // Get reviews by task
  getByTask: async (supabase: SupabaseClient, taskId: string) => {
    const { data, error } = await supabase
      .from("reviews")
      .select(
        `
        *,
        reviewer:users!reviews_reviewer_id_fkey(id, name, email, avatar_url),
        reviewee:users!reviews_reviewee_id_fkey(id, name, email, avatar_url)
      `
      )
      .eq("task_id", taskId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as (Review & {
      reviewer: {
        id: string;
        name: string | null;
        email: string;
        avatar_url: string | null;
      };
      reviewee: {
        id: string;
        name: string | null;
        email: string;
        avatar_url: string | null;
      };
    })[];
  },

  // Get reviews by reviewer
  getByReviewer: async (
    supabase: SupabaseClient,
    reviewerId: string,
    page = 1,
    limit = 50
  ) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("reviews")
      .select(
        `
        *,
        task:tasks!reviews_task_id_fkey(id, title, description),
        reviewee:users!reviews_reviewee_id_fkey(id, name, email, avatar_url)
      `,
        { count: "exact" }
      )
      .eq("reviewer_id", reviewerId)
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return {
      data: data as (Review & {
        task: { id: string; title: string; description: string };
        reviewee: {
          id: string;
          name: string | null;
          email: string;
          avatar_url: string | null;
        };
      })[],
      count,
    };
  },

  // Get reviews by reviewee
  getByReviewee: async (
    supabase: SupabaseClient,
    revieweeId: string,
    page = 1,
    limit = 50
  ) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("reviews")
      .select(
        `
        *,
        task:tasks!reviews_task_id_fkey(id, title, description),
        reviewer:users!reviews_reviewer_id_fkey(id, name, email, avatar_url)
      `,
        { count: "exact" }
      )
      .eq("reviewee_id", revieweeId)
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return {
      data: data as (Review & {
        task: { id: string; title: string; description: string };
        reviewer: {
          id: string;
          name: string | null;
          email: string;
          avatar_url: string | null;
        };
      })[],
      count,
    };
  },

  // Get reviews by rating
  getByRating: async (
    supabase: SupabaseClient,
    rating: number,
    page = 1,
    limit = 50
  ) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("reviews")
      .select(
        `
        *,
        task:tasks!reviews_task_id_fkey(id, title, description),
        reviewer:users!reviews_reviewer_id_fkey(id, name, email, avatar_url),
        reviewee:users!reviews_reviewee_id_fkey(id, name, email, avatar_url)
      `,
        { count: "exact" }
      )
      .eq("rating", rating)
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return {
      data: data as (Review & {
        task: { id: string; title: string; description: string };
        reviewer: {
          id: string;
          name: string | null;
          email: string;
          avatar_url: string | null;
        };
        reviewee: {
          id: string;
          name: string | null;
          email: string;
          avatar_url: string | null;
        };
      })[],
      count,
    };
  },

  // Create new review
  create: async (supabase: SupabaseClient, review: InsertReview) => {
    // Validate rating
    if (review.rating < 1 || review.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    const { data, error } = await supabase
      .from("reviews")
      .insert(review)
      .select()
      .single();

    if (error) throw error;
    return data as Review;
  },

  // Update review
  update: async (
    supabase: SupabaseClient,
    id: string,
    updates: UpdateReview
  ) => {
    // Validate rating if provided
    if (updates.rating && (updates.rating < 1 || updates.rating > 5)) {
      throw new Error("Rating must be between 1 and 5");
    }

    const { data, error } = await supabase
      .from("reviews")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Review;
  },

  // Delete review
  delete: async (supabase: SupabaseClient, id: string) => {
    const { error } = await supabase.from("reviews").delete().eq("id", id);

    if (error) throw error;
    return true;
  },

  // Check if user has already reviewed for a task
  hasUserReviewed: async (
    supabase: SupabaseClient,
    taskId: string,
    reviewerId: string,
    revieweeId: string
  ) => {
    const { data, error } = await supabase
      .from("reviews")
      .select("id, rating, comment")
      .eq("task_id", taskId)
      .eq("reviewer_id", reviewerId)
      .eq("reviewee_id", revieweeId)
      .single();

    if (error && error.code !== "PGRST116") throw error; // PGRST116 is "not found"
    return data as Review | null;
  },

  // Get average rating for a user
  getAverageRating: async (supabase: SupabaseClient, revieweeId: string) => {
    const { data, error } = await supabase
      .from("reviews")
      .select("rating")
      .eq("reviewee_id", revieweeId);

    if (error) throw error;

    if (data.length === 0) return 0;

    const totalRating = data.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / data.length;
  },

  // Get review count for a user
  getReviewCount: async (supabase: SupabaseClient, revieweeId: string) => {
    const { count, error } = await supabase
      .from("reviews")
      .select("*", { count: "exact", head: true })
      .eq("reviewee_id", revieweeId);

    if (error) throw error;
    return count || 0;
  },

  // Get reviews with rating range
  getByRatingRange: async (
    supabase: SupabaseClient,
    minRating: number,
    maxRating: number,
    page = 1,
    limit = 50
  ) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("reviews")
      .select(
        `
        *,
        task:tasks!reviews_task_id_fkey(id, title, description),
        reviewer:users!reviews_reviewer_id_fkey(id, name, email, avatar_url),
        reviewee:users!reviews_reviewee_id_fkey(id, name, email, avatar_url)
      `,
        { count: "exact" }
      )
      .gte("rating", minRating)
      .lte("rating", maxRating)
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return {
      data: data as (Review & {
        task: { id: string; title: string; description: string };
        reviewer: {
          id: string;
          name: string | null;
          email: string;
          avatar_url: string | null;
        };
        reviewee: {
          id: string;
          name: string | null;
          email: string;
          avatar_url: string | null;
        };
      })[],
      count,
    };
  },
};
