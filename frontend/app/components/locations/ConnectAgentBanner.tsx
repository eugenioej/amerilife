"use client";

import type { LocationData } from "@/lib/locations-data";
import type { GfFormData } from "@/lib/gf-types";
import { agencyMapsEmbedUrl } from "@/lib/agency-map-embed";
import { telHrefPlusOne } from "@/lib/us-tel-href";
import { GravityForm } from "@/app/components/gravity-forms/GravityForm";

type ConnectAgentBannerProps = {
  location: LocationData;
  connectForm: GfFormData | null;
  /** When false, only the office map is shown (form appears in OfficeInfoHero). */
  showForm?: boolean;
};

export function ConnectAgentBanner({
  location,
  connectForm,
  showForm = true,
}: ConnectAgentBannerProps) {
  const mapsUrl = agencyMapsEmbedUrl(location);
  const officeTelHref = telHrefPlusOne(location.phone);

  return (
    <section
      id="connect-with-agent"
      className="bg-[#f7f8f9] py-8 sm:py-12 lg:py-16"
    >
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <h2 className="mb-6 text-center text-lg font-bold uppercase text-[var(--color-fg)] sm:mb-8">
          {showForm ? "Connect With An Agent" : "Office location"}
        </h2>

        <div
          className={
            showForm
              ? "grid gap-6 lg:grid-cols-[1fr_1fr] lg:gap-8"
              : "mx-auto max-w-4xl"
          }
        >
          <div
            className={
              showForm
                ? "relative aspect-[4/3] min-h-[200px] overflow-hidden rounded-lg border border-[var(--color-border)] bg-[#e8e9eb] sm:min-h-[280px] lg:aspect-square"
                : "relative aspect-[16/10] min-h-[240px] overflow-hidden rounded-lg border border-[var(--color-border)] bg-[#e8e9eb] sm:min-h-[320px]"
            }
          >
            <iframe
              src={mapsUrl}
              title="Office location map"
              className="absolute inset-0 h-full w-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {showForm ? (
            <div className="min-w-0">
              {connectForm ? (
                <GravityForm form={connectForm} />
              ) : (
                <p className="text-sm text-[var(--color-muted)]">
                  The contact form could not be loaded. Please try again later
                  {officeTelHref ? (
                    <>
                      {" "}
                      or call{" "}
                      <a className="text-[var(--color-link)] underline" href={officeTelHref}>
                        {location.phone}
                      </a>
                    </>
                  ) : null}
                  .
                </p>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
