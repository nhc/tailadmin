import React from "react";
import { CloseIcon } from "@/icons";

type ChipProps = {
  label: string;
  onRemove?: () => void;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "selected" | "removable";
};

export const Chip: React.FC<ChipProps> = ({
  label,
  onRemove,
  selected = false,
  onClick,
  className = "",
  variant = "default",
}) => {
  const baseClasses =
    "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 cursor-pointer";

  const variantClasses = {
    default: "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600",
    selected:
      "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-900 dark:text-white dark:hover:bg-blue-800",
    removable:
      "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-900 dark:text-white dark:hover:bg-blue-800",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <div className={classes} onClick={onClick}>
      <span>{label}</span>
      {variant === "removable" && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 text-white hover:bg-blue-600 dark:text-white dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors duration-200"
        >
          <CloseIcon className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};
