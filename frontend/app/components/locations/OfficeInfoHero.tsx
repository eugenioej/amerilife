import Image from "next/image";
import { Link } from "@/app/components/ui/Link";
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
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-8 lg:py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-[var(--color-muted)]" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li>
              <Link href="/" className="text-[var(--color-link)] transition-colors hover:text-[var(--color-link-hover)]">
                Home
              </Link>
            </li>
            <li aria-hidden="true">&rsaquo;</li>
            <li>
              <Link href="/find-an-agent/" className="text-[var(--color-link)] transition-colors hover:text-[var(--color-link-hover)]">
                Find An Agent
              </Link>
            </li>
            <li aria-hidden="true">&rsaquo;</li>
            <li className="font-semibold text-[var(--color-fg)]" aria-current="page">
              {countyName}
            </li>
          </ol>
        </nav>

        {/*
          Grid layout matching the reference:
          - Left column (row-span-2): office image, spans green + about sections
          - Right column row 1: green background with contact info
          - Right column row 2: white background with about text
        */}
        <div className="grid overflow-hidden rounded-lg [grid-template-columns:2fr_3fr] [grid-template-rows:auto_auto]">

          {/* LEFT: square image spanning both rows */}
          <div className="relative row-span-2 flex w-full min-w-0 self-start">
            <div className="relative aspect-square w-full">
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
          <div className="bg-[var(--color-brand-primary)] px-8 py-6">
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
            <div className="flex items-start gap-6 border-t border-white/30 pt-3">
              <address className="not-italic text-sm leading-relaxed text-white">
                {addressLines.map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < addressLines.length - 1 && <br />}
                  </span>
                ))}
              </address>

              <div className="w-px self-stretch bg-white/50" aria-hidden />

              <div className="text-sm text-white">
                <p className="mb-1 font-bold">Hours:</p>
                <p>Monday-Friday</p>
                <p>8am-5pm</p>
              </div>
            </div>
          </div>

          {/* RIGHT ROW 2: white about section */}
          <div className="bg-white px-8 py-6">
            <h2 className="mb-3 text-xl font-bold text-[var(--color-fg)]">
              About the Office
            </h2>
            <p className="text-base leading-relaxed text-[var(--color-fg)]">
              {location.aboutOffice}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
