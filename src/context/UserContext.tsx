"use client";

import { createContext, useContext, ReactNode } from "react";
import { useUser } from "@/lib/hooks/useUser";
import type { User } from "@/lib/db/api/types";

type UserContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  updateUser: (updates: Partial<User>) => Promise<void>;
  isCoder: boolean;
  isViber: boolean;
  isAdmin: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ user, children }: { user: User | null; children: ReactNode }) => {
  const contextValue: UserContextType = {
    user,
    isCoder: user?.role === "coder",
    isViber: user?.role === "viber",
    isAdmin: user?.role === "admin",
    loading: false,
    error: null,
    updateUser: async () => {},
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
