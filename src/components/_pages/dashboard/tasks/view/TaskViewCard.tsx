import { TaskActions } from "../TaskActions";
import { Task, TaskWithRelations } from "@/lib/db/api/types";
import { User } from "@/lib/db/api/types";
import { UserIcon, DollarSignIcon, TagIcon, ClockIcon } from "lucide-react";
import { formatDate, formatPrice } from "@/lib/utils/date-numbers";
import Badge from "@/components/ui/badge/Badge";

export const TaskViewCard = ({
  task,
  user,
  handleAction,
  onTaskUpdated,
}: {
  task: TaskWithRelations;
  user: User | null;
  handleAction?: (action: string) => void;
  onTaskUpdated?: (task: Task) => void;
}) => {
  const claimedBy = task.primary_assignee?.nickname || task.primary_assignee?.name;
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="">
        <div className="">
          {/* Creator Information */}
          <div className="">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Task Creator
            </h3>
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <UserIcon className="w-6 h-6 text-gray-600" />
              <div>
                <p className="font-medium text-gray-800 dark:text-white">
                  {task.creator.name || "Anonymous"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Member since {formatDate(user?.created_at || "")}
                </p>
              </div>
            </div>
          </div>

          {/* Task Header */}
          <div className="m-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">{task.title}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              {task.description}
            </p>
          </div>

          {/* Task Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Price */}
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <DollarSignIcon className="w-6 h-6 text-green-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Budget</p>
                <p className="text-xl font-bold text-green-600">{formatPrice(task.price)}</p>
              </div>
            </div>

            {/* Category */}
            <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <TagIcon className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
                <p className="text-xl font-bold text-blue-600 capitalize">{task.category}</p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-purple-600"></div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                <p className="text-xl font-bold text-purple-600">
                  <span className="capitalize">{task.status}</span>{" "}
                  {claimedBy ? `by ${claimedBy}` : ""}
                </p>
              </div>
            </div>

            {/* Created Date */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <ClockIcon className="w-6 h-6 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Posted</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white">
                  {formatDate(task.created_at)}
                </p>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          {task.tech_stack.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Required Knowledge
              </h3>
              <div className="flex flex-wrap gap-2">
                {task.tech_stack.map((tech, index) => (
                  <Badge key={index} color="info" size="md">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
