import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Link } from "@/app/components/ui/Link";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import { JsonLd } from "@/app/components/seo/JsonLd";
import { breadcrumbJsonLd, staticPageMetadata } from "@/lib/seo";
import { rewriteUploadsUrl } from "@/lib/wp-media";
import { WP_IMAGE_SOURCES } from "@/lib/wp-image-sources";

/** Turbopack/Next 16: load client module via dynamic() to avoid "module factory is not available" with RSC. */
const FadeInOnView = dynamic(
  () => import("@/app/components/ui/FadeInOnView"),
  { ssr: true }
);

export const metadata: Metadata = staticPageMetadata(
  "Employees | AmeriLife",
  "When you work for AmeriLife, you're joining a company with a purpose — to help people live longer, healthier and more secure lives. Explore our culture, benefits, and career opportunities.",
  "/our-solutions/employees/"
);

const UPLOADS = "https://headlessameril.wpenginepowered.com/wp-content/uploads";
const HERO_IMAGE = `${UPLOADS}/2022/01/Employees_Hero_1420x1144.png`;
const BANNER_10 = `${UPLOADS}/2021/12/banner-10.png`;
const BANNER_3 = `${UPLOADS}/2021/12/banner-3.png`;
const LIFE_EMPLOYEE_IMAGE = `${UPLOADS}/2022/01/Employees_CorpProHero_a_1420x1144.png`;
const { totalRewardsImage: TOTAL_REWARDS_IMAGE } = WP_IMAGE_SOURCES.employees;

const LIFE_BENEFITS = [
  "Competitive compensation and discretionary bonus programs (for eligible positions)",
  "Market-leading benefits, including major medical, dental, vision, retirement planning and 401(k) plans",
  "Generous paid time off (PTO), including paid maternity benefits",
  "Wellness Rewards and resources",
  "Volunteer opportunities and seasonal events",
] as const;

const TOTAL_REWARDS = [
  { title: "Compensation", description: "Empowering your earning potential" },
  { title: "Wellbeing", description: <>Acknowledging that you work to <em>live</em>, not live to work</> },
  { title: "Benefits", description: "Providing solutions to secure your total health and financial future" },
  { title: "Development", description: "Putting you on a path towards growth and advancement" },
] as const;

const CAREERS_URL = "https://amerilife.wd5.myworkdayjobs.com/External";

