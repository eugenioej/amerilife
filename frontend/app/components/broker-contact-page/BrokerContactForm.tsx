"use client";

import { Button } from "../ui/Button";

const BENEFITS_OPTIONS = [
  "Leading Carrier & Product Solutions",
  "Fee-Based Asset Management Services",
  "Leads & Marketing Services",
  "Innovative Sales Technology",
  "Medicare Referral Program",
  "Training Support",
  "E&O Coverage Program",
  "Renewal Purchase Program",
  "Back Office Services",
  "Third-party administration",
  "Becoming part of the AmeriLife Family of Companies",
  "Other",
];

export function BrokerContactForm() {
  return (
    <form className="mx-auto max-w-2xl" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-[var(--color-fg)]">
            Name<span className="text-[var(--color-brand-primary)]">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="First Last"
            className="w-full rounded border border-[var(--color-border)] px-4 py-3 text-[var(--color-fg)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-primary)]"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[var(--color-fg)]">
            Email<span className="text-[var(--color-brand-primary)]">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full rounded border border-[var(--color-border)] px-4 py-3 text-[var(--color-fg)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-primary)]"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-[var(--color-fg)]">
            Phone<span className="text-[var(--color-brand-primary)]">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="w-full rounded border border-[var(--color-border)] px-4 py-3 text-[var(--color-fg)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-primary)]"
          />
        </div>

        {/* Benefits - checkboxes */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--color-fg)]">
            Which benefits would you like to talk with us about?
          </label>
          <div className="grid gap-2 sm:grid-cols-2">
            {BENEFITS_OPTIONS.map((benefit) => (
              <label
                key={benefit}
                className="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-fg)]"
              >
                <input
                  type="checkbox"
                  name="benefits"
                  value={benefit}
                  className="h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-brand-primary)] focus:ring-[var(--color-brand-primary)]"
                />
                {benefit}
              </label>
            ))}
          </div>
        </div>

        {/* If you chose other */}
        <div>
          <label
            htmlFor="otherExplain"
            className="mb-1.5 block text-sm font-medium text-[var(--color-fg)]"
          >
            If you chose other, please explain:
          </label>
          <textarea
            id="otherExplain"
            name="otherExplain"
            rows={3}
            className="w-full rounded border border-[var(--color-border)] px-4 py-3 text-[var(--color-fg)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-primary)]"
          />
        </div>

        {/* Stay Connected checkbox */}
        <div>
          <label className="flex cursor-pointer items-start gap-2 text-sm text-[var(--color-fg)]">
            <input
              type="checkbox"
              name="stayConnected"
              className="mt-1 h-4 w-4 shrink-0 rounded border-[var(--color-border)] text-[var(--color-brand-primary)] focus:ring-[var(--color-brand-primary)]"
            />
            <span>
              <span className="font-medium">
                Stay Connected<span className="text-[var(--color-brand-primary)]">*</span>
              </span>
              <br />
              By clicking submit I agree that AmeriLife may call or contact me regarding my
              submission.
            </span>
          </label>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <Button type="submit" className="min-w-[140px]">
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
}
