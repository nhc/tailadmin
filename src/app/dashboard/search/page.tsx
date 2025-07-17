import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import { Tooltip } from "@/components/ui/tooltip/Tooltip";
import { Metadata } from "next";
import React from "react";
import { InfoIcon } from "lucide-react";
import GeneralSearch from "@/components/_pages/homepage/GeneralSearch";
import Button from "@/components/ui/button/Button";

export default function Search() {
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h2 className="mr-2">Search</h2>
        {/* <p className="text-sm">
          This feature is coming soon. All the tasks and jobs will be searchable
          here.
        </p> */}

        <div className="space-y-6 mt-6">
          <GeneralSearch showSearch={false} showAllOpenTasks={true} context="dashboard" />
        </div>
      </div>
    </div>
  );
}
