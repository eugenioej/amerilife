import type { Metadata } from "next";
import Image from "next/image";
import { FadeInOnView } from "@/app/components/ui/FadeInOnView";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import { rewriteUploadsUrl } from "@/lib/wp-media";
import {
  IconFileMedical,
  IconUserPlus,
  IconHandHoldingMedical,
  IconLifeRing,
  IconBoxOpen,
  IconCogs,
  IconNetworkWired,
  IconShieldHalved,
  IconBuildingColumns,
} from "@/app/components/our-solutions/CarrierIcons";
import { JsonLd } from "@/app/components/seo/JsonLd";
import { breadcrumbJsonLd, staticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = staticPageMetadata(
  "Carrier Partners | AmeriLife",
  "Learn how AmeriLife distributes insurance solutions through our powerful network of industry-leading insurance carrier partnerships.",
  "/our-solutions/carriers/"
);

const UPLOADS = "https://amerilife.com/wp-content/uploads";
const HERO_IMAGE = `${UPLOADS}/2021/12/Carriers_Hero_1420x1144.png`;
const BANNER_10 = `${UPLOADS}/2021/12/banner-10.png`;

const PRODUCT_EXPERTISE = [
  { icon: IconFileMedical, title: "Medicare\nAdvantage" },
  { icon: IconUserPlus, title: "Medicare\nSupplement" },
  { icon: IconHandHoldingMedical, title: "Health\nSpecialty" },
  { icon: IconLifeRing, title: "Life\nInsurance" },
  { icon: IconBoxOpen, title: "Annuities &\nRetirement Planning" },
] as const;

const VALUE_SECTIONS = [
  {
    icon: IconCogs,
    title: "Product Development &\nGTM Capabilities",
    description:
      "Development, implementation and delivery capabilities, giving our distribution partners a competitive edge and expanding their consumer reach.",
    items: [
      "Product design and pricing (proprietary and non-proprietary)",
      "Go-to-market planning and strategy",
      "Marketing services and lead generation support",
      "Market expansion support",
    ],
  },
  {
    icon: IconNetworkWired,
    title: "Multichannel Distribution",
    description:
      "Industry-leading, cost effective and high ROI distribution network designed to connect and engage with consumers and stakeholders across the country.",
    items: [
      "Brokerage Division",
      "Career Agency",
      "Direct to Consumer (Telesales)",
      "Worksite",
      "Institutional Wealth Management, Broker-Dealer & RIA",
    ],
  },
  {
    icon: IconShieldHalved,
    title: "Effective Agent &\nDistribution Oversight",
    description:
      "Best-in-class, industry leading compliance standards and practices — developed in collaboration with our carrier partners — that support distribution expansion.",
    items: [
      "Enterprise-wide compliance standards",
      "Call center certification",
      "Centralized protocols for complaint resolution",
    ],
  },
  {
    icon: IconBuildingColumns,
    title: "Third-Party\nAdministration",
    description:
      "Third-Party Administration (TPA) services built on industry-leading technology and delivered at scale to allow carriers to focus on building their businesses.",
    items: [
      "Turnkey solutions across multiple product lines",
      "Agent contracting",
      "Commission payments",
      "New business development",
      "Underwriting and premium",
      "Billing and collections",
      "Policy and claims administration",
      "Customer service call centers",
      "Print, mail and other administrative services",
    ],
  },
] as const;

export default function CarriersPage() {
  return (
    <article className="bg-white">
      <JsonLd
        schema={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Our Solutions", path: "/our-solutions/" },
          { name: "Carrier Partners", path: "/our-solutions/carriers/" },
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
              { label: "Our Solutions", href: "/our-solutions/" },
              { label: "Carrier Partners" },
            ]}
          />
          <h1 className="text-[32px] font-semibold leading-[38px] text-[#244260] sm:text-5xl sm:leading-[64px]">
            Carrier Partners
          </h1>
        </FadeInOnView>
      </div>

      {/* Hero: Your Products, One Powerful Network - 2-col: gray left, image right */}
      <FadeInOnView
        direction="up"
        className="grid min-h-0 w-full grid-cols-1 border-t border-[#e8ede8] lg:grid-cols-2"
      >
        <div className="flex flex-col justify-center bg-[#f7f8f9] px-[var(--container-padding-x)] py-12 lg:py-16 lg:pl-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))]">
          <h2 className="mb-6 text-2xl font-bold uppercase tracking-wide text-[var(--color-brand-primary)] sm:text-3xl lg:text-4xl">
            Your Products,
            <br />
            One Powerful Network
          </h2>
          <p className="mb-6 max-w-xl text-base leading-relaxed text-[var(--color-fg)]">
            Today, carriers need more than just a good distributor. They need a partner with a legacy
            of multi-product innovation, commitment to collaboration, and focus on delivering enhanced
            value to its distribution and, ultimately, consumers.
          </p>
          <p className="mb-6 text-base leading-relaxed text-[var(--color-fg)]">
            Over the years, AmeriLife has built strong relationships with many of the nation&apos;s
            top-rated insurance companies, and insurers continue to count on AmeriLife to represent
            their brands, effectively position their products in the marketplace and leverage its
            powerful distribution network to deliver on the promise of their shared goals.
          </p>
          <p className="mb-0 max-w-xl text-base leading-relaxed text-[var(--color-fg)]">
            In today&apos;s market, a strong, collaborative relationship between carrier and
            distributor is essential to delivering innovative, high-quality insurance products that
            can meet the growing needs of marketers, agents and their clients.
          </p>
        </div>
        <div className="relative aspect-[1420/1144] w-full overflow-hidden lg:aspect-auto lg:min-h-[400px]">
          <Image
            src={rewriteUploadsUrl(HERO_IMAGE)}
            alt="AmeriLife carrier partners"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
      </FadeInOnView>

      {/* Brad Shelton quote — aligned with /our-solutions/employees & agents-and-advisors */}
      <FadeInOnView
        direction="up"
        className="relative min-h-[320px] w-full overflow-hidden bg-cover bg-center py-16 lg:py-20"
        style={{ backgroundImage: `url(${rewriteUploadsUrl(BANNER_10)})` }}
      >
        <div className="absolute inset-0 bg-black/20" aria-hidden />
        <div className="relative mx-auto flex w-full max-w-[var(--container-max)] flex-col items-center justify-center px-[var(--container-padding-x)] text-center">
          <blockquote className="mb-8 w-full max-w-6xl text-xl font-medium leading-relaxed text-white sm:text-2xl lg:text-3xl">
            &ldquo;In today&apos;s market, a strong, collaborative relationship between carrier and
            distributor is essential to delivering innovative, high-quality insurance products that
            can meet the growing needs of marketers, agents and their clients.&rdquo;
          </blockquote>
          <h2 className="mb-2 text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
            Brad Shelton
          </h2>
          <p className="mb-0 text-base font-medium text-white/90">
            Executive Vice President, Product Innovation
          </p>
        </div>
      </FadeInOnView>

      {/* Our Product Expertise - 5 cards with icons */}
      <div className="bg-[#f0f0f0] py-16 sm:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <h2 className="mb-12 text-center text-3xl font-semibold leading-tight text-[var(--color-fg)] sm:text-4xl lg:text-5xl">
            Our Product Expertise
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {PRODUCT_EXPERTISE.map((item, i) => {
              const Icon = item.icon;
              return (
                <FadeInOnView
                  key={i}
                  direction="up"
                  delay={i * 60}
                  className="flex flex-col items-center rounded-lg bg-[#e2e5ed] p-8 text-center sm:p-10"
                >
                  <div className="mb-4">
                    <Icon />
                  </div>
                  <h3 className="whitespace-pre-line text-lg font-bold text-[var(--color-fg)]">
                    {item.title}
                  </h3>
                </FadeInOnView>
              );
            })}
          </div>
        </div>
      </div>

      {/* The Value We Provide - 4 sections with bullet lists */}
      <div className="py-16 sm:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <h2 className="mb-12 text-center text-3xl font-semibold leading-tight text-[var(--color-fg)] sm:text-4xl lg:text-5xl">
            The Value We Provide
          </h2>
          <div className="grid gap-12 sm:grid-cols-2">
            {VALUE_SECTIONS.map((section, i) => {
              const Icon = section.icon;
              return (
                <FadeInOnView
                  key={i}
                  direction="up"
                  delay={i * 80}
                  className="flex flex-col rounded-lg bg-[#e2e5ed] p-8 sm:p-10"
                >
                  <div className="mb-4">
                    <Icon />
                  </div>
                  <h3 className="mb-4 whitespace-pre-line text-xl font-bold uppercase tracking-wide text-[var(--color-fg)]">
                    {section.title}
                  </h3>
                  <p className="mb-6 text-base leading-relaxed text-[var(--color-fg)]">
                    {section.description}
                  </p>
                  <ul className="list-disc space-y-2 pl-6 text-base leading-relaxed text-[var(--color-fg)]">
                    {section.items.map((listItem, j) => (
                      <li key={j}>{listItem}</li>
                    ))}
                  </ul>
                </FadeInOnView>
              );
            })}
          </div>
        </div>
      </div>
    </article>
  );
}
