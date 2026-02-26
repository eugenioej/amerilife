import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/app/components/ui/Link";
import { rewriteUploadsUrl } from "@/lib/wp-media";
import {
  Briefcase,
  UserCheck,
  Package,
  Cpu,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Agents & Advisors | AmeriLife",
  description:
    "A career as an independent agent or registered advisor with AmeriLife means joining a national network of like-minded professionals and gaining access to products, training and technology to build your business your way.",
};

/** Canonical paths; rewriteUploadsUrl() serves from headless WP when NEXT_PUBLIC_USE_LIVE_IMAGES is not "1". */
const UPLOADS = "https://amerilife.com/wp-content/uploads";
const HERO_IMAGE = `${UPLOADS}/2022/01/Agents_Advisors_Hero_a_1420x1144.png`;
const WHAT_DO_IMAGE = `${UPLOADS}/2022/01/Agents_Advisors.png`;
const BANNER_3 = `${UPLOADS}/2021/12/banner-3.png`;

const SOLUTIONS = [
  {
    icon: Briefcase,
    title: "New Business Opportunities",
    description:
      "Seamless onboarding and servicing, and extensive training to nurture your professional journey, support your business expansion, and accelerate your earning potential.",
  },
  {
    icon: UserCheck,
    title: "Empowered Independence",
    description:
      "A partner that has your back and lets you flex your independent spirit, all while connecting you with a national network of insurance professionals that will inspire your success.",
  },
  {
    icon: Package,
    title: "Competitive Products",
    description:
      "Access to a broad shelf of competitive, industry-leading products, and the marketing support to help you bring them to market",
  },
  {
    icon: Cpu,
    title: "Advanced Tools & Technology",
    description:
      "Exclusive access to proprietary leads exchange and distribution systems, as well as a broad set of digital tools and technologies to enable your face-to-face and virtual sales efforts.",
  },
] as const;

const iconProps = {
  size: 48,
  strokeWidth: 1.5,
  className: "text-[var(--color-brand-primary)]",
  "aria-hidden": true as const,
};

