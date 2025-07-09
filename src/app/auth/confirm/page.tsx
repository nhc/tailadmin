"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeftIcon } from "@/icons";

export default function ConfirmPage() {
  const params = useSearchParams();
  const email = params.get("email");

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to home
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="text-center">
          <div className="mb-8">
            <div className="mx-auto mb-4 w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center dark:bg-brand-900/20">
              <svg
                className="w-8 h-8 text-brand-600 dark:text-brand-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Check your email
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              We've sent a confirmation link to{" "}
              <span className="font-medium text-gray-800 dark:text-white/90">
                {email}
              </span>
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Please check your email and click the confirmation link to
                complete your registration.
              </p>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>Didn't receive the email?</p>
              <ul className="mt-2 space-y-1 text-left">
                <li>• Check your spam folder</li>
                <li>• Make sure you entered the correct email address</li>
                <li>• Wait a few minutes for the email to arrive</li>
              </ul>
            </div>

            <div className="pt-4">
              <Link
                href="/auth/signin"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
              >
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
