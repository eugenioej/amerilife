import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/app/components/ui/Link";
import { Building2, Users } from "lucide-react";
import { fetchGraphQL } from "@/lib/wp-client";
import { GET_POSTS, type PostsListResult } from "@/lib/queries";
import { AnnouncementsCarousel } from "@/app/components/blog/AnnouncementsCarousel";
import { rewriteUploadsUrl } from "@/lib/wp-media";

export const metadata: Metadata = {
  title: "Newsroom | AmeriLife",
  description:
    "Stay up to date with the latest news, announcements, and insights from AmeriLife — America's leading health and wealth distribution company.",
};

const UPLOADS = "https://amerilife.com/wp-content/uploads";
const HERO_IMAGE = `${UPLOADS}/2023/04/AML-Wealth-II-Announcement-040532023-HERO-1024x358-1.png`;
const ANNOUNCEMENTS_COUNT = 12;

const PRESS_KIT_CARDS = [
  {
    type: "icon" as const,
    icon: Building2,
    heading: "About Amerilife",
    cta: "Learn About Amerilife",
    href: "/about-us/who-we-are/",
  },
  {
    type: "icon" as const,
    icon: Users,
    heading: "Executive Bios",
    cta: "See Our Leaders",
    href: "/about-us/our-leaders/",
  },
  {
    type: "image" as const,
    image: `${UPLOADS}/2021/12/WhoWeAre_2020_746x660a.png`,
    heading: "Thomas H. Lee Partners",
    cta: "Visit Thomas H. Lee Partners",
    href: "https://thl.com/",
  },
  {
    type: "image" as const,
    image: `${UPLOADS}/2022/06/WhoWeAre-2022_Genstar_746x660.png`,
    heading: "Genstar Capital",
    cta: "Visit Genstar Capital",
    href: "https://www.gencap.com/",
  },
];

export default async function NewsroomPage() {
  const allData = await fetchGraphQL<PostsListResult>(GET_POSTS, {
    first: 1 + ANNOUNCEMENTS_COUNT,
    after: null,
  });

  const allPosts = allData?.posts?.nodes ?? [];
  const featured = allPosts[0] ?? null;
  const announcements = allPosts.slice(1, 1 + ANNOUNCEMENTS_COUNT);

  return (
    <>
      <div className="mx-auto max-w-[1080px] px-6 py-12 lg:px-8">
        {/* Breadcrumb - matches live: Home / Newsroom */}
        <nav className="mb-8 text-sm text-[var(--color-muted)]" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li>
              <Link href="/" className="text-[var(--color-link)] transition-colors hover:text-[var(--color-link-hover)]">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[var(--color-fg)]" aria-current="page">
              Newsroom
            </li>
          </ol>
        </nav>

        <h1 className="mb-8 text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
          Newsroom
        </h1>
      </div>

      {/* Featured hero - full-width image + gradient overlay + title + button (matches live) */}
      {featured && (
        <section className="relative mb-16 w-full overflow-hidden">
          <div className="relative aspect-[21/9] w-full min-h-[280px] sm:min-h-[320px]">
            <Image
              src={rewriteUploadsUrl(HERO_IMAGE)}
              alt=""
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority
            />
            {/* Dark gradient overlay for contrast - blue/teal left → green/teal right */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(14,50,80,0.92) 0%, rgba(0,58,116,0.88) 40%, rgba(0,155,124,0.78) 100%)",
              }}
              aria-hidden
            />
            {/* Centered title + button */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <h2 className="mb-6 max-w-6xl text-3xl font-bold leading-tight text-white drop-shadow-sm sm:text-4xl lg:text-5xl">
                {featured.title}
              </h2>
              <Link
                href={`/blog/${featured.categories?.nodes?.[0]?.slug ?? "announcements"}/${featured.slug ?? ""}/`}
                variant="button"
                className="inline-flex items-center rounded-[var(--radius-full)] border-2 border-white bg-white/10 px-8 py-3 text-sm font-bold uppercase tracking-wide text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                Read article
              </Link>
            </div>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-[1080px] px-6 pb-12 lg:px-8">
      {/* Announcements - carousel (3 cards + arrow for next 3) + See all below */}
      <section className="mb-16">
        <h2 className="mb-8 text-2xl font-bold text-[var(--color-fg)]">
          Announcements
        </h2>
        <AnnouncementsCarousel posts={announcements} seeAllHref="/blog/announcements/" />
      </section>

      {/* Digital Press Kit - 4 columns like live site */}
      <section className="border-t border-[var(--color-border)] pt-16">
        <h2 className="mb-6 text-2xl font-bold text-[var(--color-fg)]">
          Digital Press Kit
        </h2>
        <p className="mb-8 text-[var(--color-muted)]">
          For media inquiries or to request permission to use AmeriLife&apos;s
          logo or imagery, please{" "}
          <Link href="/contact" className="text-[var(--color-link)]">
            contact
          </Link>{" "}
          the AmeriLife Communications team.
        </p>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PRESS_KIT_CARDS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              variant="button"
              className="group flex flex-col overflow-hidden rounded-lg border border-[var(--color-border)] bg-white transition-shadow hover:shadow-md"
              {...(card.href.startsWith("http") && {
                target: "_blank",
                rel: "noopener noreferrer",
              })}
            >
              <div className="flex aspect-[4/3] items-center justify-center bg-[#f7f8f9] p-4">
                {card.type === "icon" ? (
                  <card.icon className="h-16 w-16 text-[var(--color-brand-primary)] transition-colors group-hover:text-[var(--color-brand-primary-hover)]" />
                ) : (
                  <Image
                    src={rewriteUploadsUrl(card.image)}
                    alt={card.heading}
                    width={200}
                    height={150}
                    className="h-full w-full object-contain"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="mb-1 font-bold text-[var(--color-brand-dark)]">
                  {card.heading}
                </p>
                <p className="text-sm font-semibold text-[var(--color-brand-primary)] transition-colors group-hover:text-[var(--color-brand-primary-hover)]">
                  {card.cta}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      </div>
    </>
  );
}
