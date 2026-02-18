import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/app/components/ui/Link";
import { rewriteUploadsUrl } from "@/lib/wp-media";
import { WP_IMAGE_SOURCES } from "@/lib/wp-image-sources";

export const metadata: Metadata = {
  title: "AmeriLife Gives Back Foundation | AmeriLife",
  description:
    "As a values-driven company, giving back is in AmeriLife's DNA. The AmeriLife Gives Back Foundation supports senior veterans and community partnerships.",
};

const DONATE_URL = "https://buy.stripe.com/eVa2bi8vObFP9u83cc";
const HONOR_FLIGHT_LINK =
  "https://amerilife.com/blog/announcements/amerilife-gives-back-foundation-names-honor-flight-network-as-inaugural-partner/";

export default function GivesBackPage() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-[var(--color-muted)]" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li>
              <Link href="/" className="text-[var(--color-link)] transition-colors hover:text-[var(--color-link-hover)]">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[var(--color-fg)]" aria-current="page">
              AmeriLife Gives Back Foundation
            </li>
          </ol>
        </nav>

        {/* Hero */}
        <div className="mb-16 flex flex-col items-center text-center">
          <Image
            src={rewriteUploadsUrl(WP_IMAGE_SOURCES.givesbackFoundationLogo)}
            alt="AmeriLife Gives Back"
            width={160}
            height={160}
            className="mb-6 h-32 w-32 object-contain sm:h-40 sm:w-40"
          />
          <h1 className="mb-4 text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
            AmeriLife Gives Back Foundation
          </h1>
          <p className="mb-4 max-w-2xl text-base leading-relaxed text-[var(--color-muted)]">
            As a values-driven company, giving back is in AmeriLife&apos;s DNA and has been an important
            part of who we are for more than 50 years.
          </p>
          <p className="mb-4 max-w-2xl text-base leading-relaxed text-[var(--color-muted)]">
            Founded in 2022, the AmeriLife Gives Back Foundation honors our company&apos;s legacy of
            giving while helping to connect its growing business, philanthropic and volunteer
            endeavors.
          </p>
          <p className="mb-8 max-w-2xl text-base leading-relaxed text-[var(--color-muted)]">
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

        {/* Supporting America's Senior Veterans */}
        <div className="mb-16 rounded-lg bg-[var(--color-brand-dark)] p-8 sm:p-12">
          <div className="mx-auto grid max-w-4xl gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-black/30">
              <iframe
                src="https://player.vimeo.com/video/1137018781?h=c6acc8d623&badge=0&autopause=0"
                title="Supporting Our Veterans: AmeriLife Gives Back Foundation & Honor Flight Network"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="mb-6 text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
                Supporting America&apos;s Senior Veterans
              </h2>
              <p className="text-base leading-relaxed text-white/95">
                In 2023, AmeriLife{" "}
                <Link
                  href={HONOR_FLIGHT_LINK}
                  className="font-bold text-[var(--color-brand-primary)] underline transition-colors hover:text-[var(--color-brand-secondary)]"
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

        {/* Making an Impact in Our Communities */}
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
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

        {/* Celebrating Our Community Partners */}
        <div className="mb-16">
          <h2 className="mb-12 text-center text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
            Celebrating Our Community Partners
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {WP_IMAGE_SOURCES.givesbackPartnerLogos.map((logo, i) => (
              <div
                key={i}
                className="flex h-16 w-32 items-center justify-center grayscale opacity-80 transition-opacity hover:grayscale-0 hover:opacity-100"
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
                    width={128}
                    height={64}
                    unoptimized
                    className="max-h-16 w-auto object-contain"
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Help Us Give Back */}
        <div className="rounded-lg bg-[var(--color-brand-dark)] p-8 text-center sm:p-12">
          <h2 className="mb-6 text-2xl font-bold text-white sm:text-3xl">Help Us Give Back</h2>
          <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-white/95">
            Click the button below to make a tax-deductible donation to the AmeriLife Gives Back
            Foundation and help more of America&apos;s seniors – one life at a time.
          </p>
          <Link
            href={DONATE_URL}
            variant="button"
            className="inline-block rounded-[var(--radius-full)] bg-white px-8 py-3 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-[var(--color-brand-dark)] transition-colors hover:bg-white/90"
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
