"use client";

import { LogoCarousel, type LogoCarouselLogo } from "@/app/components/ui/LogoCarousel";

export type AffiliatedCompaniesCarouselCategory = {
  label: string;
  logos: ReadonlyArray<LogoCarouselLogo>;
};

export function AffiliatedCompaniesCarousel({
  categories,
}: {
  categories: ReadonlyArray<AffiliatedCompaniesCarouselCategory>;
}) {
  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <h2 className="mb-4 text-center text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
          Affiliated Companies
        </h2>
        <div className="space-y-12">
          {categories.map((cat, i) => (
            <div key={`${cat.label}-${i}`}>
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
