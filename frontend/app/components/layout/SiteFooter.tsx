import Image from "next/image";
import Link from "next/link";
import { Link as UiLink } from "../ui/Link";
import type { NavItem } from "@/lib/wp-menus";

const BOTTOM_LINKS = [
  { label: "Privacy Policy", href: "/privacy/" },
  { label: "Terms & Conditions", href: "/terms/" },
  { label: "SMS Terms & Conditions", href: "/sms-terms/" },
];

const CERTIFICATION_BADGE_URL =
  "https://amerilife.com/wp-content/uploads/2025/07/58a9a44b-c754-4491-9340-42a76cfd9ff0-TICKET.supporting_files-AmeriLife_US_English_2025_Certification_Badge-1-scaled.png";

type SiteFooterProps = {
  primaryMenu: NavItem[];
};

export function SiteFooter({ primaryMenu }: SiteFooterProps) {
  const aboutUs = primaryMenu.find((i) => i.label.toLowerCase().includes("about"));
  const ourSolutions = primaryMenu.find((i) => i.label.toLowerCase().includes("solutions"));

  return (
    <footer
      className="mt-auto"
      style={{ backgroundColor: "var(--color-footer-bg)" }}
    >
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-12 lg:py-16">
        {/* Row 1: Logo top-left */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center" aria-label="AmeriLife Home">
            <Image
              src="https://amerilife.com/wp-content/themes/Divi-Child/assets/img/white-logo.svg"
              alt="AmeriLife"
              width={140}
              height={40}
              className="h-8 w-auto"
            />
          </Link>
        </div>

        {/* Separator */}
        <hr className="mt-6 border-white/20" />

        {/* Row 2: About Us | Our Solutions | Newsroom + Join Our Team | GPTW Badge */}
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {aboutUs && (
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">
                About Us
              </h3>
              <ul className="space-y-3">
                {aboutUs.children?.map((child) => (
                  <li key={child.href + child.label}>
                    <UiLink
                      href={child.href}
                      variant="nav"
                      className="text-sm font-medium text-white/90 transition-colors hover:text-white"
                    >
                      {child.label}
                    </UiLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {ourSolutions && (
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">
                Our Solutions
              </h3>
              <ul className="space-y-3">
                {ourSolutions.children
                  ?.filter((c) => c.label !== "Newsroom" && c.label !== "Join Our Team")
                  .map((child) => (
                    <li key={child.href + child.label}>
                      <UiLink
                        href={child.href}
                        variant="nav"
                        className="text-sm font-medium text-white/90 transition-colors hover:text-white"
                      >
                        {child.label}
                      </UiLink>
                    </li>
                  ))}
              </ul>
            </div>
          )}
          <div className="pt-9 sm:pt-0">
            <ul className="space-y-3">
              <li>
                <UiLink
                  href="/newsroom/"
                  variant="nav"
                  className="text-sm font-medium text-white/90 transition-colors hover:text-white"
                >
                  Newsroom
                </UiLink>
              </li>
              <li>
                <UiLink
                  href="/join-our-team/"
                  variant="nav"
                  className="text-sm font-medium text-white/90 transition-colors hover:text-white"
                >
                  Join Our Team
                </UiLink>
              </li>
            </ul>
          </div>
          <div className="flex items-start justify-start lg:justify-end">
            <a
              href="https://www.greatplacetowork.com/certified-company/7084246"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-[140px] shrink-0"
              aria-label="AmeriLife - 2025 Certification Badge"
            >
              <Image
                src={CERTIFICATION_BADGE_URL}
                alt="AmeriLife US English 2025 Certification Badge"
                width={140}
                height={180}
                className="w-full object-contain"
              />
            </a>
          </div>
        </div>

        {/* Separator */}
        <hr className="mt-10 border-white/20 lg:mt-12" />

        {/* Row 3: Legal disclaimer (left) + Policy links (right) */}
        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1 max-w-2xl">
            <p className="text-sm leading-relaxed text-white/80">
              AmeriLife, ©{new Date().getFullYear()} Not affiliated with the U. S. government or
              federal Medicare program. We do not offer every plan available in your area. Any
              information we provide is limited to those plans we do offer in your area. Please
              contact{" "}
              <a
                href="https://www.medicare.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline hover:text-white/90"
              >
                Medicare.gov
              </a>{" "}
              or{" "}
              <a
                href="tel:1-800-633-4227"
                className="text-white underline hover:text-white/90"
              >
                1-800-MEDICARE
              </a>{" "}
              to get information on all of your options.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 shrink-0 lg:gap-8">
            {BOTTOM_LINKS.map((item) => (
              <UiLink
                key={item.href + item.label}
                href={item.href}
                variant="nav"
                className="text-sm font-medium text-white/80 transition-colors hover:text-white"
              >
                {item.label}
              </UiLink>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
