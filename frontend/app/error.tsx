"use client";

import { useEffect } from "react";
import Link from "next/link";
import { LayoutShell } from "@/app/components/layout/LayoutShell";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to your error monitoring service here (e.g. Sentry)
    console.error("[app/error]", error);
  }, [error]);

  return (
    <LayoutShell>
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-16 lg:py-24">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-[var(--color-brand-dark)] sm:text-5xl">
            Something went wrong
          </h1>
          <p className="mt-4 text-xl font-semibold text-[var(--color-fg)]">
            We hit an unexpected error
          </p>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-muted)]">
            Sorry about that — our team has been notified. You can try again or
            return to the homepage.
          </p>
          {error.digest && (
            <p className="mt-3 text-sm text-[var(--color-muted)]">
              Error ID: <code className="font-mono">{error.digest}</code>
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={reset}
              className="inline-flex items-center rounded-md bg-[var(--color-brand-primary)] px-6 py-3 font-semibold text-white transition-colors hover:bg-[var(--color-brand-primary-hover)]"
            >
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex items-center rounded-md border border-[var(--color-brand-primary)] px-6 py-3 font-semibold text-[var(--color-brand-primary)] transition-colors hover:bg-[var(--color-brand-primary)]/10"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </LayoutShell>
  );
}
