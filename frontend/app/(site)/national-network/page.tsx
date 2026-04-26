import type { Metadata } from "next";
import Image from "next/image";
import { JsonLd } from "@/app/components/seo/JsonLd";
import { FadeInOnView } from "@/app/components/ui/FadeInOnView";
import { Link } from "@/app/components/ui/Link";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import { rewriteUploadsUrl } from "@/lib/wp-media";
import { Handshake, Trophy, Lightbulb } from "lucide-react";
import { breadcrumbJsonLd, staticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = staticPageMetadata(
  "National Network | AmeriLife",
  "AmeriLife represents a vast national network of affiliates and partners aligned under one mission: to provide solutions that deliver peace of mind and help people across the United States live longer, healthier lives.",
  "/national-network/"
);

const UPLOADS = "https://amerilife.com/wp-content/uploads";
const HERO_IMAGE = `${UPLOADS}/2021/12/National_Network_1420x1144.png`;

const SCALE_DRIVERS = [
  {
    icon: Handshake,
    title: "Active Partnership",
    description:
      "The power and financial capital of private equity partner Thomas H. Lee Partners",
  },
  {
    icon: Trophy,
    title: "Inspired Leadership",
    description:
      "A deep bench of the industry's top strategic advisors and sales and marketing leaders",
  },
  {
    icon: Lightbulb,
    title: "Pioneering Innovation",
    description:
      "A relentless commitment to innovation and game-changing financial solutions",
  },
] as const;

const LEVERAGE_OPTIONS = [
  {
    title: "Carrier Partners",
    description:
      "A distributor whose capabilities are as innovative as they are far reaching.",
    href: "/our-solutions/carriers/",
  },
  {
    title: "Affiliates",
    description:
      "An ally to help you grow your business, with a network of like-minded entrepreneurs who want to see you succeed.",
    href: "/our-solutions/affiliates/",
  },
  {
    title: "Agents & Advisors",
    description: "A partner to help you take your professional ambitions to new heights.",
    href: "/our-solutions/agents-and-advisors/",
  },
  {
    title: "Consumers",
    description:
      "An advocate who can meet your health and retirement needs, with agents in every zip code.",
    href: "/our-solutions/consumers/",
  },
  {
    title: "Employees",
    description:
      "An employer who will never be too big for its people-first culture.",
    href: "/our-solutions/employees/",
  },
] as const;

const iconProps = {
  size: 48,
  strokeWidth: 1.5,
  className: "text-[var(--color-brand-primary)]",
  "aria-hidden": true as const,
};

export default function NationalNetworkPage() {
  return (
    <article className="bg-white">
      <JsonLd
        schema={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "National Network", path: "/national-network/" },
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
            items={[{ label: "Home", href: "/" }, { label: "National Network" }]}
          />
          <h1 className="text-[32px] font-semibold leading-[38px] text-[#244260] sm:text-5xl sm:leading-[64px]">
            National Network
          </h1>
        </FadeInOnView>
      </div>

      {/* Hero: National Reach, Local Expertise - 2-col */}
      <FadeInOnView
        direction="up"
        className="grid min-h-0 w-full grid-cols-1 lg:grid-cols-2"
      >
        <div className="flex flex-col justify-center bg-white px-[var(--container-padding-x)] py-12 lg:py-16 lg:pl-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))]">
          <h2 className="mb-6 text-xl font-bold uppercase tracking-wide text-[var(--color-brand-primary)] sm:text-2xl">
            National Reach,
            <br />
            Local Expertise
          </h2>
          <p className="mb-6 max-w-xl text-base leading-relaxed text-[var(--color-fg)]">
            From humble beginnings dating back a half-century, AmeriLife has evolved from a small
            insurance sales office into one of the largest distributors of health, life, annuity and
            retirement planning solutions in the country. But we haven&apos;t forgotten our roots.
          </p>
          <p className="mb-0 max-w-xl text-base leading-relaxed text-[var(--color-fg)]">
            Today, AmeriLife represents a vast national network of affiliates and partners aligned
            under one mission: to provide solutions that deliver peace of mind and help people —
            across the United States — live longer, healthier lives.
          </p>
        </div>
        <div className="relative aspect-[1420/1144] w-full overflow-hidden bg-[#e8ebe8] lg:aspect-auto lg:min-h-[400px]">
          <Image
            src={rewriteUploadsUrl(HERO_IMAGE)}
            alt="AmeriLife national network"
            fill
            className="object-cover object-top"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
      </FadeInOnView>

      {/* Our ability to scale is driven by - 3 cards with icons */}
      <div className="bg-[#f0f0f0] py-16 sm:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <h2 className="mb-12 text-center text-3xl font-semibold leading-tight text-[var(--color-fg)] sm:text-4xl lg:text-5xl">
            Our ability to scale is driven by:
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {SCALE_DRIVERS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="flex flex-col rounded-lg bg-[#e2e5ed] p-8 sm:p-10"
                >
                  <div className="mb-4">
                    <Icon {...iconProps} />
                  </div>
                  <h3 className="mb-4 text-xl font-bold uppercase tracking-wide text-[var(--color-fg)]">
                    {item.title}
                  </h3>
                  <p className="mb-0 text-base leading-relaxed text-[var(--color-fg)]">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Leveraging Our National Network for You - 5 link cards */}
      <div className="py-16 sm:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <h2 className="mb-12 text-center text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
            Leveraging Our National Network for You
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {LEVERAGE_OPTIONS.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                variant="button"
                className="group flex flex-col rounded-lg bg-[#e2e5ed] p-8 transition-colors hover:bg-[#d5d9e8] sm:p-10"
              >
                <h3 className="mb-4 text-xl font-bold uppercase tracking-wide text-[var(--color-fg)] group-hover:text-[var(--color-brand-primary)]">
                  {item.title}
                </h3>
                <p className="mb-0 text-base leading-relaxed text-[var(--color-fg)]">
                  {item.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-brand-primary)]">
                  Learn more
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
