"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import {
  SettingsIcon,
  HelpCircleIcon,
  CircleUserRoundIcon,
  UserRoundIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";
import { LogoutButton } from "../auth/logout-button";
import { useUserContext } from "@/context/UserContext";
import Badge from "../ui/badge/Badge";

export default function UserDropdown() {
  const { user } = useUserContext();

  const [isOpen, setIsOpen] = useState(false);

  const userName = user?.name || user?.email;
  const avatarUrl = user?.avatar_url || null;

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center dropdown-toggle text-gray-700 dark:text-gray-400 dropdown-toggle"
      >
        <span className="mr-3 overflow-hidden rounded-full h-8 w-8">
          {avatarUrl ? (
            <Image
              alt="User Avatar"
              className="w-8 h-8 rounded-full"
              height={250}
              src={avatarUrl}
              width={250}
            />
          ) : (
            <CircleUserRoundIcon size={25} strokeWidth={2} />
          )}
        </span>

        <span className="block mr-1 font-medium text-theme-sm">{user?.name}</span>

        {isOpen ? <ChevronUpIcon size={20} /> : <ChevronDownIcon size={20} />}
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div>
          <div className="flex items-center justify-between gap-2 font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            <span>{userName}</span> <Badge>{user?.role}</Badge>
          </div>
          <div className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {user?.email}
          </div>
        </div>

        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/dashboard/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <UserRoundIcon size={25} strokeWidth={2} />
              Edit profile
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="#"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <SettingsIcon size={25} />
              Account settings
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/support"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <HelpCircleIcon size={25} />
              Support
            </DropdownItem>
          </li>
        </ul>

        <div className="flex flex-col mt-2">
          <LogoutButton />
        </div>
      </Dropdown>
    </div>
  );
}
