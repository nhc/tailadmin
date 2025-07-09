"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { usersApi } from "@/lib/db/api/users";
import type { User } from "@/lib/db/api/types";
import type { SupabaseClient } from "@supabase/supabase-js";

type UserState = {
  user: User | null;
  loading: boolean;
  error: string | null;
};

export const useUser = () => {
  const [userState, setUserState] = useState<UserState>({
    user: null,
    loading: true,
    error: null,
  });

  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // First check if user is authenticated
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !authUser) {
          setUserState({ user: null, loading: false, error: null });
          return;
        }

        // Fetch user data from database
        const userData = await usersApi.getById(supabase as any, authUser.id);
        setUserState({ user: userData, loading: false, error: null });
      } catch (error) {
        setUserState({
          user: null,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch user data",
        });
      }
    };

    fetchUser();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setUserState({ user: null, loading: false, error: null });
        return;
      }

      if (session?.user) {
        try {
          const userData = await usersApi.getById(
            supabase as any,
            session.user.id
          );
          setUserState({ user: userData, loading: false, error: null });
        } catch (error) {
          setUserState({
            user: null,
            loading: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to fetch user data",
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const updateUser = async (updates: Partial<User>) => {
    if (!userState.user) return;

    try {
      setUserState((prev) => ({ ...prev, loading: true }));
      const updatedUser = await usersApi.update(
        supabase as any,
        userState.user.id,
        updates
      );
      setUserState({ user: updatedUser, loading: false, error: null });
    } catch (error) {
      setUserState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to update user",
      }));
    }
  };

  return {
    user: userState.user,
    loading: userState.loading,
    error: userState.error,
    updateUser,
  };
};
