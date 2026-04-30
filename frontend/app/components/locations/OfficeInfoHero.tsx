import Image from "next/image";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import { rewriteUploadsUrl } from "@/lib/wp-media";
import type { LocationData } from "@/lib/locations-data";

function slugToCountyName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

type OfficeInfoHeroProps = {
  location: LocationData;
};

export function OfficeInfoHero({ location }: OfficeInfoHeroProps) {
  const countyName = slugToCountyName(location.slug);
  const addressLines = [
    location.address.line1,
    location.address.line2,
    `${location.address.city}, ${location.address.state} ${location.address.zip}`,
  ].filter(Boolean);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-6 sm:py-8 lg:py-12">
        <SiteBreadcrumb
          className="mb-6"
          items={[
            { label: "Home", href: "/" },
            { label: "Find An Agent", href: "/find-an-agent/" },
            { label: countyName },
          ]}
        />

        {/*
          Grid layout matching the reference:
          - Mobile: stack image, contact, about
          - Desktop: left column (row-span-2) office image, right column contact + about
        */}
        <div className="grid overflow-hidden rounded-lg grid-cols-1 lg:grid-cols-[2fr_3fr] lg:[grid-template-rows:auto_auto]">

          {/* LEFT: square image spanning both rows on desktop */}
          <div className="relative flex w-full min-w-0 self-start lg:row-span-2">
            <div className="relative aspect-[4/3] w-full lg:aspect-square">
            {location.officeImageUrl ? (
              <Image
                src={rewriteUploadsUrl(location.officeImageUrl)}
                alt={`${location.officeName} office`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-[#d0d8df]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[var(--color-muted)]"
                  aria-hidden
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
            )}
            </div>
          </div>

          {/* RIGHT ROW 1: green contact info */}
          <div className="bg-[var(--color-brand-primary)] px-4 py-3 sm:px-6 sm:py-6 lg:px-8">
            <h1 className="mb-3 text-2xl font-bold text-white sm:text-3xl">
              {location.officeName}
            </h1>
            <a
              href={`tel:${location.phone.replace(/\D/g, "")}`}
              className="mb-4 block text-lg font-bold text-white hover:underline"
            >
              {location.phone}
            </a>

            {/* Address | Divider | Hours */}
            <div className="flex flex-col gap-4 border-t border-white/30 pt-3 sm:flex-row sm:items-start sm:gap-6 lg:flex-row">
              <address className="not-italic text-sm leading-relaxed text-white">
                {addressLines.map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < addressLines.length - 1 && <br />}
                  </span>
                ))}
              </address>

              <div className="hidden w-px self-stretch bg-white/50 sm:block" aria-hidden />

              <div className="text-sm text-white">
                <p className="mb-1 font-bold">Hours:</p>
                <p>Monday-Friday</p>
                <p>8am-5pm</p>
              </div>
            </div>
          </div>

          {/* RIGHT ROW 2: AmeriLife narrative */}
          <div className="bg-white px-4 py-3 sm:px-6 sm:py-6 lg:px-8">
            <h2 className="mb-3 text-xl font-bold text-[var(--color-fg)] sm:text-2xl">
              One AmeriLife, many possibilities
            </h2>
            <div className="space-y-3 text-base leading-relaxed text-[var(--color-fg)] sm:space-y-4">
              <p>
                More and more Americans are buying insurance to protect their families, according to a
                recent study. Perhaps you are one of them.
              </p>
              <p>
                We offer affordable insurance and retirement solutions to empower people to live longer,
                healthier lives. Since the early 1970s, AmeriLife agents have collaborated with people to
                learn their stories and find insurance and retirement solutions to address their concerns
                and ease their fears of the unknown.
              </p>
              <p>
                What hasn&apos;t changed over the years is our commitment to help people live happier and
                healthier lives.
              </p>
              <p>
                Today, AmeriLife has nearly 60 insurance offices throughout the United States, and is
                growing and expanding into new markets. We work with 70+ carrier partners, many rated
                &ldquo;A+&rdquo; or &ldquo;A&rdquo; by A.M. Best, a U.S. – based insurance industry rating
                agency. This allows our agents to offer an extensive portfolio of quality annuity, life and
                health insurance products.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
