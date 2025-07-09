"use client";
import { useAuth } from "@/lib/hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();
  return <div className="text-white">Dashboard {user?.email}</div>;
}
