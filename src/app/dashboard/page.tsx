"use client";
import ActionCards from "@/components/_pages/dashboard/ActionCards";
import { useUser } from "@/lib/hooks/useUser";
import { useAuth } from "@/lib/hooks/useAuth";
import { useUserContext } from "@/context/UserContext";

export default function Dashboard() {
  const { user } = useUser();
  const { user: authUser } = useAuth();
  const { user: userData } = useUserContext();

  console.log(user, authUser, userData);
  return (
    <section>
      <div className="">
        Dashboard hello {user?.email} {user?.id}
      </div>
      <ActionCards />
    </section>
  );
}
