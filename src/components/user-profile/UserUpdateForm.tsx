"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { usersApi } from "@/lib/db/api/users";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";

export const UserUpdateForm = ({
  initialUser,
  onUpdate,
}: {
  initialUser: any;
  onUpdate?: () => void;
}) => {
  const [nickname, setNickname] = useState(initialUser?.nickname || "");
  const [bio, setBio] = useState(initialUser?.bio || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const updatedUser = await usersApi.update(supabase, initialUser.id, {
        nickname: nickname || null,
        bio: bio || null,
      });

      setSuccess(true);
      onUpdate?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nickname">Nickname</Label>
        <Input
          id="nickname"
          type="text"
          defaultValue={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Enter your nickname"
        />
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us about yourself"
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
        />
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      {success && (
        <div className="text-green-600 text-sm">
          Profile updated successfully!
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 rounded-lg transition"
      >
        {isLoading ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
};
