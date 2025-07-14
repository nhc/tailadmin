import { createClient } from "@/lib/supabase/server";
import { usersApi } from "@/lib/db/api/users";
import type { User } from "@/lib/db/api/types";

export type ServerUserData = {
  authUser: any;
  userData: User | null;
  error: string | null;
};

export const useServerUser = async (): Promise<ServerUserData> => {
  try {
    const supabase = await createClient();

    // First check if user is authenticated
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();

    const authUser = session?.user;

    if (authError) {
      console.error("Auth error:", authError);
      return {
        authUser: null,
        userData: null,
        error: authError.message,
      };
    }

    if (!authUser) {
      return {
        authUser: null,
        userData: null,
        error: "Not authenticated",
      };
    }

    // Fetch user data from database
    try {
      const userData = await usersApi.getById(supabase, authUser.id);
      return {
        authUser,
        userData,
        error: null,
      };
    } catch (dbError) {
      console.error("Failed to fetch user data:", dbError);
      return {
        authUser,
        userData: null,
        error: "Failed to fetch user data",
      };
    }
  } catch (error) {
    console.error("useServerUser error:", error);
    return {
      authUser: null,
      userData: null,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
};
