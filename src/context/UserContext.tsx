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

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const userData = useUser();

  const contextValue = {
    ...userData,
    isCoder: userData.user?.role === "coder",
    isViber: userData.user?.role === "viber",
    isAdmin: userData.user?.role === "admin",
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
