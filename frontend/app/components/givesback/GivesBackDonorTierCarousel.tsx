import GivesBackSectionContainer from "@/app/components/givesback/GivesBackSectionContainer";
import {
  LogoCarousel,
  type LogoCarouselLogo,
} from "@/app/components/ui/LogoCarousel";
import { sponsorsInTier } from "@/lib/sponsors";
import type { SponsorListItem } from "@/lib/queries";
import Image from "next/image";

type GivesBackDonorTierCarouselProps = {
  sponsors: SponsorListItem[];
};

type SponsorTier = {
  slug: string;
  label: string;
  heading: string;
  amount: string;
  description: string;
  sectionClassName: string;
  headingClassName: string;
  eyebrowClassName: string;
  amountClassName: string;
  descriptionClassName: string;
  dividerClassName: string;
  leafImage: string;
  leafAlt: string;
};

const sponsorTiers: ReadonlyArray<SponsorTier> = [
  {
    slug: "gold-sponsors",
    label: "Gold Sponsors",
    heading: "Mighty Oak Donors",
    amount: "$10,000+",
    description: "Premier foundational visionaries",
    sectionClassName: "bg-[var(--color-brand-dark)]",
    headingClassName: "text-white",
    eyebrowClassName: "text-[var(--color-brand-primary)]",
    amountClassName: "text-white",
    descriptionClassName: "text-white/70",
    dividerClassName: "border-white/15",
    leafImage:
      "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/09/Leaf-Icons-03-e1789762694943.png",
    leafAlt: "",
  },
  {
    slug: "silver-sponsors",
    label: "Silver Sponsors",
    heading: "Branch Patrons",
    amount: "$5,000",
    description: "Mid-level community champions",
    sectionClassName: "bg-[var(--color-brand-primary)]",
    headingClassName: "text-[var(--color-brand-dark)]",
    eyebrowClassName: "text-white",
    amountClassName: "text-[var(--color-brand-dark)]",
    descriptionClassName: "text-[var(--color-brand-dark)]/70",
    dividerClassName: "border-[var(--color-brand-dark)]/15",
    leafImage:
      "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/09/Leaf-Icons-02-e1789762600609.png",
    leafAlt: "",
  },
  {
    slug: "bronze-sponsors",
    label: "Bronze Sponsors",
    heading: "Leaf Benefactors",
    amount: "$1,000",
    description: "Entry level supporting sponsors",
    sectionClassName: "bg-[#f3f4f4]",
    headingClassName: "text-[var(--color-brand-dark)]",
    eyebrowClassName: "text-[var(--color-brand-primary)]",
    amountClassName: "text-[var(--color-brand-dark)]",
    descriptionClassName: "text-[var(--color-brand-dark)]/70",
    dividerClassName: "border-[var(--color-brand-dark)]/15",
    leafImage:
      "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/09/Leaf-Icons-01-e1789762655218.png",
    leafAlt: "",
  },
];

function sponsorsToLogos(
  sponsors: SponsorListItem[]
): LogoCarouselLogo[] {
  const logos: LogoCarouselLogo[] = [];

  for (const sponsor of sponsors) {
    const src =
      sponsor.featuredImage?.node?.sourceUrl ||
      "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/09/AGB-Foundation-061826-TM_Main-Color.png";

    const imageAlt = sponsor.featuredImage?.node?.altText?.trim();
    const sponsorTitle = sponsor.title?.trim();

    logos.push({
      src,
      alt: imageAlt || sponsorTitle || "Sponsor logo",
    });
  }

  return logos;
}

export default function GivesBackDonorTierCarousel({
  sponsors,
}: GivesBackDonorTierCarouselProps) {
  return (
    <section aria-label="Sponsor tiers">
      {sponsorTiers.map((tier) => {
        const tierSponsors = sponsorsInTier(sponsors, tier.slug);
        const logos = sponsorsToLogos(tierSponsors);

        return (
          <div
            key={tier.slug}
            className={`${tier.sectionClassName} py-20`}
          >
            <GivesBackSectionContainer>
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="flex items-center gap-4 lg:gap-5">
                    <Image
                      src={tier.leafImage}
                      alt={tier.leafAlt}
                      width={64}
                      height={64}
                      className="h-auto w-[48px] shrink-0 object-contain lg:w-[64px]"
                    />

                  <div>
                    <p
                      className={`mb-2 text-[12px] font-bold uppercase tracking-[0.2em] ${tier.eyebrowClassName}`}
                    >
                      {tier.label}
                    </p>

                    <h2
                      className={`text-[28px] font-bold leading-[1.2] lg:text-[36px] ${tier.headingClassName}`}
                    >
                      {tier.heading}
                    </h2>
                  </div>
                </div>

                <div className="md:text-right">
                  <p
                    className={`text-[32px] font-bold leading-none lg:text-[40px] ${tier.amountClassName}`}
                  >
                    {tier.amount}
                  </p>

                  <p
                    className={`mt-2 text-[14px] ${tier.descriptionClassName}`}
                  >
                    {tier.description}
                  </p>
                </div>
              </div>

              <div className={`my-8 border-t ${tier.dividerClassName}`} />

              {logos.length > 0 ? (
                <LogoCarousel
                  logos={logos}
                  colorLogos
                  variant="gives-back-sponsors"
                />
              ) : (
                <p className={tier.descriptionClassName}>
                  No sponsors are currently assigned to this tier.
                </p>
              )}
            </GivesBackSectionContainer>
          </div>
        );
      })}
    </section>
  );
}