"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

export function HeaderSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
      setOpen(false);
      setQuery("");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded text-[var(--color-fg)] transition-colors hover:text-[var(--color-brand-primary)]"
        aria-label="Search"
      >
        <SearchIcon />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          className="fixed inset-0 z-[var(--z-drawer)]"
        >
          <div
            className="absolute inset-0 bg-black/50"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-0 flex items-start justify-center pt-[15vh] px-4">
            <div
              className="w-full max-w-xl rounded-lg bg-white p-4 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSubmit} className="flex gap-3">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-muted)]" />
                  <input
                    ref={inputRef}
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full rounded-md border border-[var(--color-border)] py-3 pl-10 pr-4 text-[var(--color-fg)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20"
                    autoComplete="off"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-md bg-[var(--color-brand-primary)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-brand-primary-hover)]"
                >
                  Search
                </button>
              </form>
              <p className="mt-3 text-sm text-[var(--color-muted)]">
                Press Escape to close
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
