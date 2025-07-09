"use client";

import { Button } from "@heroui/react";
import Link from "next/link";

import { useAuth } from "@/lib/hooks/useAuth";
import { ROUTES } from "@/config/routes";

export const HomeClient = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      {isAuthenticated ? (
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Welcome back, {user?.email}!</h1>
          <p className="text-lg text-foreground">
            You&apos;re logged in and ready to go.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href={ROUTES.DASHBOARD.ROOT}>
              <Button color="primary">Go to Dashboard</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Welcome to Last20</h1>
          <p className="text-lg text-foreground">
            Please sign in to access your account.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href={ROUTES.AUTH.LOGIN}>
              <Button variant="bordered">Sign In</Button>
            </Link>
            <Link href={ROUTES.AUTH.SIGN_UP}>
              <Button color="primary">Sign Up</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
