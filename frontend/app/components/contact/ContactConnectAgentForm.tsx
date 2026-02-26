"use client";

import { Button } from "@/app/components/ui/Button";

const INPUT_CLASS =
  "w-full rounded border border-[var(--color-border)] px-4 py-3 text-[var(--color-fg)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-primary)]";

const PRODUCT_OPTIONS = [
  "Select",
  "Annuities",
  "ARA/AmeriPerks Cards",
  "Burial Policies",
  "Disability Income",
  "Final Expense Life",
  "Health Exchange",
  "Hospital Indemnity,Cancer Plans",
  "Life Insurance",
  "Long-Term Care",
  "Major Medical",
  "Medicare Advantage",
  "Medicare Part D Rx Only",
  "Medicare Select",
  "Medicare Supplement",
  "Term Life",
  "Universal Life",
  "Worksite/Employers & Orginizations",
  "I’m not sure",
];

export function ContactConnectAgentForm() {
  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label htmlFor="agent-zip" className="mb-1.5 block text-sm font-medium text-[var(--color-fg)]">
          Enter your Zip
        </label>
        <input
          id="agent-zip"
          name="zip"
          type="text"
          placeholder="ZIP Code"
          inputMode="numeric"
          autoComplete="postal-code"
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label htmlFor="agent-product" className="mb-1.5 block text-sm font-medium text-[var(--color-fg)]">
          Choose a product:
        </label>
        <select id="agent-product" name="product" className={`${INPUT_CLASS} bg-white`} defaultValue="Select">
          {PRODUCT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="mb-1.5 block text-sm font-medium text-[var(--color-fg)]">CAPTCHA</div>
        <div className="rounded border border-[var(--color-border)] bg-[var(--color-bg)] p-4 text-sm text-[var(--color-muted)]">
          CAPTCHA would be integrated here
        </div>
      </div>

      <div className="pt-2">
        <Button type="submit" className="min-w-[140px]">
          Send
        </Button>
      </div>
    </form>
  );
}

