"use server";

import { createClient } from "@/lib/supabase/server";
import { usersApi } from "@/lib/db/api/users";
import type { UpdateUser } from "@/lib/db/api/types";

export const updateUserProfile = async (updates: UpdateUser) => {
  try {
    const supabase = await createClient();

    // Get the current session
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();

    if (authError || !session?.user) {
      throw new Error("Not authenticated");
    }

    // Update the user profile
    const updatedUser = await usersApi.update(supabase, session.user.id, updates);

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Failed to update user profile:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update profile",
    };
  }
};
