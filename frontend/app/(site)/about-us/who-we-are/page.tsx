import type { Metadata } from "next";
import Image from "next/image";
import { JsonLd } from "@/app/components/seo/JsonLd";
import { FadeInOnView } from "@/app/components/ui/FadeInOnView";
import { Link } from "@/app/components/ui/Link";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import { breadcrumbJsonLd, staticPageMetadata } from "@/lib/seo";
import { rewriteUploadsUrl } from "@/lib/wp-media";
import { IconTarget, IconDiamond, getPrincipleIcon } from "@/app/components/about-us/WhoWeAreIcons";
import { MilestonesSlider } from "@/app/components/about-us/MilestonesSlider";

export const metadata: Metadata = staticPageMetadata(
  "Who We Are | AmeriLife",
  "AmeriLife's strength is its mission: to provide insurance and retirement solutions to help people live longer, healthier lives. Learn about our values, distribution network, and 50+ year legacy.",
  "/about-us/who-we-are/"
);

const UPLOADS = "https://headlessameril.wpenginepowered.com/wp-content/uploads";
const HERO_IMAGE = `${UPLOADS}/2021/12/WhoWeAre_AmeriLifePlace_746x660.png`;

/** Demonstrating Our Values band */
const MISSION_VALUES_GRADIENT = "linear-gradient(105deg, #003a74 0%, #67c084 100%)";

const MISSION_VALUES_BANNER =
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2021/12/banner-10.png";

const PRINCIPLES = [
  { title: "Shared Culture", description: "We believe that we are all in this together." },
  { title: "Honesty & Respect", description: "We treat our customers the way we'd like to be treated." },
  { title: "Integrity", description: "We do the right thing, even when no one else is around." },
  { title: "Accountability", description: "We take ownership for our actions and outcomes." },
  { title: "Excellence", description: "Our customers, partners and colleagues can depend on us." },
  { title: "Courage", description: "We're prepared for anything, and step up and in when needed." },
] as const;

const STAKEHOLDER_LINKS = [
  { label: "Affiliates", href: "/our-solutions/affiliates/" },
  { label: "Agents & Advisors", href: "/our-solutions/agents-and-advisors/" },
  { label: "Carrier Partners", href: "/our-solutions/carriers/" },
  { label: "Consumers", href: "/our-solutions/consumers/" },
  { label: "Employees", href: "/our-solutions/employees/" },
] as const;

/** Milestone images have been added to the MileStone Object allow same year to have individual images */

