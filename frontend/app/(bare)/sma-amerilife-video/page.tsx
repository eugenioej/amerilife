import type { Metadata } from "next";
import { Link } from "@/app/components/ui/Link";
import { staticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = staticPageMetadata(
  "AmeriLife and Senior Market Advisors (SMA) Video | AmeriLife",
  "AmeriLife and Senior Market Advisors (SMA) have joined forces. Learn about the partnership and how we're better together.",
  "/sma-amerilife-video/"
);

const ARROW_STROKE = 4;

function SmaConvergeArrows() {
  return (
    <p
      className="my-6 flex items-center justify-center sm:my-8"
      aria-hidden
    >
      <span className="inline-flex shrink-0 text-[#95c93d]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={56}
          height={56}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={ARROW_STROKE}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </span>
      <span className="-ml-3 inline-flex shrink-0 text-[#0679C2] sm:-ml-3.5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={56}
          height={56}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={ARROW_STROKE}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
      </span>
    </p>
  );
}

export default function SmaAmerilifeVideoPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative flex min-h-[50vh] flex-col items-center justify-center overflow-hidden py-20"
        style={{ background: "var(--gradient-header)" }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(30deg, transparent 40%, rgba(255,255,255,0.03) 40%),
              linear-gradient(-30deg, transparent 40%, rgba(255,255,255,0.03) 40%)
            `,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative z-10 mx-auto w-full max-w-[var(--container-max)] px-[var(--container-padding-x)] text-center">
          <h1
            className="mb-2 text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl lg:text-5xl"
            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
          >
            We are better together!
          </h1>
          <p className="text-lg font-semibold uppercase tracking-wide text-white/95 sm:text-xl lg:text-2xl">
            AmeriLife and Senior Market Advisors aligned.
          </p>
          <SmaConvergeArrows />

          {/* Video placeholder */}
          <div
            className="mt-8 w-full overflow-hidden rounded-lg border border-white/20 bg-black/30"
            style={{ aspectRatio: "16/9" }}
          >
            <div className="flex h-full flex-col items-center justify-center gap-2 text-white/80">
              <svg
                className="h-16 w-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm">Video placeholder</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Beginning of Better */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto w-full max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <h2 className="mb-6 text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
            The Beginning of Better
          </h2>
          <p className="mb-8 text-base leading-relaxed text-[var(--color-fg)]">
            At AmeriLife, we&apos;re always keeping an eye out for innovative and inspiring partners
            to join the AmeriLife family. We recently acquired{" "}
            <Link
              href="https://seniormarketadvisors.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Senior Market Advisors
            </Link>{" "}
            (SMA), one of the fastest-growing FMOs in the insurance space.
          </p>

          {/* ACCESS & TECHNOLOGY */}
          <h3 className="mb-4 text-2xl font-bold uppercase tracking-wide text-[var(--color-brand-primary)]">
            Access & Technology
          </h3>
          <div className="mb-12 space-y-4">
            <p className="text-base leading-relaxed text-[var(--color-fg)]">
              SMA will benefit from access to AmeriLife&apos;s sizable footprint including more than
              200,000 agents, over 60 insurance agency offices, and more than 35 affiliate
              locations. Thanks to SMA&apos;s innovation, AmeriLife partners will now have access to
              best-in-class Salesforce-enabled CRM systems, giving our associates the real-time data
              access necessary to better serve their clients.
            </p>
            <p className="text-base leading-relaxed text-[var(--color-fg)]">
              Pairing AmeriLife&apos;s scale and industry experience with SMA&apos;s innovative
              approach better enables us to further progress in our effort to ensure Americans have
              access to insurance and retirement solutions that fit their needs.
            </p>
          </div>

          {/* A CARING CULTURE */}
          <h3 className="mb-4 text-2xl font-bold uppercase tracking-wide text-[var(--color-brand-primary)]">
            A Caring Culture
          </h3>
          <div className="mb-12 space-y-4">
            <p className="text-base leading-relaxed text-[var(--color-fg)]">
              An important theme in this partnership is giving back. Both AmeriLife and SMA are
              dedicated to prioritizing people over profit. For that reason, SMA will reinvest $10
              million into its agency partners to help them grow their businesses. SMA has also
              committed to donating $10 million over the next five years to{" "}
              <Link
                href="https://www.charitywater.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                charity: water
              </Link>
              , bringing clean water to people in Uganda.
            </p>
            <p className="text-base leading-relaxed text-[var(--color-fg)]">
              Moving forward together, AmeriLife and SMA will work toward their mission-driven
              goals and continue to make a difference in the lives of the partners and communities
              we serve.
            </p>
          </div>

          <div className="mb-12 rounded-lg border border-[var(--color-border)] bg-[#f7f8f9] p-6 sm:p-8">
            <h3 className="mb-4 text-xl font-bold text-[var(--color-fg)]">Mission Statement</h3>
            <div className="space-y-4 text-base leading-relaxed text-[var(--color-fg)]">
              <p>
                <strong>AmeriLife:</strong> To offer insurance and retirement solutions to provide
                peace of mind and help people live longer, healthier lives.
              </p>
              <p>
                <strong>SMA:</strong> To be a collaborative team-player that leads our partners to
                success through innovative equipment, collaboration, and revolutionary technology. We
                play to win!
              </p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <Link
              href="https://amerilife.com/blog/press-release/amerilife-and-senior-market-advisors-join-forces-to-redefine-and-innovate-insurance-distribution/"
              target="_blank"
              rel="noopener noreferrer"
              variant="button"
              className="inline-flex w-fit items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-brand-primary)] px-6 py-3 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-white transition-colors hover:bg-[var(--color-brand-primary-hover)]"
            >
              Find out more about how the two companies have come together
            </Link>
            <Link
              href="https://seniormarketadvisors.com/"
              target="_blank"
              rel="noopener noreferrer"
              variant="button"
              className="inline-flex w-fit items-center justify-center rounded-[var(--radius-full)] border-2 border-[var(--color-brand-primary)] bg-white px-6 py-3 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-[var(--color-brand-primary)] transition-colors hover:bg-[var(--color-brand-primary)] hover:text-white"
            >
              Learn more about Senior Market Advisors
            </Link>
            <Link
              href="/partners/"
              variant="button"
              className="inline-flex w-fit items-center justify-center rounded-[var(--radius-full)] border-2 border-[var(--color-brand-primary)] bg-white px-6 py-3 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-[var(--color-brand-primary)] transition-colors hover:bg-[var(--color-brand-primary)] hover:text-white"
            >
              See how AmeriLife is helping its partners grow their businesses
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-[#0c2340] px-[var(--container-padding-x)] py-10 text-center text-sm text-white sm:py-12 sm:text-base">
        <div className="mx-auto w-full max-w-[var(--container-max)]">
          <p className="mb-3 leading-relaxed">
            Copyright © {new Date().getFullYear()} AmeriLife Group, LLC. All rights reserved.
          </p>
          <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <Link
              href="/terms/"
              variant="button"
              className="font-medium text-white underline-offset-2 transition-colors hover:text-white/90 hover:underline"
            >
              Terms of Use
            </Link>
            <span className="text-white/80" aria-hidden>
              |
            </span>
            <Link
              href="/privacy-policy/"
              variant="button"
              className="font-medium text-white underline-offset-2 transition-colors hover:text-white/90 hover:underline"
            >
              Privacy Statement
            </Link>
          </p>
        </div>
      </footer>
    </>
  );
}
