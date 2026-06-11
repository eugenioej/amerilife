import Image from "next/image";
import { Link } from "@/app/components/ui/Link";
import type { IdeaxchangeListItem } from "@/lib/ideaxchange-queries";
import { rewriteUploadsUrl } from "@/lib/wp-media";
import {
  formatBylineDate,
  formatInsightExcerptPlain,
  formatMonthYear,
  ideaxchangeHref,
  INSIGHT_IMG_QUALITY,
  INSIGHTS_NEWSROOM_INITIAL,
  isIdeaxchangeFeatured,
  topicLabel,
} from "./ideaxchange-utils";
import { IdeaXchangeLeaderboardDemo } from "./IdeaXchangeLeaderboardDemo";
import { IdeaXchangeNewsroomColumn } from "./IdeaXchangeNewsroomColumn";
import { IdeaXchangeTopicBadge } from "./IdeaXchangeTopicBadge";

const PLACEHOLDER_IMG =
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/04/AML-Wealth-II-Announcement-040532023-HERO-1024x358-1.png";

type Props = {
  posts: IdeaxchangeListItem[];
  /** WPGraphQL connection after the initial magazine batch — enables “Load more” in the main column. */
  listPageInfo?: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
};

function dedupeById(posts: IdeaxchangeListItem[]): IdeaxchangeListItem[] {
  const seen = new Set<string>();
  const out: IdeaxchangeListItem[] = [];
  for (const p of posts) {
    const id = p.id?.trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(p);
  }
  return out;
}

const FEATURED_ARTICLES_COUNT = 4;

function takeFeaturedArticles(pool: IdeaxchangeListItem[], count: number): IdeaxchangeListItem[] {
  const ids = new Set<string>();
  const out: IdeaxchangeListItem[] = [];
  const add = (p: IdeaxchangeListItem) => {
    const id = p.id?.trim();
    if (!id || ids.has(id) || out.length >= count) return;
    ids.add(id);
    out.push(p);
  };
  for (const p of pool) {
    if (out.length >= count) break;
    if (isIdeaxchangeFeatured(p)) add(p);
  }
  for (const p of pool) {
    if (out.length >= count) break;
    add(p);
  }
  return out;
}

/** Partition posts so hero, spotlight, featured, sidebar recent, and newsroom never repeat the same article. */
function partitionInsights(posts: IdeaxchangeListItem[]) {
  const unique = dedupeById(posts);

  const hero = unique.slice(0, 3);
  let remaining = unique.slice(3);

  let spotlight: IdeaxchangeListItem | null = null;
  const spotlightIdx = remaining.findIndex((p) => p.ideaxchangeFields?.isSpotlight);
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

export function IdeaXchangeMagazinePage({ posts, listPageInfo }: Props) {
  const { hero, spotlight, featured, recentSidebar, newsroomRest } =
    partitionInsights(posts);

  return (
    <div className="bg-white">
      <h1 className="sr-only">ideaXchange</h1>

      {/* Hero — three equal columns */}
      <section className="grid min-h-[52vh] w-full grid-cols-1 md:grid-cols-3 md:min-h-[56vh]">
        {hero.map((post, hi) => {
          const img =
            post.featuredImage?.node?.sourceUrl?.trim() || PLACEHOLDER_IMG;
          const href = ideaxchangeHref(post.slug);
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
        {/* Featured articles — four columns */}
        <section className="mt-12 md:mt-16">
          <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-brand-primary)] md:mb-8">
            Featured articles
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {featured.map((post) => {
              const img =
                post.featuredImage?.node?.sourceUrl?.trim() || PLACEHOLDER_IMG;
              const href = ideaxchangeHref(post.slug);
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

                  <IdeaXchangeTopicBadge
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

        <IdeaXchangeLeaderboardDemo />

        {/* Main column + sidebar */}
        <div className="mt-12 grid grid-cols-1 gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <IdeaXchangeNewsroomColumn
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
                    href={ideaxchangeHref(spotlight.slug)}
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
                  const href = ideaxchangeHref(post.slug);
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

          </aside>
        </div>
      </div>
    </div>
  );
}
