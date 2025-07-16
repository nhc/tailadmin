"use client";

import { TaskActions } from "@/components/_pages/dashboard/tasks/TaskActions";
import type { Task, User } from "@/lib/db/api/types";

export default function StateMachineActionsPage() {
  // Test users with different roles
  const testUsers = {
    admin: {
      id: "admin-1",
      email: "admin@example.com",
      name: "Admin User",
      avatar_url:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
      bio: "System administrator",
      role: "admin" as const,
      stripe_account_id: null,
      onboarding_status: null,
      nickname: "admin",
      timezone: "UTC",
      location: "San Francisco, CA",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    viber: {
      id: "viber-1",
      email: "viber@example.com",
      name: "Viber User",
      avatar_url:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face",
      bio: "Task creator",
      role: "viber" as const,
      stripe_account_id: null,
      onboarding_status: null,
      nickname: "viber",
      timezone: "UTC",
      location: "New York, NY",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    coder: {
      id: "coder-1",
      email: "coder@example.com",
      name: "Coder User",
      avatar_url:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
      bio: "Task executor",
      role: "coder" as const,
      stripe_account_id: null,
      onboarding_status: null,
      nickname: "coder",
      timezone: "UTC",
      location: "Austin, TX",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
  };

  // Test tasks with different statuses and assignees
  const testTasks = {
    openTask: {
      id: "task-open-1",
      title: "Open Task - Website Development",
      description: "Create a responsive website using React and TypeScript",
      tech_stack: ["React", "TypeScript", "Tailwind CSS"],
      price: 500,
      category: "web-development",
      links: null,
      creator_id: testUsers.viber.id,
      primary_assignee_id: null,
      is_private: false,
      status: "open" as const,
      status_timestamps: null,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
      creator: {
        id: testUsers.viber.id,
        name: testUsers.viber.name,
        email: testUsers.viber.email,
        avatar_url: testUsers.viber.avatar_url,
      },
      primary_assignee: null,
    },
    claimedTask: {
      id: "task-claimed-1",
      title: "Claimed Task - Mobile App",
      description: "Build a cross-platform mobile app using Flutter",
      tech_stack: ["Flutter", "Dart", "Firebase"],
      price: 800,
      category: "mobile-development",
      links: null,
      creator_id: testUsers.viber.id,
      primary_assignee_id: testUsers.coder.id,
      is_private: false,
      status: "claimed" as const,
      status_timestamps: null,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
      creator: {
        id: testUsers.viber.id,
        name: testUsers.viber.name,
        email: testUsers.viber.email,
        avatar_url: testUsers.viber.avatar_url,
      },
      primary_assignee: {
        id: testUsers.coder.id,
        name: testUsers.coder.name,
        email: testUsers.coder.email,
        avatar_url: testUsers.coder.avatar_url,
      },
    },
    deliveredTask: {
      id: "task-delivered-1",
      title: "Delivered Task - API Development",
      description: "Create a RESTful API with authentication",
      tech_stack: ["Node.js", "Express", "PostgreSQL"],
      price: 600,
      category: "backend-development",
      links: null,
      creator_id: testUsers.viber.id,
      primary_assignee_id: testUsers.coder.id,
      is_private: false,
      status: "delivered" as const,
      status_timestamps: null,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
      creator: {
        id: testUsers.viber.id,
        name: testUsers.viber.name,
        email: testUsers.viber.email,
        avatar_url: testUsers.viber.avatar_url,
      },
      primary_assignee: {
        id: testUsers.coder.id,
        name: testUsers.coder.name,
        email: testUsers.coder.email,
        avatar_url: testUsers.coder.avatar_url,
      },
    },
    disputedTask: {
      id: "task-disputed-1",
      title: "Disputed Task - Database Design",
      description: "Design and implement a database schema",
      tech_stack: ["PostgreSQL", "Prisma", "TypeScript"],
      price: 400,
      category: "database-design",
      links: null,
      creator_id: testUsers.viber.id,
      primary_assignee_id: testUsers.coder.id,
      is_private: false,
      status: "disputed" as const,
      status_timestamps: null,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
      creator: {
        id: testUsers.viber.id,
        name: testUsers.viber.name,
        email: testUsers.viber.email,
        avatar_url: testUsers.viber.avatar_url,
      },
      primary_assignee: {
        id: testUsers.coder.id,
        name: testUsers.coder.name,
        email: testUsers.coder.email,
        avatar_url: testUsers.coder.avatar_url,
      },
    },
    completedTask: {
      id: "task-completed-1",
      title: "Completed Task - E-commerce Platform",
      description: "Build a full-stack e-commerce platform",
      tech_stack: ["Next.js", "Stripe", "PostgreSQL"],
      price: 1200,
      category: "full-stack-development",
      links: null,
      creator_id: testUsers.viber.id,
      primary_assignee_id: testUsers.coder.id,
      is_private: false,
      status: "completed" as const,
      status_timestamps: null,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
      creator: {
        id: testUsers.viber.id,
        name: testUsers.viber.name,
        email: testUsers.viber.email,
        avatar_url: testUsers.viber.avatar_url,
      },
      primary_assignee: {
        id: testUsers.coder.id,
        name: testUsers.coder.name,
        email: testUsers.coder.email,
        avatar_url: testUsers.coder.avatar_url,
      },
    },
  };

  const handleAction = (action: string, taskId: string) => {
    console.log(`Action "${action}" triggered for task "${taskId}"`);
    // In a real app, this would call an API to update the task status
    alert(`Action: ${action} for Task: ${taskId}`);
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Task Actions State Machine Demo</h1>

      {/* Admin User Scenarios */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-blue-600">Admin User Scenarios</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
            <h3 className="font-medium mb-2">Open Task (Admin View)</h3>
            <p className="text-sm text-gray-600 mb-3">{testTasks.openTask.title}</p>
            <TaskActions task={testTasks.openTask} user={testUsers.admin} onAction={handleAction} />
          </div>

          <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
            <h3 className="font-medium mb-2">Claimed Task (Admin View)</h3>
            <p className="text-sm text-gray-600 mb-3">{testTasks.claimedTask.title}</p>
            <TaskActions
              task={testTasks.claimedTask}
              user={testUsers.admin}
              onAction={handleAction}
            />
          </div>

          <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
            <h3 className="font-medium mb-2">Delivered Task (Admin View)</h3>
            <p className="text-sm text-gray-600 mb-3">{testTasks.deliveredTask.title}</p>
            <TaskActions
              task={testTasks.deliveredTask}
              user={testUsers.admin}
              onAction={handleAction}
            />
          </div>

          <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
            <h3 className="font-medium mb-2">Disputed Task (Admin View)</h3>
            <p className="text-sm text-gray-600 mb-3">{testTasks.disputedTask.title}</p>
            <TaskActions
              task={testTasks.disputedTask}
              user={testUsers.admin}
              onAction={handleAction}
            />
          </div>

          <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
            <h3 className="font-medium mb-2">Completed Task (Admin View)</h3>
            <p className="text-sm text-gray-600 mb-3">{testTasks.completedTask.title}</p>
            <TaskActions
              task={testTasks.completedTask}
              user={testUsers.admin}
              onAction={handleAction}
            />
          </div>
        </div>
      </div>

      {/* Viber User Scenarios */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-green-600">Viber User Scenarios</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
            <h3 className="font-medium mb-2">Open Task (Viber View)</h3>
            <p className="text-sm text-gray-600 mb-3">{testTasks.openTask.title}</p>
            <TaskActions task={testTasks.openTask} user={testUsers.viber} onAction={handleAction} />
          </div>

          <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
            <h3 className="font-medium mb-2">Delivered Task (Viber View)</h3>
            <p className="text-sm text-gray-600 mb-3">{testTasks.deliveredTask.title}</p>
            <TaskActions
              task={testTasks.deliveredTask}
              user={testUsers.viber}
              onAction={handleAction}
            />
          </div>
        </div>
      </div>

      {/* Coder User Scenarios */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-purple-600">Coder User Scenarios</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
            <h3 className="font-medium mb-2">Open Task (Coder View)</h3>
            <p className="text-sm text-gray-600 mb-3">{testTasks.openTask.title}</p>
            <TaskActions task={testTasks.openTask} user={testUsers.coder} onAction={handleAction} />
          </div>

          <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
            <h3 className="font-medium mb-2">Claimed Task (Coder View - As Assignee)</h3>
            <p className="text-sm text-gray-600 mb-3">{testTasks.claimedTask.title}</p>
            <TaskActions
              task={testTasks.claimedTask}
              user={testUsers.coder}
              onAction={handleAction}
            />
          </div>

          <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
            <h3 className="font-medium mb-2">Disputed Task (Coder View - As Assignee)</h3>
            <p className="text-sm text-gray-600 mb-3">{testTasks.disputedTask.title}</p>
            <TaskActions
              task={testTasks.disputedTask}
              user={testUsers.coder}
              onAction={handleAction}
            />
          </div>
        </div>
      </div>

      {/* No User Scenario */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-600">No User Scenario</h2>

        <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
          <h3 className="font-medium mb-2">Task with No User (Should Show Nothing)</h3>
          <p className="text-sm text-gray-600 mb-3">{testTasks.openTask.title}</p>
          <TaskActions task={testTasks.openTask} user={null} onAction={handleAction} />
        </div>
      </div>
    </div>
  );
}
