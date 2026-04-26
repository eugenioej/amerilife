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
        <h2 className="mb-12 text-center text-3xl font-semibold leading-tight text-[var(--color-fg)] sm:text-4xl lg:text-5xl">
          Affiliated Companies
        </h2>
        <div className="space-y-12">
          {categories.map((cat, i) => (
            <div key={`${cat.label}-${i}`}>
              <h3 className="mb-6 text-center text-sm font-bold uppercase tracking-wide text-[var(--color-fg)] sm:text-base md:text-lg">
                {cat.label}
              </h3>
              <LogoCarousel colorLogos logos={cat.logos} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
