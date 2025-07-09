import { NetworkIcon } from "lucide-react";
import Link from "next/link";

export default function Last20Logo({ to = "/" }: { to?: string }) {
  return (
    <Link href={to} className="flex items-center gap-2 w-full justify-center">
      <NetworkIcon size={35} className="!text-black/90 dark:!text-white" />
      <span className="text-xl font-bold !text-black/90 dark:!text-white">
        Last20
      </span>
    </Link>
  );
}
