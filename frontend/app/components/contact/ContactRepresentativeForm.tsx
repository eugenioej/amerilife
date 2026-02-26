"use client";

import { Button } from "@/app/components/ui/Button";

const INPUT_CLASS =
  "w-full rounded border border-[var(--color-border)] px-4 py-3 text-[var(--color-fg)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-primary)]";

const TOPIC_OPTIONS = [
  "General comments",
  "Contact me about purchasing an insurance policy",
  "Contact me about becoming an agent",
  "Contact me about my brokerage/IMO",
  "Contact me about a job opportunity at AmeriLife.com",
  "Contact me about voluntary benefits for my workplace organization",
];

export function ContactRepresentativeForm() {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-6">
        <div>
          <label htmlFor="contact-first" className="mb-1.5 block text-sm font-medium text-[var(--color-fg)]">
            Name<span className="text-[var(--color-brand-primary)]">*</span>
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              id="contact-first"
              name="firstName"
              type="text"
              placeholder="First"
              autoComplete="given-name"
              required
              className={INPUT_CLASS}
            />
            <input
              id="contact-last"
              name="lastName"
              type="text"
              placeholder="Last"
              autoComplete="family-name"
              required
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-[var(--color-fg)]">
            Email<span className="text-[var(--color-brand-primary)]">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label htmlFor="contact-phone" className="mb-1.5 block text-sm font-medium text-[var(--color-fg)]">
            Phone
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className={INPUT_CLASS}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-zip" className="mb-1.5 block text-sm font-medium text-[var(--color-fg)]">
              Zip
            </label>
            <input
              id="contact-zip"
              name="zip"
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label htmlFor="contact-city" className="mb-1.5 block text-sm font-medium text-[var(--color-fg)]">
              City
            </label>
            <input
              id="contact-city"
              name="city"
              type="text"
              autoComplete="address-level2"
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <div>
          <label htmlFor="contact-state" className="mb-1.5 block text-sm font-medium text-[var(--color-fg)]">
            State
          </label>
          <input
            id="contact-state"
            name="state"
            type="text"
            autoComplete="address-level1"
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label htmlFor="contact-topic" className="mb-1.5 block text-sm font-medium text-[var(--color-fg)]">
            Topic
          </label>
          <select
            id="contact-topic"
            name="topic"
            className={`${INPUT_CLASS} bg-white`}
            defaultValue={TOPIC_OPTIONS[0]}
          >
            {TOPIC_OPTIONS.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-[var(--color-fg)]">
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            className={INPUT_CLASS}
          />
        </div>

        <div className="pt-2">
          <Button type="submit" className="min-w-[140px]">
            Send
          </Button>
        </div>
      </div>
    </form>
  );
}

