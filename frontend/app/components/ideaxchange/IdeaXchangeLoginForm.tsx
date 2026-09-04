"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IdeaXchangeLogo } from "./IdeaXchangeLogo";
import {
  IDEAXCHANGE_HOME_PATH,
  isIdeaxchangeReturnPath,
} from "@/lib/ideaxchange-constants";

const loginButtonClassName =
  "w-full cursor-pointer rounded-[var(--radius-full)] bg-[var(--color-brand-primary)] px-5 py-3 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-white transition-colors hover:bg-[var(--color-brand-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const microsoftButtonClassName =
  "w-full cursor-pointer rounded-[var(--radius-full)] border border-[#8c8c8c] bg-white px-5 py-3 text-sm font-bold text-[#5e5e5e] transition-colors hover:bg-[#f7f7f7] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const passwordInputClassName =
  "mb-4 w-full rounded-md border border-[#e2e8ee] bg-white px-3 py-2.5 text-sm text-[var(--color-fg)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20";

const AUTH_ERRORS: Record<string, string> = {
  AccessDenied: "Your Microsoft account is not authorized for ideaXchange.",
  OAuthSignin: "Could not start Microsoft sign-in. Please try again.",
  OAuthCallback: "Microsoft sign-in failed. Please try again.",
  Configuration: "Sign-in did not complete. Please try again.",
  Default: "Sign-in failed. Please try again.",
};

type IdeaXchangeLoginFormProps = {
  microsoftAuthEnabled?: boolean;
};

export function IdeaXchangeLoginForm({
  microsoftAuthEnabled = false,
}: IdeaXchangeLoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  const nextParam = searchParams.get("next");
  const nextPath =
    nextParam && isIdeaxchangeReturnPath(nextParam) ? nextParam : IDEAXCHANGE_HOME_PATH;

  const authErrorCode = searchParams.get("error");
  const authError =
    authErrorCode && AUTH_ERRORS[authErrorCode]
      ? AUTH_ERRORS[authErrorCode]
      : authErrorCode
        ? AUTH_ERRORS.Default
        : null;

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/csrf")
      .then((res) => {
        if (!res.ok) throw new Error("csrf");
        return res.json() as Promise<{ csrfToken?: string }>;
      })
      .then((data) => {
        if (!cancelled && typeof data.csrfToken === "string") {
          setCsrfToken(data.csrfToken);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not start Microsoft sign-in. Please refresh and try again.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function signInWithMicrosoft() {
    if (loading || !csrfToken) return;
    setLoading(true);
  }

  async function signInWithPassword(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ideaxchange/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, next: nextPath }),
      });
      const json = (await res.json()) as { redirect?: string; error?: string };
      if (!res.ok) {
        throw new Error(
          res.status === 401 ? "Incorrect password" : json.error || "Login failed",
        );
      }
      router.push(json.redirect ?? IDEAXCHANGE_HOME_PATH);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[380px] rounded-lg border border-[#e2e8ee] bg-white px-8 py-10 shadow-[0_8px_30px_rgba(36,66,96,0.08)] sm:px-10">
      <IdeaXchangeLogo size="card" className="mb-8" />

      {authError || error ? (
        <p
          role="alert"
          className="mb-4 rounded-md border border-[var(--color-border)] bg-[#f7faf9] px-3 py-2 text-xs leading-relaxed text-[var(--color-muted)]"
        >
          {authError ?? error}
        </p>
      ) : null}

      {microsoftAuthEnabled ? (
        <div className="space-y-4">
          <form
            action="/api/auth/signin/microsoft-entra-id"
            method="POST"
            onSubmit={signInWithMicrosoft}
          >
            <input type="hidden" name="csrfToken" value={csrfToken} />
            <input type="hidden" name="callbackUrl" value={nextPath} />
            <button
              type="submit"
              className={microsoftButtonClassName}
              disabled={loading || !csrfToken}
            >
              {loading ? "Redirecting…" : "Sign in with Microsoft"}
            </button>
          </form>
          <p className="text-center text-xs leading-relaxed text-[var(--color-muted)]">
            Use your AmeriLife Microsoft work account. Access is created automatically on your
            first sign-in.
          </p>
        </div>
      ) : (
        <form onSubmit={signInWithPassword}>
          <label htmlFor="ideaxchange-password" className="sr-only">
            Password
          </label>
          <input
            id="ideaxchange-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className={passwordInputClassName}
          />
          <button type="submit" className={loginButtonClassName} disabled={loading}>
            {loading ? "Signing in…" : "Login"}
          </button>
          <p className="mt-3 text-center text-xs text-[var(--color-muted)]">
            Development mode — Microsoft sign-in activates when Entra env vars are set.
          </p>
        </form>
      )}
    </div>
  );
}
