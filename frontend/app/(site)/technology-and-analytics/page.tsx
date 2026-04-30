import type { Metadata } from "next";
import Image from "next/image";
import { JsonLd } from "@/app/components/seo/JsonLd";
import { FadeInOnView } from "@/app/components/ui/FadeInOnView";
import { Link } from "@/app/components/ui/Link";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import { rewriteUploadsUrl } from "@/lib/wp-media";
import { getTechnologyByNumberIcon } from "@/app/components/about-us/TechnologyIcons";
import { Building2, Flag } from "lucide-react";
import { breadcrumbJsonLd, staticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = staticPageMetadata(
  "Technology & Analytics | AmeriLife",
  "AmeriLife's technology stack, analytics platforms, and proprietary digital tools are designed to empower marketers, agents and advisors to drive meaningful client experiences.",
  "/technology-and-analytics/"
);

const UPLOADS = "https://headlessameril.wpenginepowered.com/wp-content/uploads";

/** Hero image (headless WP) */
const HERO_IMAGE =
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/04/Tech_Analytics_Hero_1422x1144.webp";

/** By the Numbers section - OG uses banner-10.png as background */
const BY_THE_NUMBERS_BG = `${UPLOADS}/2021/12/banner-10.png`;

const BY_THE_NUMBERS = [
  { stat: "3,000,000", label: "claims paid" },
  {
    stat: "165,000",
    label: "Med Supp, Life & Annuities policies administered",
  },
  { stat: "$72MM", label: "in commissions paid out" },
  {
    stat: "45,000",
    label: "agents powered by Agent Xcelerator®",
  },
  { stat: "365", label: "data servers supported" },
  {
    stat: "65%",
    label: "of all Life & Annuities apps processed were eApps",
  },
] as const;

const FOR_AFFILIATES = [
  "Modern Approach to Agency Operations: Constantly improving onboarding, automating commissions, and increasing transparency in communication to provide a trust-based carrier and agent experience",
  "Industry-Leading Shared Services Solutions: Extensive suite of best-in-class business solutions, including finance and accounting, HR, cyber and data security, and real-time data-powered analytics dashboards",
  "Unique CRM solution: Leading CRM platform customized for IMO marketers, with insights-powered marketing campaigns, customizable agent training materials, and much more",
  "Full Suite of Medicare Sales Solutions: YourMedicare™ portal with access to proprietary tools, materials and support at every step of your client's Medicare journey",
  "Enhanced Telesales Capabilities: Proprietary \"call center in a box\" SaaS platform for Medicare call centers, combined with best-in-class telesales compliance management programs",
] as const;

const FOR_INDEPENDENT_AGENTS = [
  "On-Demand Marketing Support: Digital marketing consultation and best practices from experienced marketing and communications practitioners",
  "Real-time Sales Insights & Analyses: Accessible from anywhere via AmeriLife's Agent Insights™ mobile portal",
  "Day-to-Day Book of Business Management: Agents can manage their book of business from prospecting, quoting and enrolling to everything in between with AmeriLife's Agent Xcelerator™",
  "Simplified Enrollment for Agents and Clients: Proprietary configurations of the most popular digital quote-and-enroll solutions across our broad product portfolio, from Medicare to annuities, to enable agents to conveniently interact with their clients",
] as const;

const cardIconProps = {
  size: 48,
  strokeWidth: 1.5,
  className: "text-[var(--color-brand-primary)]",
  "aria-hidden": true as const,
};

function StarBullet() {
  return (
    <span className="mr-2 inline-block text-[var(--color-brand-primary)]" aria-hidden>
      &#9734;
    </span>
  );
}

/** Bolds the substring before the first colon (label: body). */
function BulletWithBoldLead({ text }: { text: string }) {
  const colon = text.indexOf(":");
  if (colon === -1) {
    return <>{text}</>;
  }
  return (
    <>
      <strong className="font-bold">{text.slice(0, colon)}</strong>
      {text.slice(colon)}
    </>
  );
}

export default function TechnologyAndAnalyticsPage() {
  return (
    <article className="bg-white">
      <JsonLd
        schema={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Technology & Analytics", path: "/technology-and-analytics/" },
        ])}
      />
      <div className="bg-white">
        <FadeInOnView
          direction="fade"
          threshold={0}
          className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-10 sm:py-12 lg:py-14"
        >
          <SiteBreadcrumb
            className="mb-8"
            items={[
              { label: "Home", href: "/" },
              { label: "Technology & Analytics" },
            ]}
          />
          <h1 className="text-[32px] font-semibold leading-[38px] text-[#244260] sm:text-5xl sm:leading-[64px]">
            Technology & Analytics
          </h1>
        </FadeInOnView>
      </div>

      {/* Hero - 2-col: copy left, image right */}
      <FadeInOnView
        direction="up"
        className="grid min-h-0 w-full grid-cols-1 lg:grid-cols-2"
      >
        <div className="flex flex-col justify-center bg-white px-[var(--container-padding-x)] py-12 lg:py-16 lg:pl-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))]">
          <h2 className="mb-6 text-2xl font-bold uppercase tracking-wide text-[var(--color-brand-primary)] sm:text-3xl lg:text-4xl">
            Technology to Help Strengthen Client Relationships
          </h2>
          <p className="mb-4 max-w-xl text-base leading-relaxed text-[var(--color-fg)]">
            At AmeriLife, we know that technological advancements are exciting —
            but they&apos;re only as good as their ability to empower the
            business — <em>your</em> business — of helping clients live longer,
            healthier and more secure lives.
          </p>
          <p className="max-w-xl text-base leading-relaxed text-[var(--color-fg)]">
            That&apos;s why our technology stack, analytics platforms, and
            proprietary digital tools are designed to ensure that the resources
            we put in our marketers&apos;, agents&apos; and advisors&apos; hands
            are easy to use and drive meaningful client experiences — not
            replace them.
          </p>
        </div>
        <div className="relative aspect-[746/660] w-full overflow-hidden lg:aspect-auto lg:min-h-[400px]">
          <Image
            src={rewriteUploadsUrl(HERO_IMAGE)}
            alt="AmeriLife technology and Agent Xcelerator"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            unoptimized
          />
        </div>
      </FadeInOnView>

      {/* Operations & Technology: 2021 By the Numbers */}
      <section
        className="relative min-h-[400px] overflow-hidden bg-cover bg-center py-16 sm:py-24"
        style={{
          backgroundImage: `url(${rewriteUploadsUrl(BY_THE_NUMBERS_BG)})`,
        }}
      >
        <div className="absolute inset-0 bg-black/30" aria-hidden />
        <div className="relative">
          <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
            <h2 className="mb-12 text-center text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
              Operations & Technology: 2021 By the Numbers
            </h2>
            {/* First row: 2 columns */}
            <div className="mb-8 grid gap-8 sm:grid-cols-2">
              {[BY_THE_NUMBERS[0], BY_THE_NUMBERS[1]].map((item, i) => {
                const Icon = getTechnologyByNumberIcon(i);
                return (
                  <div
                    key={i}
                    className="flex flex-col items-center rounded-lg bg-white/10 p-8 text-center backdrop-blur-sm"
                  >
                    <div className="mb-4">
                      <Icon />
                    </div>
                    <span className="mb-2 text-4xl font-bold text-white sm:text-5xl">
                      {item.stat}
                    </span>
                    <span className="text-sm text-white/90 sm:text-base">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Remaining stats */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {BY_THE_NUMBERS.slice(2).map((item, i) => {
                const Icon = getTechnologyByNumberIcon(i + 2);
                return (
                  <div
                    key={i + 2}
                    className="flex flex-col items-center rounded-lg bg-white/10 p-8 text-center backdrop-blur-sm"
                  >
                    <div className="mb-4">
                      <Icon />
                    </div>
                    <span className="mb-2 text-4xl font-bold text-white sm:text-5xl">
                      {item.stat}
                    </span>
                    <span className="text-sm text-white/90 sm:text-base">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Unique Data & Technology Resources */}
      <section className="bg-[#f7f8f9] py-16 sm:py-24">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <h2 className="mb-12 text-center text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
            Unique Data & Technology Resources Available to AmeriLife&apos;s
            Partners
          </h2>
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="rounded-lg border border-[var(--color-border)] bg-white p-8 shadow-sm sm:p-10">
              <div className="mb-4">
                <Building2 {...cardIconProps} />
              </div>
              <h3 className="mb-6 text-xl font-bold uppercase tracking-wide text-[var(--color-fg)]">
                For Affiliates
              </h3>
              <ul className="list-none space-y-2 pl-0 text-base leading-relaxed text-[var(--color-fg)]">
                {FOR_AFFILIATES.map((item, i) => (
                  <li key={i} className="flex items-start">
                    <StarBullet />
                    <span>
                      <BulletWithBoldLead text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/our-solutions/agents-and-advisors/"
              variant="button"
              className="group flex flex-col rounded-lg border border-[var(--color-border)] bg-white p-8 shadow-sm transition-shadow hover:border-[var(--color-brand-primary)]/35 hover:shadow-md sm:p-10"
            >
              <div className="mb-4">
                <Flag {...cardIconProps} />
              </div>
              <h3 className="mb-6 text-xl font-bold uppercase tracking-wide text-[var(--color-fg)] group-hover:text-[var(--color-brand-primary)]">
                For Independent Agents
              </h3>
              <ul className="list-none space-y-2 pl-0 text-left text-base leading-relaxed text-[var(--color-fg)]">
                {FOR_INDEPENDENT_AGENTS.map((item, i) => (
                  <li key={i} className="flex items-start">
                    <StarBullet />
                    <span>
                      <BulletWithBoldLead text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
