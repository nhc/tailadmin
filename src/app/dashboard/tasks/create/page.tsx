"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";
import { createTask } from "@/lib/actions/tasks";
import type { InsertTask } from "@/lib/db/api/types";
import {
  jobCategories,
  commonTechStack,
  techStackByCategory,
  commonBudgets,
  userCurrencies,
  createTaskFormBudgets,
} from "@/config/select-lists";
import InputField from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";
import Label from "@/components/form/Label";
import { Chip } from "@/components/ui/Chip";
import Button from "@/components/ui/button/Button";

export default function CreateTaskPage() {
  const { user, isViber } = useUserContext();
  const router = useRouter();

  // Get user's currency symbol
  const userCurrency = userCurrencies.find((c) => c.code === user?.currency) || userCurrencies[1]; // Default to USD

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    techStack: [] as string[],
    codeLink: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user is a viber
  if (!isViber) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Oops, something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              You don't have permission to access this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleTechStackToggle = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.includes(tech)
        ? prev.techStack.filter((t) => t !== tech)
        : [...prev.techStack, tech],
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 255) {
      newErrors.title = "Title must be less than 255 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 50) {
      newErrors.description = "Description must be at least 50 characters";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else {
      const priceNum = parseInt(formData.price);
      if (isNaN(priceNum) || priceNum <= 0) {
        newErrors.price = "Price must be a positive number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const taskData: InsertTask = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        price: parseInt(formData.price),
        tech_stack: formData.techStack,
        is_private: false,
        links: formData.codeLink ? { codeLink: formData.codeLink } : null,
        status: "open",
        status_timestamps: null,
        creator_id: "", // This will be set by the createTask action
        primary_assignee_id: null,
        code_link: formData.codeLink || null,
      };

      console.log("Submitting task data:", taskData);
      const result = await createTask(taskData);
      console.log("Task created successfully:", result);

      // Redirect to tasks page
      router.push("/dashboard/tasks/open");
    } catch (error) {
      console.error("Failed to create task:", error);
      setErrors({
        submit: error instanceof Error ? error.message : "Failed to create task. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = jobCategories.map((category) => ({
    value: category,
    label: category.charAt(0).toUpperCase() + category.slice(1),
  }));

  const budgetOptions = createTaskFormBudgets.map((budget) => ({
    value: budget.value,
    label: `${userCurrency.symbol}${budget.label}`,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Create New Task
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Fill out the details below to create a new task for coders to work on.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title">Task Title *</Label>
              <InputField
                id="title"
                name="title"
                type="text"
                placeholder="Enter a clear, descriptive title for your task"
                defaultValue={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                error={!!errors.title}
                hint={errors.title}
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description *</Label>
              <TextArea
                value={formData.description}
                onChange={(value) => handleInputChange("description", value)}
                placeholder="Provide detailed information about what needs to be done, requirements, and any specific instructions..."
                rows={6}
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
              )}
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Minimum 50 characters required.
              </p>
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                options={categoryOptions}
                placeholder="Select a category"
                onChange={(value) => handleInputChange("category", value)}
                defaultValue={formData.category}
              />
              {errors.category && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.category}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <Label htmlFor="price">Budget ({userCurrency.code}) *</Label>
              <Select
                options={budgetOptions}
                placeholder={`Select your budget in ${userCurrency.code}`}
                onChange={(value) => handleInputChange("price", value)}
                defaultValue={formData.price}
              />
              {errors.price && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.price}</p>
              )}
            </div>

            {/* Code Link */}
            <div>
              <Label htmlFor="codeLink">GitHub Repository / Code Link</Label>
              <InputField
                id="codeLink"
                name="codeLink"
                type="url"
                placeholder="https://github.com/username/repository or link to existing code"
                defaultValue={formData.codeLink}
                onChange={(e) => handleInputChange("codeLink", e.target.value)}
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Optional: Add a link to existing code, GitHub repository, or relevant resources
              </p>
            </div>

            {/* Tech Stack */}
            <div>
              <Label>Tech Stack</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Select all the technologies that will be needed for this task
              </p>

              {Object.entries(techStackByCategory).map(([category, techs]) => (
                <div key={category} className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
                    {category.replace("-", " ")}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {techs.map((tech) => (
                      <Chip
                        key={tech}
                        label={tech}
                        variant={formData.techStack.includes(tech) ? "selected" : "default"}
                        onClick={() => handleTechStackToggle(tech)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-600 dark:text-red-400">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                Cancel
              </Button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 inline-flex items-center justify-center font-medium gap-2 rounded-lg transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Creating..." : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
