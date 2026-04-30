import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import { GravityForm } from "@/app/components/gravity-forms/GravityForm";
import { Link } from "@/app/components/ui/Link";
import type { GfFormData } from "@/lib/gf-types";
import {
  FLORIDA_MARKET_OFFICES,
  type FloridaMarketOffice,
} from "@/lib/florida-market-data";
import { telHrefPlusOne } from "@/lib/us-tel-href";

const officeCardMapButtonClass =
  "motion-cta inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-full)] border-2 border-[var(--color-brand-primary)] bg-white px-5 py-2.5 text-center text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-[var(--color-brand-primary)] transition-colors hover:border-[var(--color-brand-primary-hover)] hover:text-[var(--color-brand-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:ring-offset-2 no-underline hover:no-underline";

const officeCardViewOfficeButtonClass =
  "motion-cta inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-full)] border-2 border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)] px-5 py-2.5 text-center text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-white transition-colors hover:border-[var(--color-brand-primary-hover)] hover:bg-[var(--color-brand-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:ring-offset-2 no-underline hover:no-underline";

type FloridaMarketViewProps = {
  connectForm: GfFormData | null;
};

function OfficeCard({ office }: { office: FloridaMarketOffice }) {
  const telHref = telHrefPlusOne(office.phoneDisplay);

  return (
    <article className="border border-[var(--color-border)] bg-white px-6 py-7 shadow-sm sm:px-8 sm:py-8">
      <div className="relative mb-6 aspect-square w-full max-w-[260px] overflow-hidden rounded-[3px] bg-[#e8eef2] mx-auto md:mx-0">
        <Image
          src={office.photoUrl}
          alt={office.contactName}
          fill
          className="object-cover object-[50%_10%]"
          sizes="(max-width: 768px) 90vw, 260px"
        />
      </div>
      <h2 className="mb-4 text-xl font-bold text-[var(--color-brand-dark)] sm:text-2xl">
        {office.name}
      </h2>
      <p className="mb-4 text-[0.95rem] leading-relaxed text-[var(--color-fg)]">
        <span className="font-semibold">{office.roleLabel}:</span> {office.contactName}{" "}
        <a
          className="font-semibold text-[var(--color-link)] underline underline-offset-[3px]"
          href={`mailto:${office.email}`}
        >
          {office.email}
        </a>
      </p>
      <p className="mb-2 text-[0.95rem] leading-relaxed text-[var(--color-fg)]">
        <span className="font-semibold">Hours:</span> Monday–Friday 8am–5pm
      </p>
      <p className="mb-4 text-[0.95rem] leading-relaxed text-[var(--color-fg)]">
        <span className="font-semibold">Phone:</span>{" "}
        {telHref ? (
          <a className="font-semibold text-[var(--color-link)] underline underline-offset-[3px]" href={telHref}>
            {office.phoneDisplay}
          </a>
        ) : (
          office.phoneDisplay
        )}
      </p>
      <address className="mb-0 block text-[0.95rem] not-italic leading-relaxed text-[var(--color-fg)]">
        {office.addressLines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </address>
      <div className="mt-6 flex w-full flex-col gap-3">
        <a
          href={office.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={officeCardMapButtonClass}
        >
          Click here for map
        </a>
        <Link href={`/${office.officeSlug}/`} variant="button" className={officeCardViewOfficeButtonClass}>
          View office
          <ChevronRight size={16} aria-hidden />
        </Link>
      </div>
    </article>
  );
}

export function FloridaMarketView({ connectForm }: FloridaMarketViewProps) {
  return (
    <article className="bg-white">
      <div className="border-b border-[#dfe7ec] bg-[#f6faff]">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-3 sm:py-[0.9rem]">
          <SiteBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Find an Agent Florida" }]} />
        </div>
      </div>

      <div className="w-full bg-[var(--color-brand-primary)] px-[var(--container-padding-x)] py-11 text-white sm:py-14">
        <div className="mx-auto max-w-[var(--container-max)] text-left">
          <h1 className="text-[1.6875rem] font-bold leading-tight tracking-tight sm:text-[2.125rem] lg:text-[2.625rem]">
            Find an Agent Florida
          </h1>
          <p className="mt-5 max-w-2xl text-lg font-semibold text-white/95 sm:text-xl">AmeriLife of Florida, LLC</p>
        </div>
      </div>

      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-12 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-3">
          {FLORIDA_MARKET_OFFICES.map((office) => (
            <OfficeCard key={office.name} office={office} />
          ))}
        </div>

        <p className="mt-12 border-t border-[var(--color-border)] pt-8 text-sm leading-relaxed text-[var(--color-muted)]">
          Clicking third-party links opens a new tab and leaves this site. AmeriLife does not control linked
          sites&apos; content.
        </p>
      </div>

      <section className="border-t border-[var(--color-border)] bg-[#f8fafb] px-[var(--container-padding-x)] py-12 text-left sm:py-16">
        <div className="mx-auto max-w-[var(--container-max)]">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] lg:items-start lg:gap-x-10 xl:gap-x-14">
            <div>
              <h2 className="text-left text-2xl font-bold text-[var(--color-brand-dark)] sm:text-3xl lg:text-[2.125rem]">
                One AmeriLife, many possibilities
              </h2>
              <div className="mt-8 space-y-6 text-left text-base leading-[1.75] text-[var(--color-fg)]">
                <p>
                  More and more Americans are buying insurance to protect their families, according to a{" "}
                  <a
                    href="https://www.prnewswire.com/news-releases/limra--nearly-5-million-more-us-households-have-life-insurance-coverage-300335782.html"
                    className="text-[var(--color-link)] underline underline-offset-[3px]"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    recent study
                  </a>
                  . Perhaps you are one of them.
                </p>
                <p>
                  We offer affordable insurance and retirement solutions to empower people to live longer,
                  healthier lives. Since the early 1970s, AmeriLife agents have collaborated with people to learn their
                  stories and find insurance and retirement solutions to address their concerns and ease their fears of
                  the unknown.
                </p>
                <p>What hasn&apos;t changed over the years is our commitment to help people live happier and healthier lives.</p>
                <p>
                  Today, AmeriLife has nearly 60 insurance offices throughout the United States, and is growing and
                  expanding into new markets. We work with 70+ carrier partners, many rated &ldquo;A+&rdquo; or
                  &ldquo;A&rdquo; by A.M. Best, a U.S.-based insurance industry rating agency. This allows our agents to
                  offer an extensive portfolio of quality annuity, life and health insurance products.
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-[var(--color-border)] bg-white p-6 shadow-sm sm:p-8">
              <h3 className="text-lg font-bold text-[var(--color-brand-dark)] sm:text-xl">Find an agent</h3>
              <p className="mt-2 text-sm text-[var(--color-muted)] sm:text-[0.95rem]">
                Connect with our Florida market team using the form below.
              </p>
              <div className="mt-6">
                {connectForm ? (
                  <>
                    <GravityForm form={connectForm} />
                    <p className="mt-6 text-center text-sm text-[var(--color-muted)] sm:text-[0.95rem]">
                      A licensed sales representative may contact you to listen to your needs.
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-[var(--color-muted)]">
                    The contact form could not be loaded. Please try again later.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
