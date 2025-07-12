"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export function LogoutButton() {
  const router = useRouter();

  // Create Supabase client once
  const supabase = useMemo(() => createClient(), []);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/?logout=true");
  };

  return (
    <button onClick={logout} className="text-red-500 border">
      Logout
    </button>
  );
}
