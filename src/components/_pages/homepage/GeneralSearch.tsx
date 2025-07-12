"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { tasksApi } from "@/lib/db/api";
import type { Task, TaskStatus } from "@/lib/db/api/types";
import { commonTechStack, commonBudgets } from "@/config/select-lists";
import Badge from "@/components/ui/badge/Badge";
import {
  SearchIcon,
  DollarSignIcon,
  TagIcon,
  ClockIcon,
  UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

type TaskWithRelations = Task & {
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
};

export default function GeneralSearch({
  showSearch = true,
  showAllOpenTasks = false,
  ctaComponent,
  context = "homepage",
}: {
  showSearch?: boolean;
  showAllOpenTasks?: boolean;
  ctaComponent?: React.ReactNode;
  context?: "homepage" | "dashboard";
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTech, setSelectedTech] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [tasks, setTasks] = useState<TaskWithRelations[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (showAllOpenTasks) {
      handleAllOpenTasks();
    }
  }, [showAllOpenTasks]);

  const handleSearch = async (customFilters?: {
    status?: TaskStatus;
    techStack?: string[];
    minPrice?: number;
    maxPrice?: number;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      // Build filters based on search criteria
      const filters: {
        status?: TaskStatus;
        techStack?: string[];
        minPrice?: number;
        maxPrice?: number;
      } = customFilters || {
        status: "open" as TaskStatus, // Only show open tasks
      };

      // If no custom filters, use form values
      if (!customFilters) {
        if (selectedTech) {
          filters.techStack = [selectedTech];
        }

        if (selectedBudget) {
          const [min, max] = selectedBudget.split("-").map(Number);
          if (max) {
            filters.minPrice = min;
            filters.maxPrice = max;
          } else {
            filters.minPrice = min;
          }
        }
      }

      const { data } = await tasksApi.getAll(supabase, filters);
      let filteredTasks = data || [];

      // Apply text search if query exists and no custom filters
      if (searchQuery.trim() && !customFilters) {
        filteredTasks = filteredTasks.filter(
          (task) =>
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            task.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Add a minimum delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 500));
      setTasks(filteredTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleAllOpenTasks = () => {
    setSearchQuery("");
    setSelectedTech("");
    setSelectedBudget("");
    handleSearch({ status: "open" as TaskStatus });
  };

  const handlePopularTasks = async () => {
    setSearchQuery("");
    setSelectedTech("");
    setSelectedBudget("");
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      // Get all open tasks and sort by price (higher first)
      const { data } = await tasksApi.getAll(supabase, {
        status: "open" as TaskStatus,
      });

      // Sort by price (highest first) to show "popular" high-value tasks
      const sortedTasks = (data || []).sort((a, b) => b.price - a.price);

      setTasks(sortedTasks);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch popular tasks"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Search Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Help out a viber and start earning
          </h2>
          {showSearch && (
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Search through our tasks and find the perfect one for you.
            </p>
          )}
        </div>

        {/* Search Form */}
        {showSearch && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Input */}
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search tasks by title, description, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              {/* Tech Stack Filter */}
              <div>
                <select
                  value={selectedTech}
                  onChange={(e) => setSelectedTech(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Technologies</option>
                  {commonTechStack.map((tech) => (
                    <option key={tech} value={tech}>
                      {tech}
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget Filter */}
              <div>
                <select
                  value={selectedBudget}
                  onChange={(e) => setSelectedBudget(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Budgets</option>
                  {commonBudgets.map((budget) => (
                    <option key={budget} value={budget}>
                      ${budget}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Buttons */}
            <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => handleSearch()}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                {loading ? "Searching..." : "Search Tasks"}
              </button>

              <button
                onClick={handleAllOpenTasks}
                disabled={loading}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                All Open Tasks
              </button>

              <button
                onClick={handlePopularTasks}
                disabled={loading}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Popular Tasks
              </button>
            </div>
          </div>
        )}

        {/* Search Results */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
              />
            ))}
          </div>
        )}

        {!loading && tasks.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                Found {tasks.length} task{tasks.length !== 1 ? "s" : ""}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  {/* Task Header */}
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2">
                      {task.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      {task.description}
                    </p>
                  </div>

                  {/* Task Details */}
                  <div className="space-y-3">
                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <DollarSignIcon className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-green-600">
                        {formatPrice(task.price)}
                      </span>
                    </div>

                    {/* Category */}
                    <div className="flex items-center gap-2">
                      <TagIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {task.category}
                      </span>
                    </div>

                    {/* Tech Stack */}
                    {task.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {task.tech_stack.slice(0, 3).map((tech, index) => (
                          <Badge key={index} color="info" size="sm">
                            {tech}
                          </Badge>
                        ))}
                        {task.tech_stack.length > 3 && (
                          <Badge color="light" size="sm">
                            +{task.tech_stack.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Created Date */}
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Posted {formatDate(task.created_at)}
                      </span>
                    </div>

                    {/* Creator */}
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        by {task.creator.name || task.creator.email}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {ctaComponent || (
                      <button
                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                        onClick={() => {
                          router.push("/dashboard/tasks/" + task.id);
                        }}
                      >
                        View Details
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && tasks.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <SearchIcon className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              No tasks found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search criteria or browse all available tasks
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
