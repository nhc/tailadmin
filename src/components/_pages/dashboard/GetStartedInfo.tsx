"use client";

import { useUserContext } from "@/context/UserContext";
import {
  UserIcon,
  ClockIcon,
  DollarSignIcon,
  CheckCircleIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

type ProfileStep = {
  icon: ReactNode;
  title: string;
  description: string;
  completed: boolean;
};

type JourneyStep = {
  number: number;
  title: string;
  description: string;
  cta?: ReactNode;
};

const CreateTaskButton = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/dashboard/tasks/create");
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 px-4 py-4 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors"
    >
      <PlusIcon className="w-4 h-4 !text-white " />
      Create Task
    </button>
  );
};

const SearchTasksButton = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/dashboard/search");
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 px-4 py-4 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors min-w-[150px]"
    >
      <SearchIcon className="w-4 h-4 !text-white " />
      Search Tasks
    </button>
  );
};

const ConnectStripeButton = () => {
  const router = useRouter();

  const handleClick = () => {
    alert("Coming soon");
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 px-4 py-4 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors min-w-[150px]"
    >
      <PlusIcon className="w-4 h-4 !text-white " />
      Connect Stripe
    </button>
  );
};

export const GetStartedInfo = () => {
  const { user, isViber, isCoder } = useUserContext();

  if (!user) return null;

  const profileSteps: ProfileStep[] = [
    {
      icon: <UserIcon className="w-5 h-5" />,
      title: "Complete your profile",
      description:
        "This takes 2 mins and it's important to let other users know things like your timezone.",
      completed: !!(user.nickname && user.timezone),
    },
    {
      icon: <DollarSignIcon className="w-5 h-5" />,
      title: "Set your currency",
      description: "We'll use this to display the value of tasks in your preferred currency.",
      completed: !!user.currency,
    },
  ];

  const viberSteps: JourneyStep[] = [
    // {
    //   number: 1,
    //   title: "Sign up as a Viber",
    //   description: "Complete your registration as a problem poster",
    // },
    {
      number: 1,
      title: "Post a new task",
      description: "Create a task with detailed problem information",
      cta: <CreateTaskButton />,
    },
    {
      number: 2,
      title: "Wait for coder to claim",
      description: "Coders will review and claim your task",
    },
    {
      number: 3,
      title: "Review submitted solution",
      description: "Evaluate the work delivered by the coder",
    },
    {
      number: 4,
      title: "Mark task as completed",
      description: "Approve the solution and release payment",
    },
  ];

  const coderSteps: JourneyStep[] = [
    // {
    //   number: 1,
    //   title: "Sign up as a Coder",
    //   description: "Complete your registration as a solution provider",
    // },
    {
      number: 1,
      title: "Search for available tasks",
      description: "Find tasks that match your skills and interests",
      cta: <SearchTasksButton />,
    },
    {
      number: 2,
      title: "Claim an interesting task",
      description: "Select and claim a task you want to work on",
    },
    {
      number: 3,
      title: "Connect your Stripe Connect Account",
      description: "Connect your Stripe account to receive payments",
      cta: <ConnectStripeButton />,
    },
    {
      number: 4,
      title: "Work on the solution",
      description: "Develop and implement the required solution",
    },
    {
      number: 5,
      title: "Submit completed work",
      description: "Deliver your solution for review and approval",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Completion Section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
          Complete Your Profile
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Get started with the platform by following the steps below.
        </p>

        <div className="space-y-4">
          {profileSteps.map((step, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-800"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  step.completed
                    ? "bg-success-50 text-success-500 dark:bg-success-500/10 dark:text-success-400"
                    : "bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {step.completed ? <CheckCircleIcon className="w-5 h-5" /> : step.icon}
              </div>
              <div className="flex-1">
                <h4
                  className={`font-medium ${
                    step.completed
                      ? "text-success-700 dark:text-success-400"
                      : "text-gray-800 dark:text-white/90"
                  }`}
                >
                  {step.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role-Specific Journey */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
          {isViber ? "Viber Journey" : "Coder Journey"}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {isViber
            ? "Get started as a Viber by following the steps below."
            : "Get started as a Coder by following the steps below."}
        </p>

        <div className="rounded-lg border border-gray-200 dark:border-gray-800">
          <ol className="flex flex-col">
            {(isViber ? viberSteps : coderSteps).map((step, index) => (
              <li
                key={index}
                className="flex items-start gap-4 border-b border-gray-200 px-4 py-4 last:border-b-0 dark:border-gray-800"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-500 text-sm font-semibold dark:bg-brand-500/10 dark:text-brand-400">
                  {step.number}
                </div>
                <div className="flex-1 flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white/90">{step.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {step.description}
                    </p>
                  </div>
                  {step.cta && <div className="ml-4 flex-shrink-0">{step.cta}</div>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default GetStartedInfo;
