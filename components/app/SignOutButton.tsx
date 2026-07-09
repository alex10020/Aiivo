"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { browserClient } from "@/lib/engine/supabase-browser";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await browserClient()?.auth.signOut();
        router.push("/");
        router.refresh();
      }}
      className="label flex items-center gap-2 transition-colors hover:text-ink"
    >
      <LogOut className="h-3.5 w-3.5" />
      Sign out
    </button>
  );
}
