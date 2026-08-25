"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { IdeaxchangeDevViewMode } from "@/lib/ideaxchange-dev";
import { isIdeaxchangePath } from "@/lib/ideaxchange-nav";

type Props = {
  initialMode: IdeaxchangeDevViewMode;
};

const OPTIONS: { value: IdeaxchangeDevViewMode; label: string; hint: string }[] = [
  { value: "all", label: "Both", hint: "All nav links + all routes" },
  { value: "brokerage", label: "Brokerage", hint: "Sales leaderboard, carrier, etc." },
  { value: "career", label: "Career", hint: "Recruiting + Piper leaderboard" },
];

export function IdeaxchangeDevViewSwitcher({ initialMode }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [mode, setMode] = useState<IdeaxchangeDevViewMode>(initialMode);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onChange = (next: IdeaxchangeDevViewMode) => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/ideaxchange/dev-view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode: next }),
        });
        if (!res.ok) {
          setError("Could not save dev view");
          return;
        }
        setMode(next);
        router.refresh();
      } catch {
        setError("Could not save dev view");
      }
    });
  };

  if (!isIdeaxchangePath(pathname)) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-[var(--z-header)] max-w-[min(100vw-2rem,22rem)] rounded-lg border border-amber-300 bg-amber-50 px-3 py-3 shadow-lg"
      role="region"
      aria-label="Developer persona preview"
    >
      <p className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
        Dev preview
      </p>
      <p className="mt-1 text-xs text-amber-950/80">Switch ideaXchange audience view</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {OPTIONS.map((option) => {
          const active = mode === option.value;
          return (
            <button
              key={option.value}
              type="button"
              disabled={pending}
              title={option.hint}
              onClick={() => onChange(option.value)}
              className={`rounded-sm px-2.5 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                active
                  ? "bg-amber-700 text-white"
                  : "bg-white text-amber-900 ring-1 ring-amber-300 hover:bg-amber-100"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {error ? <p className="mt-2 text-xs text-red-700">{error}</p> : null}
    </div>
  );
}
