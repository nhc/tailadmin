"use client";
import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import Label from "../form/Label";
import { useAuth } from "@/lib/hooks/useAuth";
import Badge from "../ui/badge/Badge";
import { useUserContext } from "@/context/UserContext";
import { PencilIcon } from "lucide-react";

export default function UserInfoCard() {
  const { user, updateUser } = useUserContext();
  const { isOpen, openModal, closeModal } = useModal();

  const [userState, setUserState] = useState<typeof user | null>(null);
  const [bioValue, setBioValue] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!userState) return;

    setIsSaving(true);
    try {
      await updateUser({ bio: bioValue });
      closeModal();
    } catch (error) {
      console.error("Failed to update bio:", error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (user) {
      setUserState(user);
      setBioValue(user.bio || "");
    }
  }, [user]);

  if (!userState) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userState?.name}
              </p>
            </div>

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

        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto lg:min-w-[140px]"
        >
          <PencilIcon size={18} strokeWidth={2} />
          Edit Bio
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] m-4">
        <div className="no-scrollbar relative w-full max-w-[500px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Bio
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your bio to tell others about yourself.
            </p>
          </div>

          <div className="px-2">
            <div className="mb-6">
              <Label>Bio</Label>
              <TextArea
                value={bioValue || ""}
                onChange={(value) => setBioValue(value)}
                placeholder="Tell us about yourself..."
                rows={10}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Bio"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
