"use client";

import { useState } from "react";
import { TaskActions } from "@/components/_pages/dashboard/TaskActions";
import type { Task, User } from "@/lib/db/api/types";

// Mock data for testing
const mockUser: User = {
  id: "test-user-id",
  email: "test@example.com",
  name: "Test User",
  avatar_url: null,
  bio: null,
  role: "coder",
  stripe_account_id: null,
  onboarding_status: null,
  nickname: null,
  timezone: null,
  location: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const mockTask: Task & {
  creator: {
    id: string;
    name: string | null;
    email: string;
    avatar_url: string | null;
  };
  primary_assignee: {
    id: string;
    name: string | null;
    email: string;
    avatar_url: string | null;
  } | null;
} = {
  id: "test-task-id",
  title: "Test Task",
  description: "This is a test task for verifying task actions",
  tech_stack: ["React", "TypeScript"],
  price: 100,
  category: "frontend",
  links: null,
  creator_id: "creator-id",
  primary_assignee_id: null,
  is_private: false,
  status: "open",
  status_timestamps: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  creator: {
    id: "creator-id",
    name: "Task Creator",
    email: "creator@example.com",
    avatar_url: null,
  },
  primary_assignee: null,
};

export default function TestTaskActionsPage() {
  const [task, setTask] = useState(mockTask);
  const [actionLog, setActionLog] = useState<string[]>([]);

  const handleAction = (action: string, taskId: string) => {
    const logEntry = `${new Date().toLocaleTimeString()}: Action "${action}" triggered for task "${taskId}"`;
    setActionLog((prev) => [logEntry, ...prev.slice(0, 9)]); // Keep last 10 entries
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTask((prev) => ({ ...prev, ...updatedTask }));
    const logEntry = `${new Date().toLocaleTimeString()}: Task updated to status "${
      updatedTask.status
    }"`;
    setActionLog((prev) => [logEntry, ...prev.slice(0, 9)]);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Test Task Actions</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Display */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Current Task</h2>
          <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
            <h3 className="font-medium mb-2">{task.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{task.description}</p>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Status:</strong> {task.status}
              </div>
              <div>
                <strong>Price:</strong> ${task.price}
              </div>
              <div>
                <strong>Category:</strong> {task.category}
              </div>
              <div>
                <strong>Tech Stack:</strong> {task.tech_stack.join(", ")}
              </div>
            </div>
          </div>
        </div>

        {/* Action Log */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Action Log</h2>
          <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 h-64 overflow-y-auto">
            {actionLog.length === 0 ? (
              <p className="text-gray-500">No actions performed yet</p>
            ) : (
              <div className="space-y-2">
                {actionLog.map((log, index) => (
                  <div key={index} className="text-sm text-gray-700 dark:text-gray-300">
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Available Actions</h2>
        <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
          <TaskActions
            task={task}
            user={mockUser}
            onAction={handleAction}
            onTaskUpdated={handleTaskUpdated}
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Instructions</h2>
        <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            This page tests the task actions functionality. Click on any available action button to
            see:
          </p>
          <ul className="text-sm text-blue-800 dark:text-blue-200 mt-2 list-disc list-inside space-y-1">
            <li>The action being triggered (logged in the Action Log)</li>
            <li>The task status being updated (if the action is successful)</li>
            <li>New available actions based on the updated status</li>
          </ul>
          <p className="text-sm text-blue-800 dark:text-blue-200 mt-2">
            <strong>Note:</strong> This is a test environment. Actions will show loading states and
            error handling, but won't actually update the database.
          </p>
        </div>
      </div>
    </div>
  );
}
