import { useServerUser } from "@/lib/hooks/useServerUser";
import Badge from "../ui/badge/Badge";

export async function ServerUserInfoCard() {
  const { authUser, userData, error } = await useServerUser();

  if (error || !authUser) {
    return <div>Not authenticated</div>;
  }

  const user = userData || {
    email: authUser.email,
    nickname: null,
    stripe_account_id: null,
  };

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

          {userData && (
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Role</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                <Badge color="info">{userData.role}</Badge>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
