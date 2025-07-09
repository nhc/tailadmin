"use client";

import { useState } from "react";
import {
  Select,
  SelectItem,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Badge,
  Avatar,
  Button,
} from "@heroui/react";

import { commonBudgets, commonTools } from "@/config/content/select-lists";

type Task = {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  price: number;
  category: string;
  creator: {
    id: string;
    name: string | null;
    email: string;
    avatar_url: string | null;
  };
  created_at: string;
};

type HomePageTasksClientProps = {
  tasks: Task[];
  count: number;
};

export const HomePageTasksClient = ({
  tasks,
  count,
}: HomePageTasksClientProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTool, setSelectedTool] = useState<string>("");
  const [selectedBudget, setSelectedBudget] = useState<string>("");

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTool = !selectedTool || task.tech_stack.includes(selectedTool);
    const matchesBudget =
      !selectedBudget ||
      (selectedBudget === "Under $100" && task.price < 100) ||
      (selectedBudget === "$100-$500" &&
        task.price >= 100 &&
        task.price <= 500) ||
      (selectedBudget === "$500-$1000" &&
        task.price >= 500 &&
        task.price <= 1000) ||
      (selectedBudget === "Over $1000" && task.price > 1000);

    return matchesSearch && matchesTool && matchesBudget;
  });

  const handleClaimTask = (taskId: string) => {
    // TODO: Navigate to claim task page
    console.log("Claim task:", taskId);
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-background rounded-lg shadow-sm border border-border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <svg
                className="lucide lucide-search absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                className="flex h-10 bg-background text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm w-full px-4 py-2 pl-10 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              className="w-full"
              color="default"
              placeholder="Select a tool"
              selectedKeys={selectedTool ? [selectedTool] : []}
              variant="bordered"
              onSelectionChange={(keys) =>
                setSelectedTool(Array.from(keys)[0] as string)
              }
            >
              {commonTools.map((tool) => (
                <SelectItem key={tool}>{tool}</SelectItem>
              ))}
            </Select>

            <Select
              className="w-full"
              color="default"
              placeholder="Select a budget"
              selectedKeys={selectedBudget ? [selectedBudget] : []}
              variant="bordered"
              onSelectionChange={(keys) =>
                setSelectedBudget(Array.from(keys)[0] as string)
              }
            >
              {commonBudgets.map((budget) => (
                <SelectItem key={budget}>{budget}</SelectItem>
              ))}
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-foreground">
            Available tasks ({filteredTasks.length})
          </h3>
        </div>

        {filteredTasks.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={task.creator.name || task.creator.email}
                        size="sm"
                        src={task.creator.avatar_url || undefined}
                      />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {task.creator.name || task.creator.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(task.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <Badge color="primary" variant="flat">
                      ${task.price}
                    </Badge>
                  </div>
                </CardHeader>
                <CardBody className="pt-0">
                  <h4 className="text-lg font-semibold mb-2 line-clamp-2">
                    {task.title}
                  </h4>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {task.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    <Chip color="secondary" size="sm" variant="bordered">
                      {task.category}
                    </Chip>
                    {task.tech_stack.slice(0, 3).map((tech) => (
                      <Chip key={tech} size="sm" variant="bordered">
                        {tech}
                      </Chip>
                    ))}
                    {task.tech_stack.length > 3 && (
                      <Chip size="sm" variant="bordered">
                        +{task.tech_stack.length - 3} more
                      </Chip>
                    )}
                  </div>

                  <Button
                    className="w-full"
                    color="primary"
                    onClick={() => handleClaimTask(task.id)}
                  >
                    Claim Task
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg
                className="lucide lucide-search w-12 h-12 text-muted-foreground"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No tasks found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filters to find more tasks.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
