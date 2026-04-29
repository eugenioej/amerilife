import Image from "next/image";
import { Link } from "@/app/components/ui/Link";
import type { InsightListItem, InsightsAdsSettings } from "@/lib/queries";
import { rewriteUploadsUrl } from "@/lib/wp-media";
import {
  formatBylineDate,
  formatInsightExcerptPlain,
  formatMonthYear,
  insightHref,
  INSIGHT_IMG_QUALITY,
  INSIGHTS_NEWSROOM_INITIAL,
  isInsightFeatured,
  topicLabel,
} from "./insights-utils";
import { AdBannerHorizontal, AdSidebarVertical, hasInsightsAdSlotImage } from "./InsightsAds";
import { InsightsNewsroomColumn } from "./InsightsNewsroomColumn";
import { InsightTopicBadge } from "./InsightTopicBadge";

const PLACEHOLDER_IMG =
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/04/AML-Wealth-II-Announcement-040532023-HERO-1024x358-1.png";

type Props = {
  posts: InsightListItem[];
  /** WPGraphQL connection after the initial magazine batch — enables “Load more” in the main column. */
  listPageInfo?: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
  /** Sponsorship slots from WP Admin → Insights → Ads */
  insightsAds?: InsightsAdsSettings | null;
};

function dedupeById(posts: InsightListItem[]): InsightListItem[] {
  const seen = new Set<string>();
  const out: InsightListItem[] = [];
  for (const p of posts) {
    const id = p.id?.trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(p);
  }
  return out;
}

const FEATURED_ARTICLES_COUNT = 4;

function takeFeaturedArticles(pool: InsightListItem[], count: number): InsightListItem[] {
  const ids = new Set<string>();
  const out: InsightListItem[] = [];
  const add = (p: InsightListItem) => {
    const id = p.id?.trim();
    if (!id || ids.has(id) || out.length >= count) return;
    ids.add(id);
    out.push(p);
  };
  for (const p of pool) {
    if (out.length >= count) break;
    if (isInsightFeatured(p)) add(p);
  }
  for (const p of pool) {
    if (out.length >= count) break;
    add(p);
  }
  return out;
}

/** Partition posts so hero, spotlight, featured, sidebar recent, and newsroom never repeat the same article. */
function partitionInsights(posts: InsightListItem[]) {
  const unique = dedupeById(posts);

  const hero = unique.slice(0, 3);
  let remaining = unique.slice(3);

  let spotlight: InsightListItem | null = null;
  const spotlightIdx = remaining.findIndex((p) => p.insightFields?.isSpotlight);
  if (spotlightIdx >= 0) {
    spotlight = remaining[spotlightIdx]!;
    remaining = remaining.filter((_, i) => i !== spotlightIdx);
  } else if (remaining.length > 0) {
    spotlight = remaining[0]!;
    remaining = remaining.slice(1);
  }

  const featured = takeFeaturedArticles(remaining, FEATURED_ARTICLES_COUNT);
  const featuredIds = new Set(featured.map((p) => p.id).filter(Boolean) as string[]);
  remaining = remaining.filter((p) => !p.id || !featuredIds.has(p.id));

  const recentSidebar = remaining.slice(0, 4);
  const newsroomRest = remaining.slice(4);

  return { hero, spotlight, featured, recentSidebar, newsroomRest };
}

export function InsightsMagazinePage({ posts, listPageInfo, insightsAds }: Props) {
  const { hero, spotlight, featured, recentSidebar, newsroomRest } =
    partitionInsights(posts);

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
                quality={INSIGHT_IMG_QUALITY}
                priority={hi < 2}
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"
                aria-hidden
              />
              <div className="relative z-[1] p-5 pb-6 text-left md:p-6">
                <span className="mb-2 inline-block w-fit max-w-full self-start bg-[var(--color-brand-primary)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
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
        <AdBannerHorizontal slot={insightsAds?.primaryHorizontal} />

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
                      sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
                      quality={INSIGHT_IMG_QUALITY}
                    />
                  </Link>

                  <InsightTopicBadge
                    post={post}
                    className="mb-2 bg-[var(--color-brand-primary)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
                  />
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

        {hasInsightsAdSlotImage(insightsAds?.secondaryHorizontal) ? (
          <div className="mt-12 md:mt-16">
            <AdBannerHorizontal slot={insightsAds?.secondaryHorizontal} />
          </div>
        ) : null}

        {/* Main column + sidebar */}
        <div className="mt-12 grid grid-cols-1 gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <InsightsNewsroomColumn
              initialPosts={newsroomRest.slice(0, INSIGHTS_NEWSROOM_INITIAL)}
              deferredBatchPosts={newsroomRest.slice(INSIGHTS_NEWSROOM_INITIAL)}
              initialHasNextPage={listPageInfo?.hasNextPage ?? false}
              initialEndCursor={listPageInfo?.endCursor ?? null}
            />
          </div>

          <aside className="lg:col-span-4">
            {spotlight && (
              <div className="mb-10">
                <div className="border border-[var(--color-border)] bg-white p-0">
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
                        sizes="(max-width:1024px) 100vw, min(400px, 33vw)"
                        quality={INSIGHT_IMG_QUALITY}
                      />
                      <span className="absolute bottom-3 left-3 inline-block w-fit max-w-full bg-[var(--color-brand-primary)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
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
                      <div className="mt-3 text-sm leading-relaxed text-[var(--color-muted)] whitespace-pre-line">
                        {formatInsightExcerptPlain(spotlight.excerpt) ||
                          "Explore this spotlight story in full."}
                      </div>
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
                          sizes="(max-width:1024px) 160px, 80px"
                          quality={INSIGHT_IMG_QUALITY}
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

            {hasInsightsAdSlotImage(insightsAds?.sidebarVertical) ? (
              <div className="lg:sticky lg:top-[calc(var(--header-height)+1rem)] lg:self-start">
                <AdSidebarVertical slot={insightsAds?.sidebarVertical} />
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </div>
  );
}
