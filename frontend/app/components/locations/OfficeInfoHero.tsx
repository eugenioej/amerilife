import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import { GravityForm } from "@/app/components/gravity-forms/GravityForm";
import { rewriteUploadsUrl } from "@/lib/wp-media";
import { agencyMapsEmbedUrl } from "@/lib/agency-map-embed";
import { telHrefPlusOne } from "@/lib/us-tel-href";
import type { GfFormData } from "@/lib/gf-types";
import {
  LICENSED_INSURANCE_AGENT_LABEL,
  agentJobTitleLine,
  heroFeaturedAgent,
  type LocationData,
} from "@/lib/locations-data";

type OfficeInfoHeroProps = {
  location: LocationData;
  connectForm: GfFormData | null;
};

function breadcrumbOfficeTitle(officeName: string): string {
  return officeName.replace(/,\s*LLC\s*$/i, "").trim();
}

function addressDisplayLines(location: LocationData): string[] {
  const { line1, line2, city, state, zip } = location.address;
  const line3 = `${city}, ${state} ${zip}, USA`;
  return [line1, line2, line3].filter(Boolean) as string[];
}

function hoursDisplayLines(location: LocationData): string[] {
  if (!location.hours?.trim()) return ["Monday–Friday", "8am–5pm"];
  return location.hours
    .trim()
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

/** Office block: title, phone, address | hours — used in full-bleed teal (right 2/3 on desktop). */
function TealOfficeBlock({
  location,
  addrLines,
  hoursLines,
  officeTelHref,
}: {
  location: LocationData;
  addrLines: string[];
  hoursLines: string[];
  officeTelHref: string | null;
}) {
  return (
    <>
      <h1 className="text-left text-[1.6rem] font-bold leading-snug tracking-tight sm:text-3xl xl:text-[2.1rem]">
        {location.officeName}
      </h1>

      {officeTelHref ? (
        <a
          className="mt-5 inline-block text-left text-xl font-bold leading-snug underline-offset-4 transition-opacity hover:opacity-95 sm:mt-6 sm:text-2xl xl:text-[1.75rem]"
          href={officeTelHref}
        >
          {location.phone}
        </a>
      ) : (
        <p className="mt-5 text-xl font-bold sm:mt-6">{location.phone}</p>
      )}

      <div className="mt-9 border-t border-white/35 pt-8 sm:mt-10">
        <div className="flex flex-col gap-8 text-left sm:flex-row sm:items-start sm:gap-5 md:gap-6">
          <address className="block shrink-0 text-base leading-[1.62] not-italic sm:text-[1.04rem]">
            {addrLines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </address>

          <div className="hidden w-px shrink-0 self-stretch bg-white/38 sm:block" aria-hidden />

          <div className="shrink-0">
            <p className="text-base font-bold sm:text-[1.04rem]">Hours:</p>
            {hoursLines.map((line, i) => (
              <p key={i} className="mt-0.5 text-base leading-snug sm:text-[1.02rem]">
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export function OfficeInfoHero({ location, connectForm }: OfficeInfoHeroProps) {
  const addrLines = addressDisplayLines(location);
  const hoursLines = hoursDisplayLines(location);

  const featured = heroFeaturedAgent(location.agents);
  const jobTitle = featured ? agentJobTitleLine(featured) : null;
  const initials = featured
    ? featured.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
    : "";

  const heroImageUrl = featured?.photoUrl?.trim()
    ? rewriteUploadsUrl(featured.photoUrl.trim())
    : featured
      ? null
      : location.officeImageUrl
        ? rewriteUploadsUrl(location.officeImageUrl)
        : null;

  const heroAlt = featured
    ? `${featured.name} – ${LICENSED_INSURANCE_AGENT_LABEL}`
    : `${location.officeName} office`;

  const mapsUrl = agencyMapsEmbedUrl(location);
  const officeTelHref = telHrefPlusOne(location.phone);
  const displayPhoneAgent = featured?.phone?.trim() || location.phone;
  const agentTelHref = telHrefPlusOne(displayPhoneAgent);

  return (
    <section className="bg-white">
      <div className="border-b border-[#dfe7ec] bg-[#f6faff]">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-3 sm:py-[0.9rem]">
          <SiteBreadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: breadcrumbOfficeTitle(location.officeName) },
            ]}
          />
        </div>
      </div>

      {/* Full-bleed teal — edge to edge */}
      <div className="w-full bg-[var(--color-brand-primary)] text-white">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] pb-12 pt-10 sm:pb-14 sm:pt-11 lg:pb-[4.5rem] lg:pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-[80px]">
            {/* Reserve 1/3 so copy lines up with content column; photo overlaps here from below */}
            <div className="hidden lg:col-span-4 lg:block" aria-hidden />
            <div className="lg:col-span-8">
              <TealOfficeBlock
                location={location}
                addrLines={addrLines}
                hoursLines={hoursLines}
                officeTelHref={officeTelHref}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Body: 1/3 overlaps teal (photo), 2/3 white card */}
      <div className="relative z-10 w-full bg-white">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] pb-12 pt-8 sm:pt-10 lg:pt-2 sm:pb-14 lg:pb-16">
          <div className="grid grid-cols-1 gap-[40px] lg:grid-cols-12 lg:gap-x-[80px] lg:gap-y-0">
            {/* 1/3 — pull photo up into teal band */}
            <div className="text-left lg:col-span-4">
              <div
                className={
                  featured || location.officeImageUrl
                    ? "w-full lg:-mt-[8rem] xl:-mt-[8.75rem]"
                    : "w-full"
                }
              >
                {featured ? (
                  <div className="relative mx-0 aspect-square w-full overflow-hidden rounded-[3px] bg-[#e8eef2] shadow-[0_18px_40px_-12px_rgba(24,53,71,0.45)]">
                    {heroImageUrl ? (
                      <Image
                        src={heroImageUrl}
                        alt={heroAlt}
                        fill
                        className="object-cover object-[50%_12%]"
                        sizes="(max-width: 1023px) 100vw, 33vw"
                        unoptimized
                      />
                    ) : (
                      <div
                        className="absolute inset-0 flex flex-col justify-end bg-gradient-to-b from-[#8aa7b8] to-[#5a7a8c] pb-[16%] pl-5 text-left text-white"
                        aria-hidden
                      >
                        <span className="text-4xl font-bold tracking-tight sm:text-[2.65rem]">
                          {initials}
                        </span>
                      </div>
                    )}
                  </div>
                ) : location.officeImageUrl ? (
                  <div className="relative mx-0 aspect-square w-full overflow-hidden rounded-[3px] bg-[#e8eef2] shadow-[0_18px_40px_-12px_rgba(24,53,71,0.35)]">
                    <Image
                      src={rewriteUploadsUrl(location.officeImageUrl)}
                      alt={`${location.officeName} office`}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 1023px) 100vw, 33vw"
                      unoptimized
                    />
                  </div>
                ) : null}
              </div>

              {featured ? (
                <div className="mt-8 lg:mt-10">
                  <h2 className="text-xl font-bold text-[var(--color-brand-dark)] sm:text-[1.35rem]">
                    {featured.name}
                  </h2>

                  {jobTitle ? (
                    <p className="mt-2 text-[0.95rem] font-normal leading-snug text-[var(--color-fg)]">
                      {jobTitle}
                    </p>
                  ) : null}

                  <p className="mt-2 flex items-start gap-2 text-[0.9375rem] font-normal leading-snug text-[var(--color-fg)]">
                    <ShieldCheck
                      className="mt-[3px] size-[1.05rem] shrink-0 text-[var(--color-brand-primary)]"
                      aria-hidden
                    />
                    <span>{LICENSED_INSURANCE_AGENT_LABEL}</span>
                  </p>

                  <div className="mt-6 flex flex-col gap-3 text-[0.9375rem] font-semibold">
                    {featured.email?.trim() ? (
                      <a
                        className="w-fit text-[var(--color-brand-dark)] underline decoration-[1.6px] underline-offset-[5px]"
                        href={`mailto:${featured.email.trim()}`}
                      >
                        {featured.email.trim()}
                      </a>
                    ) : null}
                    {agentTelHref ? (
                      <a
                        className="w-fit text-[var(--color-brand-dark)] underline decoration-[1.6px] underline-offset-[5px]"
                        href={agentTelHref}
                      >
                        {displayPhoneAgent}
                      </a>
                    ) : null}
                  </div>
                </div>
              ) : !featured && !location.officeImageUrl ? (
                <p className="mt-6 text-sm text-[var(--color-muted)]">
                  Meet your local AmeriLife team — agency contact details are above.
                </p>
              ) : null}

              <div className="relative mt-12 aspect-square w-full min-h-[220px] overflow-hidden rounded-md border border-[var(--color-border)] bg-[#e8eaec]">
                <iframe
                  src={mapsUrl}
                  title="Office location map"
                  className="absolute inset-0 h-full w-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* 2/3 — card with teal top rule */}
            <div className="lg:col-span-8">
              <div className="mt-[40px] border-t-[6px] border-[var(--color-brand-primary)] bg-white px-6 py-8 shadow-[0_14px_44px_-10px_rgba(36,66,96,0.18)] sm:px-8 sm:py-10 lg:border-t-[7px] lg:px-10 lg:py-11 xl:px-12 xl:py-12">
                <h2 className="text-left text-xl font-bold text-[var(--color-brand-dark)] sm:text-[1.6rem] lg:text-[1.775rem]">
                  One AmeriLife, many possibilities
                </h2>
                <p className="mt-5 text-left text-base leading-[1.73] text-[var(--color-fg)]">
                  AmeriLife offers a wide range of insurance and retirement solutions designed to support
                  your health, financial security, and peace of mind. Whether you&apos;re planning for the
                  future or looking for coverage today, our products are built to meet your needs.
                </p>

                <div className="mt-10 border-t border-[var(--color-border)] pt-9">
                  <h3 className="mb-7 text-[0.95625rem] font-bold uppercase tracking-[0.085em] text-[var(--color-brand-primary)]">
                    Connect With an Agent
                  </h3>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
