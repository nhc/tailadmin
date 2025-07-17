import React from "react";
import Badge from "../ui/badge/Badge";
import type { User } from "@/lib/db/api/types";

type UserInfoCardProps = {
  user: User | null;
};

export default function UserInfoCard({ user }: UserInfoCardProps) {
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div>
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
          Personal Information
        </h4>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Email address
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">{user.email}</p>
          </div>

          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Nickname</p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {user.nickname || "Not set"}
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Stripe Connect Enabled?
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              <Badge color="primary">{user.stripe_account_id ? "Yes" : "No"}</Badge>
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Bio</p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {user.bio || "Please add a bio to your profile"}
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Currency</p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {user.currency || "GBP"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
