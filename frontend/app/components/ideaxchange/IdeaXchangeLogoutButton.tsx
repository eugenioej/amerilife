"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IDEAXCHANGE_LOGIN_PATH } from "@/lib/ideaxchange-constants";

const buttonClassName =
  "text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60";

type IdeaXchangeLogoutButtonProps = {
  className?: string;
  microsoftAuthEnabled?: boolean;
};

export function IdeaXchangeLogoutButton({
  className,
  microsoftAuthEnabled = false,
}: IdeaXchangeLogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logoutLegacy() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ideaxchange/logout", { method: "POST" });
      const json = (await res.json()) as { redirect?: string };
      if (!res.ok) throw new Error("Logout failed");
      router.push(json.redirect ?? IDEAXCHANGE_LOGIN_PATH);
      router.refresh();
    } catch {
      setLoading(false);
    }
  }

  async function logoutMicrosoft() {
    if (loading) return;
    setLoading(true);
    try {
      await signOut({ redirectTo: IDEAXCHANGE_LOGIN_PATH });
    } catch {
      setLoading(false);
    }
  }

  if (microsoftAuthEnabled) {
    return (
      <button
        type="button"
        className={`${className ?? buttonClassName} underline-offset-4 cursor-pointer text-sm font-medium text-white hover:text-[var(--color-link-hover)] hover:!underline transition-colors`}
        disabled={loading}
        onClick={logoutMicrosoft}
      >
        {loading ? "Signing out…" : "Log out"}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`${className ?? buttonClassName} underline-offset-4 cursor-pointer text-sm font-medium text-white hover:text-[var(--color-link-hover)] hover:!underline transition-colors`}
      disabled={loading}
      onClick={logoutLegacy}
    >
      {loading ? "Signing out…" : "Log out"}
    </button>
  );
}
