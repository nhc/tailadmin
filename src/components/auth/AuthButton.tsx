import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export async function AuthButton() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-4">
      <span>Hey, {user.email}!</span>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-4">
      <a href="/auth/signin" className="text-blue-600 hover:underline">
        Sign in
      </a>
      <a href="/auth/signup" className="text-blue-600 hover:underline">
        Sign up
      </a>
    </div>
  );
}
