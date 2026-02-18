"use client";

import { Button } from "../ui/Button";

const PRODUCT_OPTIONS = [
  "Annuities",
  "ARA/AmeriPerks Cards",
  "Burial Policies",
  "Disability Income",
  "Final Expense Life",
  "Health Exchange",
  "Hospital Indemnity, Cancer Plans",
  "Life Insurance",
  "Long-Term Care",
  "Medicare Advantage Plans",
  "Major Medical",
  "Part D Prescription Drug Plans",
  "Medicare Select",
  "Medicare Supplement Insurance",
  "Term Life",
  "Universal Life",
];

export function ConnectForm() {
  return (
    <form className="mx-auto max-w-2xl" onSubmit={(e) => e.preventDefault()}>
      <h2 className="mb-8 text-2xl font-bold text-[var(--color-fg)]">
        Connect with an agent
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

        {/* Zip Code */}
        <div>
          <label htmlFor="zip" className="mb-1.5 block text-sm font-medium text-[var(--color-fg)]">
            Zip Code<span className="text-[var(--color-brand-primary)]">*</span>
          </label>
          <input
            id="zip"
            name="zip"
            type="text"
            className="w-full rounded border border-[var(--color-border)] px-4 py-3 text-[var(--color-fg)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-primary)]"
          />
        </div>

        {/* Product Selection - checkboxes */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--color-fg)]">
            Product Selection<span className="text-[var(--color-brand-primary)]">*</span>
          </label>
          <div className="grid gap-2 sm:grid-cols-2">
            {PRODUCT_OPTIONS.map((product) => (
              <label
                key={product}
                className="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-fg)]"
              >
                <input
                  type="checkbox"
                  name="products"
                  value={product}
                  className="h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-brand-primary)] focus:ring-[var(--color-brand-primary)]"
                />
                {product}
              </label>
            ))}
          </div>
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
              By checking this box you agree to allow a licensed representative to call or contact
              you regarding this insurance-related information request.
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