const MILESTONES: {
  year: string;
  text: string;
  image: string;
  linkText?: string;
  extLink?: string;
  textEnd?: string;
}[] = [
  { year: "1971", text: "AmeriLife was founded in Holiday, Florida.", image: `${UPLOADS}/2021/12/WhoWeAre_1971_746x660.png` },
  { year: "1979", text: "AmeriLife expands to seven offices throughout Florida.", image: `${UPLOADS}/2021/12/WhoWeAre_1979_746x660.png` },
  { year: "1983", text: "AmeriLife enters the annuity brokerage space, establishes National Brokerage Division.", image: `${UPLOADS}/2022/01/AL-timeline_1983.png` },
  { year: "1987", text: "AmeriLife expands outside of Florida, opening an office in North Carolina.", image: `${UPLOADS}/2021/12/WhoWeAre_1987_746x660.png` },
  { year: "1990", text: "AmeriLife relocates headquarters to Clearwater, Florida.", image: `${UPLOADS}/2022/01/AL-timeline_1990a.png` },
  { year: "2007", text: "Private investors buy majority stake in AmeriLife.", image: "" },
  { year: "2008", text: "AmeriLife establishes ", linkText: "AmeriLife Marketing Group (AMG)", extLink: "https://amerilifemarketinggroup.com/", textEnd: ".", image: `${UPLOADS}/2021/12/WhoWeAre_2008_Op2_746x660.png` },
  { year: "2009", text: "AmeriLife expands into the multicultural market, establishes ", linkText: "Grupo LatinoAmericano de Seguros", extLink: "http://es.insurancegls.com/home/", textEnd: ".", image: `${UPLOADS}/2026/05/grupo_746x660.jpg` },
  { year: "2014", text: "AmeriLife expands into the worksite and direct-to-consumer spaces.", image: `${UPLOADS}/2021/12/WhoWeAre_2014_746x660.png` },
  { year: "2015", text: "Private equity firm J.C. Flowers acquires a majority stake in AmeriLife, helping the company issue approximately $7.7 million in stock over three years.", image: `${UPLOADS}/2021/12/WhoWeAre_2015_746x660a.png` },
  { year: "2016", text: "Scott R. Perry joins AmeriLife as chief executive officer.", image:`${UPLOADS}/2026/05/0034-Scott-Perry-Corporate-Headshots-Tampa-Florida-scaled-e1773146220783.webp` },
  { year: "2019", text: "AmeriLife enters the RIA space, acquires majority stake in ", linkText: "Brookstone Capital Management", extLink: "https://www.brookstonecm.com/", textEnd: ".", image: `${UPLOADS}/2021/12/WhoWeAre_2019_Part1_746x660a.png` },
  { year: "2019", text: "AmeriLife enters the life insurance space, acquires ", linkText: "Agent Support Group Inc", extLink: "https://asglife.com/", textEnd: ".", image: `${UPLOADS}/2026/05/asg_746x660.jpg` },
  { year: "2020", text: "J.C. Flowers sells a majority stake in AmeriLife to an investor group led by private equity firm ", linkText: "Thomas H. Lee Partners", extLink: "https://thl.com/", textEnd: ".", image: `${UPLOADS}/2021/12/WhoWeAre_2020_746x660a.png` },
  { year: "2021", text: "AmeriLife celebrates its 50th anniversary.", image: `${UPLOADS}/2021/12/WhoWeAre-2021_746x660a.png` },
  { year: "2022", text: "Private equity firm ", linkText: "Genstar Capital", extLink: "https://www.gencap.com/", textEnd: " makes a strategic investment in AmeriLife, joining Thomas H. Lee Partners as an equal investor.", image: `${UPLOADS}/2022/06/WhoWeAre-2022_Genstar_746x660.png` },
  { year: "2023", text: "Announced the formation of the AmeriLife Gives Back Foundation, an enterprise-wide giving initiative and its first foundation partnership with the Honor Flight Network.", image: `${UPLOADS}/2023/11/AML-Gives-Back_FIFU_500x500.png` },
  { year: "2025", text: "Announced acquisition of Crump Life Insurance Services, one of the largest and most dynamic providers of life insurance and retirement products in the United States.", image: `${UPLOADS}/2026/01/JPG-Logo-Crump-Logo-Cobrand-020725-01-683-x-589.png` },
];

