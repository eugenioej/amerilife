import type { Metadata } from "next";
import Image from "next/image";
import { GivesBackPhotoSlideshow } from "@/app/components/givesback/GivesBackPhotoSlideshow";
import { Link } from "@/app/components/ui/Link";
import { rewriteUploadsUrl } from "@/lib/wp-media";
import { WP_IMAGE_SOURCES } from "@/lib/wp-image-sources";
import { staticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = staticPageMetadata(
  "AmeriLife Gives Back Foundation | AmeriLife",
  "As a values-driven company, giving back is in AmeriLife's DNA. The AmeriLife Gives Back Foundation supports senior veterans and community partnerships.",
  "/givesback/"
);

const DONATE_URL = "https://buy.stripe.com/eVa2bi8vObFP9u83cc";
const HONOR_FLIGHT_LINK =
  "https://amerilife.com/blog/announcements/amerilife-gives-back-foundation-names-honor-flight-network-as-inaugural-partner/";

const COMMUNITY_SLIDESHOW_IMAGES = [
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/04/ChristmasInJuly400-4.jpg",
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/04/ChristmasInJuly400-5.jpg",
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/04/ChristmasInJuly400-3.jpg",
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/04/ChristmasInJuly400-8.jpg",
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/04/ChristmasInJuly400-2.jpg",
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/04/ChristmasInJuly400-6.jpg",
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/04/ChristmasInJuly400-7.jpg",
] as const;

/** Wider than default `--container-max` (1280px) for this page. */
const PAGE_CONTENT =
  "mx-auto w-full max-w-[min(100%,90rem)] px-[var(--container-padding-x)]";

/** Shared scale for page titles (hero h1 and section h2s). */
const PAGE_TITLE = "text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl";

export default function GivesBackPage() {
  return (
    <section className="bg-white pt-8 pb-0 sm:pt-10 md:pt-12">
      <div className={PAGE_CONTENT}>
        {/* Hero */}
        <div className="mb-16 flex flex-col items-center text-center">
          <Image
            src={rewriteUploadsUrl(WP_IMAGE_SOURCES.givesbackFoundationLogo)}
            alt="AmeriLife Gives Back"
            width={260}
            height={260}
            className="mb-5 h-44 w-44 object-contain sm:mb-6 sm:h-52 sm:w-52 lg:h-[260px] lg:w-[260px]"
          />
          <h1 className={`mb-4 text-[var(--color-fg)] ${PAGE_TITLE}`}>
            AmeriLife Gives Back Foundation
          </h1>
          <p className="mb-4 max-w-5xl text-base leading-relaxed text-[var(--color-muted)]">
            As a values-driven company, giving back is in AmeriLife&apos;s DNA and has been an important
            part of who we are for more than 50 years.
          </p>
          <p className="mb-4 max-w-5xl text-base leading-relaxed text-[var(--color-muted)]">
            Founded in 2022, the AmeriLife Gives Back Foundation honors our company&apos;s legacy of
            giving while helping to connect its growing business, philanthropic and volunteer
            endeavors.
          </p>
          <p className="mb-8 max-w-5xl text-base leading-relaxed text-[var(--color-muted)]">
            The foundation – through donations of time, money and other resources – focuses on causes
            that enable the senior community to aid in AmeriLife&apos;s commitment to helping people
            live longer, healthier lives.
          </p>
          <Link
            href={DONATE_URL}
            variant="button"
            className="inline-block rounded-[var(--radius-full)] bg-[var(--color-brand-dark)] px-8 py-3 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-white transition-colors hover:bg-[#1a3550]"
            target="_blank"
            rel="noopener noreferrer"
          >
            Donate Here
          </Link>
        </div>
      </div>

      {/* Supporting America's Senior Veterans — full-width video (no radius), text padded */}
      <div className="w-full bg-[var(--color-brand-dark)]">
        <div className="grid w-full grid-cols-1 items-stretch gap-0 lg:grid-cols-2">
          <div className="aspect-video w-full min-h-0 overflow-hidden bg-black/30">
            <iframe
              src="https://player.vimeo.com/video/1137018781?h=c6acc8d623&badge=0&autopause=0"
              title="Supporting Our Veterans: AmeriLife Gives Back Foundation & Honor Flight Network"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="block h-full w-full border-0"
            />
          </div>
          <div className="flex flex-col justify-center px-[var(--container-padding-x)] py-8 sm:py-10 lg:py-16 lg:pl-12 xl:pl-16">
            <h2 className="mb-6 text-xl font-semibold leading-snug text-white sm:text-2xl lg:text-3xl">
              Supporting America&apos;s Senior Veterans
            </h2>
            <p className="text-base leading-relaxed text-white/95">
              In 2023, AmeriLife{" "}
              <Link
                href={HONOR_FLIGHT_LINK}
                className="font-bold !text-white underline decoration-white underline-offset-2 transition-colors hover:!text-white/80"
                target="_blank"
                rel="noopener noreferrer"
              >
                entered into its inaugural, national partnership
              </Link>{" "}
              with the Honor Flight Network, a national nonprofit that honors America&apos;s
              military veterans – especially those who served during World War II, the Korean War
              and the Vietnam War – by bringing them, free of charge, to Washington, D.C. to visit
              the memorials to commemorate their sacrifice and service.
            </p>
          </div>
        </div>
      </div>

      {/* Making an Impact in Our Communities — full width gray */}
      <div className="w-full bg-[#f7f8f9] py-12 sm:py-16">
        <div className={`${PAGE_CONTENT} text-center`}>
          <h2 className={`mb-6 text-[var(--color-fg)] ${PAGE_TITLE}`}>
            Making an Impact in Our Communities
          </h2>
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-[var(--color-muted)]">
            Community partnerships that improve residents&apos; quality of life are part of
            AmeriLife&apos;s and its affiliated companies&apos; collective commitment to serving the
            areas where our customers, associates and agents live and work. We&apos;re proud to support
            local, national and global organizations that make a positive impact on the lives of
            people and families.
          </p>
        </div>
      </div>

      <div className="w-full bg-[var(--color-footer-bg)] py-8 sm:py-12">
        <div className={PAGE_CONTENT}>
          <GivesBackPhotoSlideshow
            imageSrcs={COMMUNITY_SLIDESHOW_IMAGES}
            ariaLabel="Christmas in July and community event photos"
          />
        </div>
      </div>

      <div className={`${PAGE_CONTENT} pt-12 sm:pt-16 lg:pt-20`}>
        {/* Celebrating Our Community Partners */}
        <div className="mb-16">
          <h2 className={`mb-12 text-center text-[var(--color-fg)] ${PAGE_TITLE}`}>
            Celebrating Our Community Partners
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-14">
            {WP_IMAGE_SOURCES.givesbackPartnerLogos.map((logo, i) => (
              <div
                key={i}
                className="flex h-24 w-44 items-center justify-center sm:h-28 sm:w-52"
              >
                <Link
                  href={logo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-full w-full items-center justify-center"
                >
                  <Image
                    src={rewriteUploadsUrl(logo.src)}
                    alt={logo.alt}
                    width={208}
                    height={104}
                    unoptimized
                    className="max-h-24 w-auto object-contain sm:max-h-28"
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Help Us Give Back — full width gray band */}
      <div className="w-full bg-[#f7f8f9] py-12 sm:py-16">
        <div className={`${PAGE_CONTENT} text-center`}>
          <h2 className={`mb-6 text-[var(--color-fg)] ${PAGE_TITLE}`}>
            Help Us Give Back
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-[var(--color-muted)]">
            Click the button below to make a tax-deductible donation to the AmeriLife Gives Back
            Foundation and help more of America&apos;s seniors – one life at a time.
          </p>
          <Link
            href={DONATE_URL}
            variant="button"
            className="inline-block rounded-[var(--radius-full)] bg-[var(--color-brand-dark)] px-8 py-3 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-white transition-colors hover:bg-[#1a3550]"
            target="_blank"
            rel="noopener noreferrer"
          >
            Donate Here
          </Link>
        </div>
      </div>
    </section>
  );
}
