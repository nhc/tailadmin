"use client";

import { useState } from "react";
import { useActiveMenu } from "@/hooks/useActiveMenu";

const TestActiveMenuPage = () => {
  const [activePath, setActivePath] = useState("/dashboard/tasks/open");

  // Use the hook to set the active menu item
  useActiveMenu(activePath);

  const menuOptions = [
    { path: "/dashboard/tasks/open", label: "Open Tasks" },
    { path: "/dashboard/tasks/claimed", label: "Claimed Tasks" },
    { path: "/dashboard/tasks/inprogress", label: "In Progress Tasks" },
    { path: "/dashboard/tasks/delivered", label: "Delivered Tasks" },
    { path: "/dashboard/tasks/completed", label: "Completed Tasks" },
    { path: "/dashboard/tasks/disputed", label: "Disputed Tasks" },
    { path: "/dashboard/tasks/cancelled", label: "Cancelled Tasks" },
    { path: "/dashboard/search", label: "Task Search" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Test Active Menu Hook
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This page demonstrates how to use the <code>useActiveMenu</code> hook to set which menu
            item should be active in the sidebar. Try clicking the buttons below to see different
            menu items become active.
          </p>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Current Active Path:{" "}
              <span className="text-blue-600 dark:text-blue-400">{activePath}</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {menuOptions.map((option) => (
              <button
                key={option.path}
                onClick={() => setActivePath(option.path)}
                className={`px-4 py-3 rounded-lg border transition-colors duration-200 ${
                  activePath === option.path
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              How to use:
            </h3>
            <pre className="text-sm text-gray-600 dark:text-gray-400 overflow-x-auto">
              {`import { useActiveMenu } from "@/hooks/useActiveMenu";

const MyPage = () => {
  // Set the active menu item
  useActiveMenu("/dashboard/tasks/open");
  
  return <div>Your page content</div>;
};`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestActiveMenuPage;
