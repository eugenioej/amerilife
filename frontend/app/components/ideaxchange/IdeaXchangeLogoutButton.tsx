"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { IDEAXCHANGE_LOGIN_PATH } from "@/lib/ideaxchange-constants";
import { signOutIdeaxchange } from "./ideaxchange-auth-actions";

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

  if (microsoftAuthEnabled) {
    return (
      <form action={signOutIdeaxchange}>
        <button type="submit" className={className ?? buttonClassName} disabled={loading}>
          {loading ? "Signing out…" : "Log out"}
        </button>
      </form>
    );
  }

  return (
    <button
      type="button"
      className={className ?? buttonClassName}
      disabled={loading}
      onClick={logoutLegacy}
    >
      {loading ? "Signing out…" : "Log out"}
    </button>
  );
}
