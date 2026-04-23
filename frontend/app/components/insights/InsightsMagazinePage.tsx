import Image from "next/image";
import { Link } from "@/app/components/ui/Link";
import type { InsightListItem } from "@/lib/queries";
import { rewriteUploadsUrl } from "@/lib/wp-media";
import {
  formatBylineDate,
  formatMonthYear,
  insightHref,
  stripHtml,
  topicLabel,
} from "./insights-utils";
import { AdBannerHorizontal, AdSidebarVertical } from "./InsightsAds";

const PLACEHOLDER_IMG =
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/04/AML-Wealth-II-Announcement-040532023-HERO-1024x358-1.png";

type Props = {
  posts: InsightListItem[];
};

export function InsightsMagazinePage({ posts }: Props) {
  const hero = posts.slice(0, 3);
  const featured = posts.slice(3, 7);
  const rest = posts.slice(7);

  const spotlight =
    posts.find((p) => p.insightFields?.isSpotlight) ?? featured[0] ?? posts[3] ?? posts[0] ?? null;

  const recentSidebar = posts
    .filter((p) => p.id !== spotlight?.id)
    .slice(3, 7);

  return (
    <div className="bg-white">
      <h1 className="sr-only">Insights</h1>

      {/* Hero — three equal columns */}
      <section className="grid min-h-[52vh] w-full grid-cols-1 md:grid-cols-3 md:min-h-[56vh]">
        {hero.map((post, hi) => {
          const img =
            post.featuredImage?.node?.sourceUrl?.trim() || PLACEHOLDER_IMG;
          const href = insightHref(post.slug);
          return (
            <Link
              key={post.id}
              href={href}
              variant="button"
              className="group relative flex min-h-[280px] flex-col justify-end overflow-hidden md:min-h-0"
            >
              <Image
                src={rewriteUploadsUrl(img)}
                alt=""
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width:768px) 100vw, 33vw"
                priority={hi < 2}
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"
                aria-hidden
              />
              <div className="relative z-[1] p-5 pb-6 text-left md:p-6">
                <span className="mb-2 inline-block bg-[var(--color-brand-primary)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  {topicLabel(post)}
                </span>
                <p className="mb-2 text-lg font-bold leading-snug text-white drop-shadow-sm md:text-xl">
                  {post.title}
                </p>
                {post.date && (
                  <p className="text-sm text-white/90">
                    {formatMonthYear(post.date)}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </section>

      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-10 md:py-14">
        <AdBannerHorizontal label="Primary" />

        {/* Featured articles — four columns */}
        <section className="mt-12 md:mt-16">
          <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-brand-primary)] md:mb-8">
            Featured articles
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {featured.map((post) => {
              const img =
                post.featuredImage?.node?.sourceUrl?.trim() || PLACEHOLDER_IMG;
              const href = insightHref(post.slug);
              return (
                <article key={post.id} className="group flex flex-col">
                  <Link
                    href={href}
                    variant="button"
                    className="relative mb-3 block aspect-[16/10] w-full overflow-hidden bg-[var(--color-border)]/40"
                  >
                    <Image
                      src={rewriteUploadsUrl(img)}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      sizes="(max-width:640px) 100vw, 25vw"
                    />
                  </Link>
                  <Link
                    href={href}
                    variant="button"
                    className="text-left hover:no-underline"
                  >
                    <h3 className="text-base font-bold leading-snug text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-brand-primary)]">
                      {post.title}
                    </h3>
                  </Link>
                  {post.date && (
                    <p className="mt-2 text-sm text-[var(--color-muted)]">
                      {formatMonthYear(post.date)}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <div className="mt-12 md:mt-16">
          <AdBannerHorizontal label="Secondary" />
        </div>

        {/* Newsroom + sidebar */}
        <div className="mt-12 grid grid-cols-1 gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <div className="mb-6 flex items-center gap-4 md:mb-8">
              <h2 className="shrink-0 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-brand-primary)]">
                Newsroom
              </h2>
              <div className="h-px flex-1 bg-[var(--color-border)]" aria-hidden />
            </div>
            <div className="flex flex-col">
              {rest.map((post) => {
                const img =
                  post.featuredImage?.node?.sourceUrl?.trim() || PLACEHOLDER_IMG;
                const href = insightHref(post.slug);
                return (
                  <article
                    key={post.id}
                    className="flex flex-col gap-4 border-b border-[var(--color-border)] py-8 first:pt-0 last:border-b-0 sm:flex-row sm:gap-6"
                  >
                    <Link
                      href={href}
                      variant="button"
                      className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-[var(--color-border)]/30 sm:w-[220px] md:w-[260px]"
                    >
                      <Image
                        src={rewriteUploadsUrl(img)}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="260px"
                      />
                      <span className="absolute bottom-2 left-2 bg-[var(--color-brand-primary)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                        {topicLabel(post)}
                      </span>
                    </Link>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold leading-snug text-[var(--color-fg)] md:text-xl">
                        <Link href={href} variant="button" className="hover:text-[var(--color-brand-primary)]">
                          {post.title}
                        </Link>
                      </h3>
                      {post.date ? (
                        <p className="mt-2 text-sm text-[var(--color-muted)]">
                          {formatBylineDate(post.date)}
                        </p>
                      ) : null}
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[var(--color-muted)]">
                        {stripHtml(post.excerpt) || "Read the full article for more."}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <aside className="lg:col-span-4">
            {spotlight && (
              <div className="mb-10">
                <div className="bg-[var(--color-brand-dark)] py-3 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-white">
                    Spotlight topic here
                  </p>
                </div>
                <div className="border border-t-0 border-[var(--color-border)] bg-white p-0">
                  <Link
                    href={insightHref(spotlight.slug)}
                    variant="button"
                    className="group block"
                  >
                    <div className="relative aspect-[16/11] w-full overflow-hidden bg-[var(--color-border)]/30">
                      <Image
                        src={rewriteUploadsUrl(
                          spotlight.featuredImage?.node?.sourceUrl?.trim() ||
                            PLACEHOLDER_IMG,
                        )}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        sizes="(max-width:1024px) 100vw, 400px"
                      />
                      <span className="absolute bottom-3 left-3 bg-[var(--color-brand-primary)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                        {topicLabel(spotlight)}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold leading-snug text-[var(--color-fg)]">
                        {spotlight.title}
                      </h3>
                      {spotlight.date ? (
                        <p className="mt-2 text-sm text-[var(--color-muted)]">
                          {formatBylineDate(spotlight.date)}
                        </p>
                      ) : null}
                      <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-[var(--color-muted)]">
                        {stripHtml(spotlight.excerpt) ||
                          "Explore this spotlight story in full."}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            )}

            <div className="mb-10">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-brand-primary)]">
                Recent articles
              </h3>
              <ul className="divide-y divide-[var(--color-border)]">
                {recentSidebar.map((post) => {
                  const img =
                    post.featuredImage?.node?.sourceUrl?.trim() || PLACEHOLDER_IMG;
                  const href = insightHref(post.slug);
                  return (
                    <li key={post.id} className="flex gap-3 py-4 first:pt-0">
                      <Link
                        href={href}
                        variant="button"
                        className="relative h-16 w-20 shrink-0 overflow-hidden bg-[var(--color-border)]/30"
                      >
                        <Image
                          src={rewriteUploadsUrl(img)}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </Link>
                      <div className="min-w-0">
                        <Link
                          href={href}
                          variant="button"
                          className="text-left text-sm font-bold leading-snug text-[var(--color-fg)] hover:text-[var(--color-brand-primary)]"
                        >
                          {post.title}
                        </Link>
                        {post.date && (
                          <p className="mt-1 text-xs text-[var(--color-muted)]">
                            {formatMonthYear(post.date)}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <AdSidebarVertical />
          </aside>
        </div>
      </div>
    </div>
  );
}
