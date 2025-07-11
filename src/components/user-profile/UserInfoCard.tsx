"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import Badge from "../ui/badge/Badge";
import { useUserContext } from "@/context/UserContext";

export default function UserInfoCard() {
  const { user } = useUserContext();
  const [userState, setUserState] = useState<typeof user | null>(null);

  useEffect(() => {
    if (user) {
      setUserState(user);
    }
  }, [user]);

  if (!userState) {
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
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {userState?.email}
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Nickname
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {userState?.nickname || "Not set"}
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Stripe Connect Enabled?
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              <Badge color="primary">
                {userState?.stripe_account_id ? "Yes" : "No"}
              </Badge>
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Bio
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {userState?.bio || "Please add a bio to your profile"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
