import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/app/components/ui/Link";
import { rewriteUploadsUrl } from "@/lib/wp-media";
import { Package, Layers, Flag } from "lucide-react";
import { staticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = staticPageMetadata(
  "Flexibility & Optionality | AmeriLife",
  "At AmeriLife, we embrace your uniqueness. We're a partner that aligns and grows with you, pivots with you, and develops solutions that are as flexible and nimble as today's ever-changing market demands.",
  "/flexibility-and-optionality/"
);

const UPLOADS = "https://amerilife.com/wp-content/uploads";
const HERO_IMAGE = `${UPLOADS}/2022/01/Flex_Option_HeroA_1420x1144.png`;

const OFFERINGS = [
  {
    icon: Package,
    title: "Industry-Leading Products",
    description:
      "A broad suite of products from more than 100 carriers to customize and bundle with consumers' total health and financial wellbeing in mind.",
  },
  {
    icon: Layers,
    title: "Hybrid Sales Solutions",
    description:
      "Diverse combination of in-field, telesales and hybrid sales solutions designed to meet consumers when and where they are.",
  },
  {
    icon: Flag,
    title: "True Independence",
    description:
      "Autonomy to run your own business and a strong partner that respects and values your knowledge and experience.",
  },
] as const;

const LEVERAGE_OPTIONS = [
  {
    title: "Carrier Partners",
    description: "A distributor with a legacy of multi-product innovation.",
    href: "/our-solutions/carriers/",
  },
  {
    title: "Affiliates",
    description: "An ally who's committed to helping you grow your business on your terms.",
    href: "/our-solutions/affiliates/",
  },
  {
    title: "Agents & Advisors",
    description: "A partner who provides you with the insurance solutions your clients need and want today.",
    href: "/our-solutions/agents-and-advisors/",
  },
  {
    title: "Consumers",
    description: "An advocate who grows with you at every important milestone of your life.",
    href: "/our-solutions/consumers/",
  },
  {
    title: "Employees",
    description: "An employer who believes a flexible work culture is critical to becoming the best place to work.",
    href: "/our-solutions/employees/",
  },
] as const;

const iconProps = {
  size: 48,
  strokeWidth: 1.5,
  className: "text-[var(--color-brand-primary)]",
  "aria-hidden": true as const,
};

export default function FlexibilityOptionalityPage() {
  return (
    <article className="bg-white">
      {/* Breadcrumb + Title */}
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-16 sm:py-24">
        <nav className="mb-8 text-sm text-[var(--color-muted)]" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li>
              <Link href="/" className="text-[var(--color-link)] transition-colors hover:text-[var(--color-link-hover)]">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[var(--color-fg)]" aria-current="page">
              Flexibility & Optionality
            </li>
          </ol>
        </nav>
        <h1 className="mb-0 text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
          Flexibility & Optionality
        </h1>
      </div>

      {/* Hero: Your Business is Our Business - 2-col */}
      <div className="grid min-h-0 w-full grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-center bg-[#f7f8f9] px-[var(--container-padding-x)] py-12 lg:py-16 lg:pl-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))]">
          <h2 className="mb-6 text-xl font-bold uppercase tracking-wide text-[var(--color-brand-primary)] sm:text-2xl">
            Your Business is
            <br />
            Our Business
          </h2>
          <p className="mb-6 max-w-xl text-base leading-relaxed text-[var(--color-fg)]">
            In insurance, there is no &quot;one size fits all&quot; — whether you&apos;re a consumer
            looking to accumulate wealth and leave a legacy; an agent or advisor looking for the right
            career path; or an entrepreneur looking for help growing your business the way you&apos;ve
            always dreamed.
          </p>
          <p className="mb-0 max-w-xl text-base leading-relaxed text-[var(--color-fg)]">
            At AmeriLife, we embrace your uniqueness. We&apos;re a partner that aligns and grows with
            you, pivots with you, and develops solutions that are as flexible and nimble as today&apos;s
            ever-changing market demands.
          </p>
        </div>
        <div className="relative aspect-[1420/1144] w-full overflow-hidden bg-[#e8ebe8] lg:aspect-auto lg:min-h-[400px]">
          <Image
            src={rewriteUploadsUrl(HERO_IMAGE)}
            alt="AmeriLife flexibility and optionality"
            fill
            className="object-cover object-top"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
      </div>

      {/* We help power your business by offering - 3 cards with icons */}
      <div className="bg-[#f0f0f0] py-16 sm:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <h2 className="mb-12 text-center text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
            We help power your business by offering:
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {OFFERINGS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="flex flex-col rounded-lg bg-[#e2e5ed] p-8 sm:p-10"
                >
                  <div className="mb-4">
                    <Icon {...iconProps} />
                  </div>
                  <h3 className="mb-4 text-xl font-bold text-[var(--color-fg)]">
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

      {/* Leveraging Our Flexibility for You - 5 link cards */}
      <div className="py-16 sm:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <h2 className="mb-12 text-center text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
            Leveraging Our Flexibility for You
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {LEVERAGE_OPTIONS.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="group flex flex-col rounded-lg bg-[#e2e5ed] p-8 transition-colors hover:bg-[#d5d9e8] sm:p-10"
              >
                <h3 className="mb-4 text-xl font-bold text-[var(--color-fg)] group-hover:text-[var(--color-brand-primary)]">
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
