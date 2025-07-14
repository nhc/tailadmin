import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import { EditProfileModal } from "@/components/user-profile/EditProfileModal";
import { useServerUser } from "@/lib/hooks/useServerUser";

export default async function Profile() {
  const { userData: user, error } = await useServerUser();

  if (error) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
            Error Loading Profile
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex items-center justify-between mb-5 lg:mb-7">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Profile</h3>
          <EditProfileModal user={user} />
        </div>
        <div className="space-y-6">
          <UserMetaCard user={user} />
          <UserInfoCard user={user} />
          {/* <UserAddressCard /> */}
        </div>
      </div>
    </div>
  );
}