export default function EmployeesPage() {
  return (
    <article className="bg-white">
      <JsonLd
        schema={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Our Solutions" },
          { name: "Employees", path: "/our-solutions/employees/" },
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
              { label: "Our Solutions" },
              { label: "Employees" },
            ]}
          />
          <h1 className="text-[32px] font-semibold leading-[38px] text-[#244260] sm:text-5xl sm:leading-[64px]">
            Employees
          </h1>
        </FadeInOnView>
      </div>

      {/* Hero: A Career Built with You in Mind - 2-col: gray left, image right */}
      <FadeInOnView
        direction="up"
        className="grid min-h-0 w-full grid-cols-1 border-t border-[#e8ede8] lg:grid-cols-2"
      >
        <div className="flex flex-col justify-center bg-[#f7f8f9] px-[var(--container-padding-x)] py-12 lg:py-16 lg:pl-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))]">
          <h2 className="mb-6 text-2xl font-bold uppercase tracking-wide text-[var(--color-brand-primary)] sm:text-3xl lg:text-4xl">
            A Career Built with
            <br />
            You in Mind
          </h2>
          <p className="mb-0 max-w-xl text-base leading-relaxed text-[var(--color-fg)]">
            When you work for AmeriLife, you&apos;re joining a company with a purpose — to help people live longer, healthier and more secure lives. It&apos;s that purpose and commitment to service that fuels AmeriLife&apos;s culture and drives us toward the goal of being the best place to work.
          </p>
        </div>
        <div className="relative aspect-[1420/1144] w-full overflow-hidden lg:aspect-auto lg:min-h-[400px]">
          <Image
            src={rewriteUploadsUrl(HERO_IMAGE)}
            alt="AmeriLife employees in front of company building"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
      </FadeInOnView>

      {/* Kiersten Burstiner quote - full-bleed banner with background image, light text */}
      <FadeInOnView
        direction="up"
        className="relative min-h-[320px] w-full overflow-hidden bg-cover bg-center py-16 lg:py-20"
        style={{ backgroundImage: `url(${rewriteUploadsUrl(BANNER_10)})` }}
      >
        <div className="absolute inset-0 bg-black/20" aria-hidden />
        <div className="relative mx-auto flex w-full max-w-[var(--container-max)] flex-col items-center justify-center px-[var(--container-padding-x)] text-center">
          <blockquote className="mb-8 w-full max-w-6xl text-xl font-medium leading-relaxed text-white sm:text-2xl lg:text-3xl">
            &ldquo;AmeriLife&apos;s employees are the heartbeat of the company, and our culture is what
            makes us stand out from the rest. I&apos;m incredibly proud of our inside-out, &lsquo;people-first&rsquo;
            approach, and it&apos;s a privilege to work with like-minded colleagues who make this job so
            rewarding.&rdquo;
          </blockquote>
          <h2 className="mb-2 text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
            Kiersten Burstiner
          </h2>
          <p className="mb-0 text-base font-medium text-white/90">
            Chief Human Resources Officer, AmeriLife
          </p>
        </div>
      </FadeInOnView>

      {/* Life as an AmeriLife Employee - 2-col: image LEFT, text RIGHT (blue → green gradient) */}
      <FadeInOnView direction="up" className="grid min-h-0 w-full grid-cols-1 lg:grid-cols-2">
        <div className="relative order-2 aspect-[1420/1144] w-full overflow-hidden bg-[#003a74] lg:order-1 lg:aspect-auto lg:min-h-[400px]">
          <Image
            src={rewriteUploadsUrl(LIFE_EMPLOYEE_IMAGE)}
            alt="AmeriLife employees"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="order-1 flex flex-col justify-center bg-[linear-gradient(105deg,#003a74_0%,#67c084_100%)] px-[var(--container-padding-x)] py-12 lg:order-2 lg:min-h-[400px] lg:py-16 lg:pr-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))]">
          <h2 className="mb-6 text-xl font-bold uppercase tracking-wide text-white sm:text-2xl">
            Life as an AmeriLife Employee
          </h2>
          <p className="mb-8 max-w-xl text-base leading-relaxed text-white/95">
            AmeriLife employees enjoy access to many benefits that provide opportunities for professional development and personal wellbeing and enrichment:
          </p>
          <ul className="list-disc space-y-3 pl-6 text-base leading-relaxed text-white/95 marker:text-white/80">
            {LIFE_BENEFITS.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </FadeInOnView>

      {/* Total Rewards - 2-col: text left, image right (footer blue) */}
      <FadeInOnView
        direction="up"
        className="grid min-h-0 w-full grid-cols-1 bg-[var(--color-footer-bg)] lg:grid-cols-2"
      >
        <div className="flex flex-col justify-center px-[var(--container-padding-x)] py-12 lg:py-16 lg:pl-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))]">
          <h2 className="mb-6 text-xl font-bold uppercase tracking-wide text-white sm:text-2xl">
            Total Rewards
          </h2>
          <p className="mb-8 max-w-xl text-base leading-relaxed text-white/90">
            We believe that your work experience and the company&apos;s performance are inseparable. That&apos;s why AmeriLife&apos;s Total Rewards program was designed to keep you inspired, productive and committed to your career and our collective business goals.
          </p>
          <ul className="mb-10 list-disc space-y-4 pl-6 text-left text-base leading-relaxed text-white/90 marker:text-white sm:pl-8">
            {TOTAL_REWARDS.map((item, i) => (
              <li key={i}>
                <span className="font-bold text-white">{item.title}</span>
                {": "}
                {item.description}
              </li>
            ))}
          </ul>
          <a
            href={CAREERS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="motion-cta inline-flex w-fit items-center gap-2.5 rounded-[var(--radius-full)] border-0 bg-white px-8 py-4 text-base font-bold uppercase tracking-[var(--tracking-normal)] text-[var(--color-brand-primary)] shadow-sm no-underline transition-opacity hover:opacity-90 sm:text-lg"
          >
            View Employee Openings
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--color-footer-bg)] lg:aspect-auto lg:min-h-[400px]">
          <Image
            src={TOTAL_REWARDS_IMAGE}
            alt="AmeriLife workplace"
            fill
            className="object-cover"
            sizes="(max-width: 1023px) 100vw, min(1200px, 50vw)"
            unoptimized
          />
        </div>
      </FadeInOnView>

      {/* Giving Back to Our Community - lighter bg, dark text */}
      <FadeInOnView
        direction="up"
        className="relative min-h-[320px] w-full overflow-hidden bg-cover bg-center py-16 text-center lg:py-20"
        style={{ backgroundImage: `url(${rewriteUploadsUrl(BANNER_3)})` }}
      >
        <div className="absolute inset-0 bg-white/70" aria-hidden />
        <div className="relative mx-auto flex max-w-[var(--container-max)] flex-col items-center px-[var(--container-padding-x)] text-center">
          <h2 className="mb-4 text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
            Giving Back to Our Community
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-[var(--color-fg)]">
            A great way to see AmeriLife&apos;s values in action is through the generosity of its employees. In addition to our corporate support of non-profit organizations throughout the country and Greater Tampa Bay area, our employees also receive up to two days of &quot;VTO&quot; (Volunteer Time Off) to donate their time to an organization of their choosing. It&apos;s just one more way we nurture a culture of service at AmeriLife.
          </p>
          <Link
            href="https://amerilife.com/givesback/"
            target="_blank"
            rel="noopener noreferrer"
            variant="button"
            className="motion-cta inline-flex w-fit items-center gap-2.5 rounded-[var(--radius-full)] border-0 bg-white px-8 py-4 text-base font-bold uppercase tracking-[var(--tracking-normal)] text-[var(--color-brand-primary)] shadow-sm transition-opacity hover:opacity-90 no-underline sm:text-lg"
          >
            Our Community Impact
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </FadeInOnView>
    </article>
  );
}
