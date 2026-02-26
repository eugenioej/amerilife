"use client";

import { LogoCarousel } from "@/app/components/ui/LogoCarousel";
import { WP_IMAGE_SOURCES } from "@/lib/wp-image-sources";

const WEALTH_ALTS = [
  "Allied Elite Financial",
  "Crump",
  "Levinson",
  "Meritage",
  "The Ohlson Group",
  "Peak Financial",
  "SAM",
  "Saybrus",
  "Sterling Bridge",
  "Succession",
  "The Hoffman Financial Group",
  "USA Financial",
  "MyLifeWerks",
];

const CATEGORIES: Array<{
  label: string;
  logos: ReadonlyArray<{ src: string; alt: string }>;
}> = [
  {
    label: "Medical, Life & Health Market",
    logos: WP_IMAGE_SOURCES.affiliates.affiliateLogos,
  },
  {
    label: "Wealth Management & Retirement Planning Market",
    logos: WP_IMAGE_SOURCES.affiliates.affiliateLogos.filter((l) => WEALTH_ALTS.includes(l.alt)),
  },
  {
    label: "Worksite Distribution",
    logos: WP_IMAGE_SOURCES.affiliates.worksiteLogos,
  },
  {
    label: "Direct to Consumer",
    logos: WP_IMAGE_SOURCES.affiliates.affiliateLogos.filter((l) =>
      l.alt.toLowerCase().includes("senior")
    ),
  },
];

export function AffiliatedCompaniesCarousel() {
  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <h2 className="mb-4 text-center text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
          Affiliated Companies
        </h2>
        <div className="space-y-12">
          {CATEGORIES.map((cat, i) => (
            <div key={i}>
              <h3 className="mb-6 text-center text-sm font-bold uppercase tracking-wide text-[var(--color-muted)]">
                {cat.label}
              </h3>
              <LogoCarousel logos={cat.logos} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
