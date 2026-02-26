import {
  GraduationCap,
  Megaphone,
  Settings,
  Package,
  HeartPulse,
  Smartphone,
} from "lucide-react";

const iconProps = {
  size: 48,
  strokeWidth: 1.5,
  className: "text-[var(--color-brand-primary)]",
  "aria-hidden": true as const,
};

const GROWTH_CARDS = [
  {
    icon: GraduationCap,
    title: "Producer Services",
    description:
      "Training programs, one-on-one support and financial assistance designed to help you win.",
    items: [
      "Online, virtual and in-person training",
      "Access to capital locked up in renewals",
      "Affordable business insurance solutions and much more",
    ],
  },
  {
    icon: Megaphone,
    title: "Marketing Services",
    description:
      "Full-service marketing and communications support that supercharge your brand and sales activities.",
    items: [
      "Lead generation",
      "Website development and search engine optimization (SEO) support",
      "Creative and content production services",
      "External (PR/media) and internal communications support",
    ],
  },
  {
    icon: Settings,
    title: "IT, Operations & Back Office Support",
    description: "Work smarter and faster with shared services that frees your time to focus on sales.",
    items: [
      "Foundational operations support, including HR and Level1 IT helpdesk support and secure network connectivity",
      "Business intelligence (BI) reporting that leverage industry-leading applications",
      "Proprietary enterprise technology that make it easier and faster to write new business",
    ],
  },
  {
    icon: Package,
    title: "Product Development",
    description: "Take products to market at the right price and at the right time.",
    items: [
      "Cross pollination of sales strategies across affiliates and hands-on support for entering new lines of business",
      "Robust product shelf and comprehensive services for individual and worksite markets",
      "Health, life, annuity and retirement solutions from leading carriers and network providers",
      "Access to FSA-qualified actuaries who've worked for top carriers such as Aetna, Allstate and many others",
    ],
  },
  {
    icon: HeartPulse,
    title: "Multi-Service Medicare Platform",
    description:
      "Access to AmeriLife's proprietary remote sales platform YourFMO™ to quote, enroll and retain clients.",
    items: [
      "Custom, multi-carrier MA/PDP platform",
      "Personalized agent URLs",
      "Referral fees",
    ],
  },
  {
    icon: Smartphone,
    title: "Sales Technology for Sales Teams & Producers",
    description: "State-of-the-art mobile sales technology platform built to accelerate your success.",
    items: [
      "E-contracting, quoting, illustrations and e-apps",
      "Proprietary leads platform",
      "Agent CRM and commission tracking and reporting",
    ],
  },
] as const;

function StarBullet() {
  return (
    <span className="mr-2 inline-block text-[var(--color-brand-primary)]" aria-hidden>
      &#9734;
    </span>
  );
}

export function AffiliatesGrowthCards() {
  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <h2 className="mb-12 text-center text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
          How We Help You Drive Growth
        </h2>
        <div className="grid gap-8 sm:grid-cols-2">
          {GROWTH_CARDS.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex flex-col rounded-lg bg-[#e2e5ed] p-8 sm:p-10">
                <div className="mb-4">
                  <Icon {...iconProps} />
                </div>
                <h3 className="mb-4 text-xl font-bold text-[var(--color-fg)]">{item.title}</h3>
                <p className="mb-6 text-base leading-relaxed text-[var(--color-fg)]">
                  {item.description}
                </p>
                <ul className="list-none space-y-2 pl-0 text-base leading-relaxed text-[var(--color-fg)]">
                  {item.items.map((listItem, j) => (
                    <li key={j} className="flex items-start">
                      <StarBullet />
                      {listItem}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
