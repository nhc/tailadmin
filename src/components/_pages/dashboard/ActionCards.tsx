"use client";

import { tasksApi } from "@/lib/db/api/tasks";
import { useUser } from "@/lib/hooks/useUser";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import UserTasksView from "./UserTasksView";

type TaskSummary = {
  totalTasks: number;
  claimedTasks: number;
};

type DetailedTaskSummary = {
  created: Record<string, number>;
  assigned: Record<string, number>;
  totalCreated: number;
  totalAssigned: number;
};

export default function ActionCards() {
  const { user } = useUser();
  const [taskSummary, setTaskSummary] = useState<TaskSummary>({
    totalTasks: 0,
    claimedTasks: 0,
  });
  const [detailedSummary, setDetailedSummary] = useState<DetailedTaskSummary>({
    created: {},
    assigned: {},
    totalCreated: 0,
    totalAssigned: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskSummary = async () => {
      if (!user) return;

      try {
        const supabase = createClient();
        const summary = await tasksApi.getSummary(supabase, user.id);
        const detailed = await tasksApi.getDetailedSummary(supabase, user.id);
        setTaskSummary(summary);
        setDetailedSummary(detailed);
      } catch (error) {
        console.error("Failed to fetch task summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskSummary();
  }, [user]);

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
        <div className="col-span-1 border border-gray-200 rounded-lg p-4 my-6">
          <h2 className="text-lg font-bold">Tasks</h2>
          <div className="flex items-center justify-between font-bold">
            <div>Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "text-blue-600";
      case "claimed":
        return "text-yellow-600";
      case "delivered":
        return "text-purple-600";
      case "completed":
        return "text-green-600";
      case "disputed":
        return "text-red-600";
      case "cancelled":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open":
        return "Open";
      case "claimed":
        return "In Progress";
      case "delivered":
        return "Delivered";
      case "completed":
        return "Completed";
      case "disputed":
        return "Disputed";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="col-span-2">
        <UserTasksView taskType="open" />
      </div>
      <div className="col-span-1 border border-gray-200 rounded-lg p-4 my-6">
        <h2 className="text-lg font-bold mb-3">My Tasks</h2>

        {/* Created Tasks Summary */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Created ({detailedSummary.totalCreated})
          </h3>
          <div className="space-y-1">
            {Object.entries(detailedSummary.created).map(([status, count]) => (
              <div key={status} className="flex justify-between text-sm">
                <span className={getStatusColor(status)}>
                  {getStatusLabel(status)}
                </span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
            {Object.keys(detailedSummary.created).length === 0 && (
              <div className="text-sm text-gray-500">No tasks created</div>
            )}
          </div>
        </div>

        {/* Assigned Tasks Summary */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Assigned ({detailedSummary.totalAssigned})
          </h3>
          <div className="space-y-1">
            {Object.entries(detailedSummary.assigned).map(([status, count]) => (
              <div key={status} className="flex justify-between text-sm">
                <span className={getStatusColor(status)}>
                  {getStatusLabel(status)}
                </span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
            {Object.keys(detailedSummary.assigned).length === 0 && (
              <div className="text-sm text-gray-500">No tasks assigned</div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-evenly gap-2 mt-4 pt-3 border-t border-gray-200">
          <Link
            href="/dashboard/tasks/create"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Create task
          </Link>
          <Link
            href="/dashboard/tasks"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            View all tasks
          </Link>
        </div>
      </div>
    </div>
  );
}
