"use client";

import { useEffect } from "react";
import { GravityForm } from "@/app/components/gravity-forms/GravityForm";
import { Link } from "@/app/components/ui/Link";
import type { GfFormData } from "@/lib/gf-types";

const OFFICE_ADDRESS_LINES = ["2650 McCormick Drive", "Clearwater, FL 33759"] as const;
const OFFICE_ADDRESS_QUERY = "2650 McCormick Drive, Clearwater, FL 33759";

const OFFICE_MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(OFFICE_ADDRESS_QUERY);

/** Google Maps embed (no API key; `output=embed` search iframe). */
const OFFICE_MAP_EMBED_URL =
  "https://maps.google.com/maps?q=" +
  encodeURIComponent(OFFICE_ADDRESS_QUERY) +
  "&t=&z=16&ie=UTF8&iwloc=&output=embed";

type ContactFormDialogProps = {
  open: boolean;
  onClose: () => void;
  form: GfFormData | null;
};

function lockBodyScroll(): () => void {
  const html = document.documentElement;
  const body = document.body;
  const scrollY = window.scrollY;

  const prev = {
    htmlOverflow: html.style.overflow,
    bodyOverflow: body.style.overflow,
    bodyPosition: body.style.position,
    bodyTop: body.style.top,
    bodyLeft: body.style.left,
    bodyRight: body.style.right,
    bodyWidth: body.style.width,
  };

  html.style.overflow = "hidden";
  body.style.overflow = "hidden";
  body.style.position = "fixed";
  body.style.top = `-${scrollY}px`;
  body.style.left = "0";
  body.style.right = "0";
  body.style.width = "100%";

  return () => {
    html.style.overflow = prev.htmlOverflow;
    body.style.overflow = prev.bodyOverflow;
    body.style.position = prev.bodyPosition;
    body.style.top = prev.bodyTop;
    body.style.left = prev.bodyLeft;
    body.style.right = prev.bodyRight;
    body.style.width = prev.bodyWidth;
    window.scrollTo(0, scrollY);
  };
}

export function ContactFormDialog({ open, onClose, form }: ContactFormDialogProps) {
  useEffect(() => {
    if (!open) return;
    return lockBodyScroll();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-popup-title"
      className="fixed inset-0 z-[500] flex items-start justify-center overflow-y-auto overscroll-y-contain bg-black/50 p-4 pt-[10vh] sm:pt-[12vh]"
    >
      <div className="absolute inset-0" aria-hidden="true" onClick={onClose} />
      <div
        className="relative z-10 w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id="contact-popup-title" className="text-xl font-bold text-[var(--color-fg)]">
            Contact Us
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-[var(--color-muted)] transition-colors hover:bg-black/5 hover:text-[var(--color-fg)]"
            aria-label="Close contact form"
          >
            <span className="block text-2xl leading-none" aria-hidden>
              ×
            </span>
          </button>
        </div>

        {form ? (
          <div className="mb-6">
            <p className="mb-4 text-sm leading-relaxed text-[var(--color-fg)]">
              Please use the form below to get in touch with us and
              <br />
              we will respond within 24 hours.
            </p>
            <GravityForm form={form} className="space-y-4" />
          </div>
        ) : (
          <p className="mb-6 text-sm text-[var(--color-muted)]">
            The contact form is temporarily unavailable. Please visit{" "}
            <Link href="/contact/" className="text-[var(--color-link)] underline hover:text-[var(--color-link-hover)]">
              Contact Us
            </Link>{" "}
            or try again later.
          </p>
        )}

        <div className="space-y-3 border-t border-[var(--color-border)] pt-6 text-sm leading-relaxed text-[var(--color-fg)]">
          <p>
            <span className="font-semibold">Phone:</span>{" "}
            <a
              href="tel:+18004587112"
              className="text-[var(--color-link)] underline-offset-4 hover:text-[var(--color-link-hover)] hover:underline"
            >
              (800) 458-7112
            </a>
          </p>
          <div className="space-y-2">
            <p className="font-semibold">Map</p>
            <div className="overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-bg)]">
              <iframe
                title="AmeriLife office — 2650 McCormick Drive, Clearwater, FL"
                src={OFFICE_MAP_EMBED_URL}
                className="aspect-video min-h-[180px] w-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <p>
              <a
                href={OFFICE_MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-link)] underline-offset-4 hover:text-[var(--color-link-hover)] hover:underline"
              >
                Open in Google Maps
              </a>
            </p>
          </div>
          <div>
            <p className="font-semibold">Office:</p>
            {OFFICE_ADDRESS_LINES.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <p>
            Interested in a career with AmeriLife?{" "}
            <Link
              href="/join-our-team/"
              className="font-semibold text-[var(--color-link)] underline-offset-4 hover:text-[var(--color-link-hover)] hover:underline"
              onClick={onClose}
            >
              Join Our Team
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
