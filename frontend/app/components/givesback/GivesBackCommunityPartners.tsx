"use client";

import {
  LogoCarousel,
  type LogoCarouselLogo,
} from "@/app/components/ui/LogoCarousel";

type GivesBackCommunityPartnersProps = {
  logos: ReadonlyArray<LogoCarouselLogo>;
};


export default function GivesBackCommunityPartners({
  logos,
}: GivesBackCommunityPartnersProps) {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <h2 className="mb-4 text-[36px] leading-[1.25] font-semibold lg:text-[48px] text-center text-[var(--color-brand-dark)]">
          Celebrating Our Community Partners
        </h2>

        <div className="mt-8 h-px bg-[var(--color-brand-primary)]/40" />

        <div className="mt-12">
          <LogoCarousel
            colorLogos
            logos={logos}
            variant="gives-back"
          />
        </div>
      </div>
    </section>
  );
}