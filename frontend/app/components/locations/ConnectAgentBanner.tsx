"use client";

import type { LocationData } from "@/lib/locations-data";
import type { GfFormData } from "@/lib/gf-types";
import { GravityForm } from "@/app/components/gravity-forms/GravityForm";

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

/** Prefer CMS `mapSearchUrl` (import) so iframe matches the same query as enrichment. */
function embedUrlFromMapSearchUrl(stored: string | undefined): string | null {
  if (!stored?.trim()) return null;
  try {
    const u = new URL(stored);
    const q = u.searchParams.get("query");
    if (q) {
      return `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
    }
  } catch {
    /* ignore */
  }
  return null;
}

type ConnectAgentBannerProps = {
  location: LocationData;
  connectForm: GfFormData | null;
};

export function ConnectAgentBanner({ location, connectForm }: ConnectAgentBannerProps) {
  const mapsUrl =
    embedUrlFromMapSearchUrl(location.mapSearchUrl) ?? buildMapsEmbedUrl(location);

  return (
    <section
      id="connect-with-agent"
      className="bg-[#f7f8f9] py-8 sm:py-12 lg:py-16"
    >
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <h2 className="mb-6 text-center text-lg font-bold uppercase text-[var(--color-fg)] sm:mb-8">
          Connect With An Agent
        </h2>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:gap-8">
          {/* Left: Map */}
          <div className="relative aspect-[4/3] min-h-[200px] overflow-hidden rounded-lg border border-[var(--color-border)] bg-[#e8e9eb] sm:min-h-[280px] lg:aspect-square">
            <iframe
              src={mapsUrl}
              title="Office location map"
              className="absolute inset-0 h-full w-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Right: Gravity Form via WPGraphQL for GF */}
          <div className="min-w-0">
            {connectForm ? (
              <GravityForm form={connectForm} />
            ) : (
              <p className="text-sm text-[var(--color-muted)]">
                The contact form could not be loaded. Please try again later or call{" "}
                <a className="text-[var(--color-link)] underline" href={`tel:${location.phone.replace(/\D/g, "")}`}>
                  {location.phone}
                </a>
                .
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
