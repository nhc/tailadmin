"use client";

import Link from "next/link";

import { useUserContext } from "@/context/UserContext";
import { ROUTES } from "@/config/routes";

export const HomeClient = () => {
  const { user } = useUserContext();

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      {user ? (
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Welcome back, {user.email}!</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            You&apos;re logged in and ready to go.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href={ROUTES.DASHBOARD.ROOT}>
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200">
                Go to Dashboard
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Welcome to Last20</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Please sign in to access your account.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href={ROUTES.AUTH.LOGIN}>
              <button className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold rounded-lg transition-colors duration-200">
                Sign In
              </button>
            </Link>
            <Link href={ROUTES.AUTH.SIGN_UP_VIBER}>
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
