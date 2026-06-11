"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { IdeaXchangeLogo } from "./IdeaXchangeLogo";
import { IDEAXCHANGE_MAGAZINE_PATH } from "@/lib/ideaxchange-constants";

const loginButtonClassName =
  "w-full cursor-pointer rounded-[var(--radius-full)] bg-[var(--color-brand-primary)] px-5 py-3 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-white transition-colors hover:bg-[var(--color-brand-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

export function IdeaXchangeLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const nextPath =
    searchParams.get("next")?.startsWith("/ideaxchange/magazine")
      ? searchParams.get("next")!
      : IDEAXCHANGE_MAGAZINE_PATH;

  async function signIn() {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ideaxchange/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ next: nextPath }),
      });
      const json = (await res.json()) as { redirect?: string; error?: string };
      if (!res.ok) throw new Error(json.error || "Login failed");
      router.push(json.redirect ?? IDEAXCHANGE_MAGAZINE_PATH);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[380px] rounded-lg border border-[#e2e8ee] bg-white px-8 py-10 shadow-[0_8px_30px_rgba(36,66,96,0.08)] sm:px-10">
      <IdeaXchangeLogo size="card" className="mb-8" />

      {error ? (
        <p
          role="alert"
          className="mb-4 rounded-md border border-[var(--color-border)] bg-[#f7faf9] px-3 py-2 text-xs leading-relaxed text-[var(--color-muted)]"
        >
          {error}
        </p>
      ) : null}

      <button type="button" className={loginButtonClassName} disabled={loading} onClick={signIn}>
        {loading ? "Signing in…" : "Login"}
      </button>
    </div>
  );
}
