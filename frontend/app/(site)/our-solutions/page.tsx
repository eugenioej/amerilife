import type { Metadata } from "next";
import { JsonLd } from "@/app/components/seo/JsonLd";
import { FadeInOnView } from "@/app/components/ui/FadeInOnView";
import { Link } from "@/app/components/ui/Link";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import { breadcrumbJsonLd, staticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = staticPageMetadata(
  "Our Solutions | AmeriLife",
  "Our solutions represent AmeriLife's ongoing commitment to deliver opportunities for our stakeholders to make a difference and carve their own path.",
  "/our-solutions/"
);

const ABOUT_US_LINKS = [
  { label: "Who We Are", href: "/about-us/who-we-are/" },
  { label: "Our Leaders", href: "/about-us/our-leaders/" },
  { label: "Our Distribution", href: "/about-us/our-distribution/" },
  { label: "AmeriLife Gives Back Foundation", href: "/givesback/" },
] as const;

const OUR_SOLUTIONS_LINKS: { label: string; href: string; sublabel?: string }[] = [
  { label: "For Affiliates", href: "/our-solutions/affiliates/" },
  { label: "For Agents & Advisors", href: "/our-solutions/agents-and-advisors/" },
  { label: "For Carrier Partners", href: "/our-solutions/carriers/" },
  { label: "For Consumers", href: "/our-solutions/consumers/" },
  { label: "For Our Employees", href: "/our-solutions/employees/" },
  { label: "For Future Partners", href: "/acquisition-partner-program/", sublabel: "Acquisition Partner Program" },
];

export default function OurSolutionsPage() {
  return (
    <article className="bg-white">
      <JsonLd
        schema={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Our Solutions", path: "/our-solutions/" },
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
            items={[{ label: "Home", href: "/" }, { label: "Our Solutions" }]}
          />
          <h1 className="text-[32px] font-semibold leading-[38px] text-[#244260] sm:text-5xl sm:leading-[64px]">
            Our Solutions
          </h1>
        </FadeInOnView>
      </div>

      <FadeInOnView
        direction="up"
        className="border-t border-[#e8ede8] bg-white"
      >
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-10 sm:py-12 lg:py-14">
          <p className="mb-12 max-w-2xl text-base leading-relaxed text-[var(--color-fg)]">
            Our solutions represent AmeriLife&apos;s ongoing commitment to deliver
            opportunities for our stakeholders to make a difference and carve
            their own path.
          </p>

          {/* Two-column link sections - match amerilife.com layout */}
          <div className="grid gap-12 sm:grid-cols-2 lg:gap-16">
            <FadeInOnView direction="up" className="min-w-0">
              <section aria-labelledby="about-us-heading">
                <h2 id="about-us-heading" className="mb-6 text-xl font-bold text-[var(--color-fg)] sm:text-2xl">
                  About Us
                </h2>
                <ul className="space-y-3">
                  {ABOUT_US_LINKS.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-[var(--color-link)] transition-colors hover:text-[var(--color-link-hover)] hover:underline"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            </FadeInOnView>
            <FadeInOnView direction="up" delay={80} className="min-w-0">
              <section aria-labelledby="solutions-heading">
                <h2 id="solutions-heading" className="mb-6 text-xl font-bold text-[var(--color-fg)] sm:text-2xl">
                  Our Solutions
                </h2>
                <ul className="space-y-3">
                  {OUR_SOLUTIONS_LINKS.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-[var(--color-link)] transition-colors hover:text-[var(--color-link-hover)] hover:underline"
                      >
                        {item.label}
                        {item.sublabel != null && (
                          <span className="mt-0.5 block text-sm text-[var(--color-muted)]">
                            {item.sublabel}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            </FadeInOnView>
          </div>
        </div>
      </FadeInOnView>
    </article>
  );
}
