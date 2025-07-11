"use client";
import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import { Metadata } from "next";
import React, { useEffect, useState } from "react";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Input from "@/components/form/input/InputField";
import { useUserContext } from "@/context/UserContext";
import { PencilIcon } from "lucide-react";
import { timezones } from "@/config/select-lists";

export default function Profile() {
  const { user, updateUser } = useUserContext();
  const { isOpen, openModal, closeModal } = useModal();

  const [userState, setUserState] = useState<typeof user | null>(null);
  const [bioValue, setBioValue] = useState<string | null>(null);
  const [nicknameValue, setNicknameValue] = useState<string | null>(null);
  const [timezoneValue, setTimezoneValue] = useState<string | null>(null);
  const [locationValue, setLocationValue] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!userState) return;

    setIsSaving(true);
    try {
      await updateUser({
        bio: bioValue,
        nickname: nicknameValue,
        timezone: timezoneValue,
        location: locationValue,
      });
      closeModal();
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (user) {
      setUserState(user);
      setBioValue(user.bio || "");
      setNicknameValue(user.nickname || "");
      setTimezoneValue(user.timezone || "");
      setLocationValue(user.location || "");
    }
  }, [user]);

  const timezoneOptions = timezones.map((tz) => ({
    value: tz.value,
    label: `${tz.code} (${tz.value})`,
  }));

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex items-center justify-between mb-5 lg:mb-7">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Profile
          </h3>
          <button
            onClick={openModal}
            className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            <PencilIcon size={18} strokeWidth={2} />
            Edit Profile
          </button>
        </div>
        <div className="space-y-6">
          <UserMetaCard />
          <UserInfoCard />
          {/* <UserAddressCard /> */}
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] m-4">
        <div className="no-scrollbar relative w-full max-w-[500px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Profile
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your profile information.
            </p>
          </div>

          <div className="px-2">
            <div className="mb-6">
              <Label>Nickname</Label>
              <Input
                type="text"
                placeholder="Enter your nickname"
                defaultValue={nicknameValue || ""}
                onChange={(e) => setNicknameValue(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <Label>Bio</Label>
              <TextArea
                value={bioValue || ""}
                onChange={(value) => setBioValue(value)}
                placeholder="Tell us about yourself..."
                rows={6}
              />
            </div>

            <div className="mb-6">
              <Label>Location</Label>
              <Input
                type="text"
                placeholder="Enter your location (e.g., United States, United Kingdom)"
                defaultValue={locationValue || ""}
                onChange={(e) => setLocationValue(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <Label>Timezone</Label>
              <Select
                options={timezoneOptions}
                placeholder="Select your timezone"
                onChange={(value) => setTimezoneValue(value)}
                defaultValue={timezoneValue || ""}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