export default function WhoWeArePage() {
  return (
    <article className="bg-white">
      <JsonLd
        schema={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About Us" },
          { name: "Who We Are", path: "/about-us/who-we-are/" },
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
              { label: "About Us" },
              { label: "Who We Are" },
            ]}
          />
          <h1 className="text-[32px] font-semibold leading-[38px] text-[#244260] sm:text-5xl sm:leading-[64px]">
            Who We Are
          </h1>
        </FadeInOnView>
      </div>

      {/* About AmeriLife - full-bleed 2-col: gray left, image right */}
      <FadeInOnView
        direction="up"
        className="grid min-h-0 w-full grid-cols-1 border-t border-[#e8ede8] lg:grid-cols-2"
      >
        <div className="flex flex-col justify-center bg-[#f7f8f9] px-[var(--container-padding-x)] py-12 lg:py-16 lg:pl-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))]">
          <h2 className="mb-6 text-xl font-bold uppercase tracking-wide text-[var(--color-brand-primary)] sm:text-2xl">
            About AmeriLife
          </h2>
          <p className="mb-6 max-w-xl text-base leading-relaxed text-[var(--color-fg)]">
            AmeriLife&apos;s strength is its mission: to provide insurance and retirement solutions to
            help people live longer, healthier lives. We&apos;re a national leader in developing,
            marketing, distributing and administering life and health insurance, annuities, and
            retirement planning solutions to enhance the lives of pre-retirees and retirees.
          </p>
          <p className="mb-6 text-base leading-relaxed text-[var(--color-fg)]">
            AmeriLife has partnered with the nation&apos;s leading insurance carriers to provide value
            and quality to customers through a national distribution network of:
          </p>
          <ul className="mb-8 list-disc space-y-2 pl-6 text-base text-[var(--color-fg)]">
            <li>Over 300,000 insurance agents and advisors</li>
            <li>114 marketing organizations</li>
            <li>52 insurance agency locations</li>
          </ul>
          <Link
            href="/about-us/our-distribution/"
            variant="button"
            className="motion-cta inline-flex w-fit items-center gap-2 rounded-[var(--radius-full)] bg-[var(--color-brand-primary)] px-6 py-3 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-white transition-colors hover:bg-[var(--color-brand-primary-hover)]"
          >
            Learn About Our Distribution
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="relative aspect-[746/660] w-full overflow-hidden lg:aspect-auto lg:min-h-[400px]">
          <Image
            src={rewriteUploadsUrl(HERO_IMAGE)}
            alt="AmeriLife headquarters building"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
      </FadeInOnView>

      {/* Our Mission & Our Values - banner image with icons */}
      <FadeInOnView
        direction="up"
        className="grid gap-12 bg-cover bg-center bg-no-repeat px-[var(--container-padding-x)] py-16 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))]"
        style={{
          backgroundImage: `url(${rewriteUploadsUrl(MISSION_VALUES_BANNER)})`,
        }}
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            <IconTarget />
          </div>
          <h2 className="mb-4 text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
            Our Mission
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-white/95">
            Our mission has been at the heart of everything AmeriLife does — to provide peace of mind
            and help people live longer, healthier lives.
          </p>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            <IconDiamond />
          </div>
          <h2 className="mb-4 text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
            Our Values
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-white/95">
            At AmeriLife, we strive to exemplify our core values in each and every interaction we
            have, day in and day out.
          </p>
        </div>
      </FadeInOnView>

      {/* Six Principles - contained, gray cards */}
      <div className="bg-[#f7f8f9] py-16 sm:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <h2 className="mb-12 text-center text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
            We&apos;ve built AmeriLife on six simple principles:
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <FadeInOnView
                key={i}
                direction="up"
                delay={i * 70}
                className="flex flex-col rounded-lg bg-[#e2e5ed] p-10 sm:p-12"
              >
                {getPrincipleIcon(p.title) && (
                  <div className="mb-4">{getPrincipleIcon(p.title)}</div>
                )}
                <h3 className="mb-3 text-lg font-bold text-[var(--color-fg)]">{p.title}</h3>
                <p className="text-base leading-relaxed text-[var(--color-muted)]">{p.description}</p>
              </FadeInOnView>
            ))}
          </div>
        </div>
      </div>

      {/* Demonstrating Our Values - full-bleed gradient + photo (2-col: text left, image right) */}
      <FadeInOnView
        direction="up"
        className="grid min-h-0 w-full grid-cols-1 lg:grid-cols-2"
        style={{ background: MISSION_VALUES_GRADIENT }}
      >
        <div className="flex flex-col justify-center px-[var(--container-padding-x)] py-16 text-center lg:text-left sm:py-20 lg:pr-8 lg:pl-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))]">
          <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">
            Demonstrating
            <br />
            Our Values
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-white/95 lg:mx-0">
            At AmeriLife, our values are more than just words — they&apos;re actions, demonstrated and
            delivered every day by our talented team of associates and affiliates across the country.
            Learn more about our promise to our partners and stakeholders.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            {STAKEHOLDER_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                variant="button"
                className="motion-cta rounded-[var(--radius-full)] border-2 border-white bg-transparent px-6 py-3 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-white transition-colors hover:bg-white hover:text-[var(--color-brand-primary)]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="relative aspect-[1422/1144] w-full overflow-hidden lg:aspect-auto lg:min-h-[400px]">
          <Image
            src={rewriteUploadsUrl(`${UPLOADS}/2022/01/WhoWeAre_Values02_1422x1144.png`)}
            alt="AmeriLife headquarters building"
            fill
            className="object-cover grayscale"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </FadeInOnView>

      {/* Milestones - contained, with images */}
      <FadeInOnView
        direction="up"
        className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-16 sm:py-20"
      >
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
            AmeriLife Past, Present & Future: The Next 50
          </h2>
          <p className="mb-6 text-base leading-relaxed text-[var(--color-fg)]">
            AmeriLife&apos;s more than 50-year legacy is rivaled only by the promise and excitement of
            its continued growth as the nation&apos;s most dominant marketing and distribution company
            for financial solutions.
          </p>
          <p className="text-base leading-relaxed text-[var(--color-fg)]">
            In the last several years alone, AmeriLife has acquired more than 60 companies across the
            life and health insurance, annuities, and retirement planning space. In doing so, it has
            strengthened its offerings, expanded its geographical footprint, and fortified its vast and
            powerful distribution network for years to come.
          </p>
        </div>
        <h3 className="mb-10 text-center text-xl font-semibold text-[var(--color-fg)]">
          Our Milestones
        </h3>
        <MilestonesSlider milestones={MILESTONES} />
      </FadeInOnView>
    </article>
  );
}
