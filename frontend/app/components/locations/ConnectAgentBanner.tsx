"use client";

import { Button } from "@/app/components/ui/Button";
import type { LocationData } from "@/lib/locations-data";

const INPUT_CLASS =
  "w-full rounded border border-[var(--color-border)] bg-white px-4 py-3 text-[var(--color-fg)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-primary)]";

const CHECKBOX_CLASS =
  "h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-brand-primary)] focus:ring-[var(--color-brand-primary)]";

const PRODUCT_CHECKBOXES = [
  { id: "medicare-advantage", label: "Medicare Advantage", value: "medicare-advantage" },
  { id: "part-d", label: "Part D Prescription Drugs", value: "part-d" },
  {
    id: "medicare-supplement",
    label: "Medicare Supplement Insurance",
    value: "medicare-supplement",
  },
] as const;

function buildMapsEmbedUrl(location: LocationData): string {
  const addr = [
    location.address.line1,
    location.address.line2,
    location.address.city,
    location.address.state,
    location.address.zip,
  ]
    .filter(Boolean)
    .join(", ");
  const encoded = encodeURIComponent(addr);
  return `https://www.google.com/maps?q=${encoded}&output=embed`;
}

type ConnectAgentBannerProps = {
  location: LocationData;
};

export function ConnectAgentBanner({ location }: ConnectAgentBannerProps) {
  const mapsUrl = buildMapsEmbedUrl(location);

  return (
    <section
      id="connect-with-agent"
      className="bg-[#f7f8f9] py-12 lg:py-16"
    >
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <h2 className="mb-8 text-center text-lg font-bold uppercase text-[var(--color-fg)]">
          Connect With An Agent
        </h2>

        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          {/* Left: Map */}
          <div className="relative aspect-[4/3] min-h-[280px] overflow-hidden rounded-lg border border-[var(--color-border)] bg-[#e8e9eb] lg:aspect-square">
            <iframe
              src={mapsUrl}
              title="Office location map"
              className="absolute inset-0 h-full w-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Right: Form */}
          <form
            className="space-y-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="agent-first"
                  className="mb-1.5 block text-sm font-medium text-[var(--color-fg)]"
                >
                  First Name
                </label>
                <input
                  id="agent-first"
                  name="firstName"
                  type="text"
                  placeholder="First"
                  autoComplete="given-name"
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label
                  htmlFor="agent-last"
                  className="mb-1.5 block text-sm font-medium text-[var(--color-fg)]"
                >
                  Last Name
                </label>
                <input
                  id="agent-last"
                  name="lastName"
                  type="text"
                  placeholder="Last"
                  autoComplete="family-name"
                  className={INPUT_CLASS}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="agent-email"
                className="mb-1.5 block text-sm font-medium text-[var(--color-fg)]"
              >
                Email
              </label>
              <input
                id="agent-email"
                name="email"
                type="email"
                placeholder="example@email.com"
                autoComplete="email"
                className={INPUT_CLASS}
              />
            </div>

            <div>
              <label
                htmlFor="agent-phone"
                className="mb-1.5 block text-sm font-medium text-[var(--color-fg)]"
              >
                Phone
              </label>
              <input
                id="agent-phone"
                name="phone"
                type="tel"
                placeholder="(XXX) XXX-XXXX"
                autoComplete="tel"
                className={INPUT_CLASS}
              />
            </div>

            <div>
              <label
                htmlFor="agent-zip"
                className="mb-1.5 block text-sm font-medium text-[var(--color-fg)]"
              >
                Zip Code
              </label>
              <input
                id="agent-zip"
                name="zip"
                type="text"
                placeholder="XXXXX"
                inputMode="numeric"
                autoComplete="postal-code"
                className={INPUT_CLASS}
              />
            </div>

            <div>
              <h3 className="mb-4 text-sm font-bold uppercase text-[var(--color-fg)]">
                Product Selection
              </h3>
              <div className="space-y-3">
                {PRODUCT_CHECKBOXES.map(({ id, label, value }) => (
                  <label
                    key={id}
                    className="flex cursor-pointer items-center gap-3 text-sm text-[var(--color-fg)]"
                  >
                    <input
                      type="checkbox"
                      name="products"
                      value={value}
                      className={CHECKBOX_CLASS}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" className="min-w-[180px]">
                Find An Agent
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
