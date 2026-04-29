"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Facebook,
  Link2,
  Linkedin,
  Mail,
  Share2,
} from "lucide-react";

/** Minimal X (Twitter) mark — lucide dropped the Twitter icon in newer versions. */
function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    </svg>
  );
}

type Props = {
  url: string;
  title: string;
};

export function InsightSharePanel({ url, title }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [open]);

  const u = encodeURIComponent(url);
  const subjectEnc = encodeURIComponent(title);
  const bodyEnc = encodeURIComponent(`${title}\n\n${url}`);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard denied */
    }
  }, [url]);

  const shareItemClass =
    "flex cursor-pointer flex-col items-center gap-2 rounded-sm p-2 text-center transition-colors hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)] focus-visible:ring-offset-2";

  const iconWrapClass =
    "flex h-12 w-12 items-center justify-center text-[var(--color-fg)]";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-sm text-[var(--color-brand-dark)] transition-colors hover:bg-black/5 hover:text-[var(--color-brand-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)] focus-visible:ring-offset-2"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Share article"
      >
        <Share2 className="size-5" strokeWidth={2} aria-hidden />
      </button>

      {open ? (
        <div className="fixed inset-0 z-[var(--z-overlay)] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 cursor-pointer bg-black/50"
            aria-label="Close share dialog"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="insight-share-heading"
            className="relative z-[1] w-full max-w-md rounded-lg bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.15)]"
          >
            <h2
              id="insight-share-heading"
              className="mb-8 text-center font-sans text-lg font-bold leading-snug text-[var(--color-brand-dark)]"
            >
              Share With Your Network
            </h2>

            <div className="grid grid-cols-3 gap-4 sm:gap-6">
              <button type="button" onClick={copyLink} className={shareItemClass}>
                <span className={iconWrapClass}>
                  <Link2 className="size-8 stroke-[1.75]" aria-hidden />
                </span>
                <span className="text-xs font-medium text-[var(--color-fg)]">
                  {copied ? "Copied!" : "Copy Link"}
                </span>
              </button>

              <a
                href={`mailto:?subject=${subjectEnc}&body=${bodyEnc}`}
                className={shareItemClass}
              >
                <span className={iconWrapClass}>
                  <Mail className="size-8 stroke-[1.75]" aria-hidden />
                </span>
                <span className="text-xs font-medium text-[var(--color-fg)]">
                  Email
                </span>
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${u}`}
                target="_blank"
                rel="noopener noreferrer"
                className={shareItemClass}
              >
                <span className={iconWrapClass}>
                  <Facebook className="size-8" strokeWidth={1.5} aria-hidden />
                </span>
                <span className="text-xs font-medium text-[var(--color-fg)]">
                  Facebook
                </span>
              </a>
            </div>

            <div className="mt-6 flex justify-center gap-10 sm:gap-14">
              <a
                href={`https://twitter.com/intent/tweet?url=${u}&text=${subjectEnc}`}
                target="_blank"
                rel="noopener noreferrer"
                className={shareItemClass}
              >
                <span className={iconWrapClass}>
                  <XLogo className="size-7" />
                </span>
                <span className="text-xs font-medium text-[var(--color-fg)]">
                  Twitter
                </span>
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`}
                target="_blank"
                rel="noopener noreferrer"
                className={shareItemClass}
              >
                <span className={iconWrapClass}>
                  <Linkedin className="size-8" strokeWidth={1.5} aria-hidden />
                </span>
                <span className="text-xs font-medium text-[var(--color-fg)]">
                  Linkedin
                </span>
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
