"use client";

import { Button } from "@/app/components/ui/Button";

const INPUT_CLASS =
  "w-full rounded border border-[var(--color-border)] px-4 py-3 text-[var(--color-fg)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-primary)]";

const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "District of Columbia",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

function RequiredMarker() {
  return <span className="text-[var(--color-brand-primary)]">*</span>;
}

export function PrivacyAddendumRequestForm() {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-6">
        <div>
          <label htmlFor="privacy-state" className="mb-1.5 block text-sm font-medium text-[var(--color-fg)]">
            State <RequiredMarker />
          </label>
          <select
            id="privacy-state"
            name="state"
            required
            className={`${INPUT_CLASS} bg-white`}
          >
            <option value="">Select a state</option>
            {US_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="privacy-details" className="mb-1.5 block text-sm font-medium text-[var(--color-fg)]">
            Please provide details of how your information may have been sent to AmeriLife Group
          </label>
          <textarea
            id="privacy-details"
            name="details"
            rows={4}
            className={INPUT_CLASS}
            placeholder="Provide details..."
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="privacy-first" className="mb-1.5 block text-sm font-medium text-[var(--color-fg)]">
              First Name <RequiredMarker />
            </label>
            <input
              id="privacy-first"
              name="firstName"
              type="text"
              autoComplete="given-name"
              required
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label htmlFor="privacy-last" className="mb-1.5 block text-sm font-medium text-[var(--color-fg)]">
              Last Name <RequiredMarker />
            </label>
            <input
              id="privacy-last"
              name="lastName"
              type="text"
              autoComplete="family-name"
              required
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <div>
          <label htmlFor="privacy-email" className="mb-1.5 block text-sm font-medium text-[var(--color-fg)]">
            Email <RequiredMarker />
          </label>
          <input
            id="privacy-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--color-fg)]">
            Address <RequiredMarker />
          </label>
          <div className="space-y-4">
            <input
              name="streetAddress"
              type="text"
              autoComplete="street-address"
              placeholder="Street Address"
              required
              className={INPUT_CLASS}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                name="city"
                type="text"
                autoComplete="address-level2"
                placeholder="City"
                required
                className={INPUT_CLASS}
              />
              <input
                name="zip"
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="ZIP / Postal Code"
                required
                className={INPUT_CLASS}
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="privacy-phone" className="mb-1.5 block text-sm font-medium text-[var(--color-fg)]">
            Phone
          </label>
          <input
            id="privacy-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label htmlFor="privacy-subsidiary" className="mb-1.5 block text-sm font-medium text-[var(--color-fg)]">
            Subsidiary or Affiliated Entity
          </label>
          <input
            id="privacy-subsidiary"
            name="subsidiary"
            type="text"
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label htmlFor="privacy-office" className="mb-1.5 block text-sm font-medium text-[var(--color-fg)]">
            AmeriLife Office Location
          </label>
          <input
            id="privacy-office"
            name="officeLocation"
            type="text"
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label htmlFor="privacy-contact" className="mb-1.5 block text-sm font-medium text-[var(--color-fg)]">
            Primary Contact at AmeriLife
          </label>
          <input
            id="privacy-contact"
            name="primaryContact"
            type="text"
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label htmlFor="privacy-policy" className="mb-1.5 block text-sm font-medium text-[var(--color-fg)]">
            Policy or Account Number
          </label>
          <input
            id="privacy-policy"
            name="policyOrAccountNumber"
            type="text"
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label htmlFor="privacy-additional" className="mb-1.5 block text-sm font-medium text-[var(--color-fg)]">
            Please provide any additional information which will help us verify your identity and
            process your request
          </label>
          <textarea
            id="privacy-additional"
            name="additionalInfo"
            rows={5}
            className={INPUT_CLASS}
            placeholder="Additional information..."
          />
        </div>

        <div className="rounded border border-[var(--color-border)] bg-[var(--color-muted)]/10 p-4 text-center text-sm text-[var(--color-muted)]">
          CAPTCHA placeholder – integrate reCAPTCHA or similar when ready
        </div>

        <div className="pt-2">
          <Button type="submit" className="min-w-[160px]">
            Submit Request
          </Button>
        </div>
      </div>
    </form>
  );
}