export default function AgentsAdvisorsPage() {
  return (
    <article className="bg-white">
      {/* Breadcrumb + Title - contained */}
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-16 sm:py-24">
        <nav className="mb-8 text-sm text-[var(--color-muted)]" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li>
              <Link href="/" className="text-[var(--color-link)] transition-colors hover:text-[var(--color-link-hover)]">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/our-solutions/" className="text-[var(--color-link)] transition-colors hover:text-[var(--color-link-hover)]">
                Our Solutions
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[var(--color-fg)]" aria-current="page">
              Agents & Advisors
            </li>
          </ol>
        </nav>
        <h1 className="mb-0 text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
          Agents & Advisors
        </h1>
      </div>

      {/* Hero: Powering Your Passion for Service - 2-col: green text left, image right */}
      <div className="grid min-h-0 w-full grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-center bg-[#f7f8f9] px-[var(--container-padding-x)] py-12 lg:py-16 lg:pl-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))]">
          <h2 className="mb-6 text-xl font-bold uppercase tracking-wide text-[var(--color-brand-primary)] sm:text-2xl">
            Powering Your
            <br />
            Passion for Service
          </h2>
          <p className="mb-6 max-w-xl text-base leading-relaxed text-[var(--color-fg)]">
            Every day more than 11,000 people in the U.S. turn 65 years old, and many need help
            preparing for their future. That&apos;s where you come in.
          </p>
          <p className="mb-0 max-w-xl text-base leading-relaxed text-[var(--color-fg)]">
            A career as an independent agent or registered advisor with AmeriLife means joining a
            national network of like-minded professionals and gaining access to the products,
            marketing resources, training and technology required to build your business — your way
            — and fuel your entrepreneurial spirit.
          </p>
        </div>
        <div className="relative aspect-[1420/1144] w-full overflow-hidden bg-[#e8ebe8] lg:aspect-auto lg:min-h-[400px]">
          <Image
            src={rewriteUploadsUrl(HERO_IMAGE)}
            alt="AmeriLife agents and advisors"
            fill
            className="object-cover object-top"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
      </div>

      {/* Scotty Elliott quote - gradient background */}
      <div
        className="relative min-h-[320px] w-full overflow-hidden py-16 lg:py-20"
        style={{ background: "var(--gradient-primary)" }}
      >
        <div className="relative mx-auto flex max-w-[var(--container-max)] flex-col items-center justify-center px-[var(--container-padding-x)] text-center">
          <blockquote className="mb-6 text-xl leading-relaxed text-white sm:text-2xl">
            Today&apos;s best agents are educators and advocates for their clients, with access to the
            right technology and innovative insurance solutions that help those approaching and in
            retirement to make the most informed decisions for themselves and their families.
          </blockquote>
          <h2 className="mb-2 text-2xl font-bold uppercase text-white sm:text-3xl">
            Scotty Elliott
          </h2>
          <p className="mb-0 text-base font-medium text-white/90">
            Chief Distribution Officer, Health
          </p>
        </div>
      </div>

      {/* Solutions for Agents & Advisors - 4 cards */}
      <div className="bg-[#f0f0f0] py-16 sm:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <h2 className="mb-12 text-center text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
            Solutions for Agents & Advisors
          </h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {SOLUTIONS.map((item, i) => {
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

      {/* What do Agents & Advisors do? - 2-col: image left, gradient text block right */}
      <div className="grid min-h-0 w-full grid-cols-1 lg:grid-cols-2">
        <div className="relative order-2 aspect-[4/3] w-full overflow-hidden lg:order-1 lg:aspect-auto lg:min-h-[400px]">
          <Image
            src={rewriteUploadsUrl(WHAT_DO_IMAGE)}
            alt="Independent agent at work"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div
          className="order-1 flex flex-col justify-center px-[var(--container-padding-x)] py-12 lg:order-2 lg:py-16 lg:pr-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))]"
          style={{ background: "var(--gradient-primary)" }}
        >
          <h2 className="mb-6 text-xl font-bold uppercase tracking-wide text-white sm:text-2xl">
            What do Agents & Advisors do?
          </h2>
          <p className="mb-4 max-w-xl text-base leading-relaxed text-white">
            <strong>Independent agents</strong> are contracted sales agents who are self-employed,
            pay their own taxes and acquire their own benefits. At AmeriLife, independent agents
            agree to sell insurance products offered by the many companies with which AmeriLife has
            business relationships, including major carriers such as Cigna, Aetna, Nationwide,
            Mutual of Omaha, and many others.
          </p>
          <p className="mb-0 max-w-xl text-base leading-relaxed text-white">
            <strong>Registered advisors</strong> are independent or full-time employed by a
            wirehouse firm or an advisor network. At AmeriLife, registered advisors can join an RIA
            firm, or be eligible for AmeriLife support through their own firm (i.e., Institutional
            Wealth Management company or a Broker-Dealer). AmeriLife helps advisors add health and
            life insurance and retirement solutions to their portfolio.
          </p>
        </div>
      </div>

      {/* Your Opportunities Await - CTA */}
      <div
        className="relative min-h-[320px] w-full overflow-hidden bg-cover bg-center py-16 lg:py-20"
        style={{ backgroundImage: `url(${rewriteUploadsUrl(BANNER_3)})` }}
      >
        <div className="absolute inset-0 bg-white/70" aria-hidden />
        <div className="relative mx-auto flex max-w-[var(--container-max)] flex-col items-center justify-center px-[var(--container-padding-x)] text-center">
          <h2 className="mb-6 text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
            Your Opportunities Await
          </h2>
          <p className="mb-8 max-w-2xl text-base leading-relaxed text-[var(--color-fg)]">
            Reach out to start leveraging AmeriLife&apos;s platform for your insurance or investment
            business today.
          </p>
          <Link
            href="/broker-contact-page/"
            variant="button"
            className="inline-flex w-fit items-center gap-2 rounded-[var(--radius-full)] border-2 border-[var(--color-brand-primary)] bg-transparent px-6 py-3 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-[var(--color-brand-primary)] transition-colors hover:bg-[var(--color-brand-primary)] hover:text-white"
          >
            Contact Us
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
