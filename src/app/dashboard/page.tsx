"use client";
import ActionCards from "@/components/_pages/dashboard/ActionCards";
import { useAuth } from "@/lib/hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <section>
      <div className="">
        Dashboard {user?.email} {user?.id}
      </div>
      <ActionCards />
    </section>
  );
}
