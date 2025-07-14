"use client";

import { useState } from "react";
import { LogOutIcon } from "lucide-react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { logout } from "@/lib/actions/auth";

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoading(false);
    }
  };

  return (
    <DropdownItem
      onItemClick={handleLogout}
      className="flex items-center gap-3 px-3 py-2 font-medium text-red-500 rounded-lg group text-theme-sm hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-500/10 dark:hover:text-red-300"
    >
      <LogOutIcon size={25} />
      {isLoading ? "Logging out..." : "Logout"}
    </DropdownItem>
  );
}
