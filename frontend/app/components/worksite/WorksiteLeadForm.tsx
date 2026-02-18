"use client";

import { useState } from "react";
import { Button } from "../ui/Button";

const EMPLOYER_TYPES = [
  "Union",
  "School district",
  "Association",
  "Corporation",
  "City",
  "Other",
];

export function WorksiteLeadForm() {
  const [showOtherExplain, setShowOtherExplain] = useState(false);

  return (
    <form className="mx-auto max-w-2xl" onSubmit={(e) => e.preventDefault()}>
      <h2 className="mb-8 text-2xl font-bold text-[var(--color-fg)]">
        Connect with an AmeriLife Benefits representative
      </h2>

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

        {/* Title */}
        <div>
          <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-[var(--color-fg)]">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
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
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="w-full rounded border border-[var(--color-border)] px-4 py-3 text-[var(--color-fg)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-primary)]"
          />
        </div>

        {/* Employer type - radio */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--color-fg)]">
            Which type of employer or group do you represent?
          </label>
          <div className="space-y-2">
            {EMPLOYER_TYPES.map((type) => (
              <label
                key={type}
                className="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-fg)]"
              >
                <input
                  type="radio"
                  name="employerType"
                  value={type}
                  onChange={() => setShowOtherExplain(type === "Other")}
                  className="h-4 w-4 border-[var(--color-border)] text-[var(--color-brand-primary)] focus:ring-[var(--color-brand-primary)]"
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* If other, please explain */}
        {showOtherExplain && (
          <div>
            <label
              htmlFor="otherExplain"
              className="mb-1.5 block text-sm font-medium text-[var(--color-fg)]"
            >
              If you chose other, please explain here:
            </label>
            <textarea
              id="otherExplain"
              name="otherExplain"
              rows={3}
              className="w-full rounded border border-[var(--color-border)] px-4 py-3 text-[var(--color-fg)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-primary)]"
            />
          </div>
        )}

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
              By clicking submit I understand that a broker may contact me regarding worksite
              benefits
            </span>
          </label>
        </div>

        {/* Submit - pending */}
        <div className="pt-4">
          <Button type="submit" className="min-w-[140px]">
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
}
