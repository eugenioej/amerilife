import Image from "next/image";
import { Clock } from "lucide-react";
import { Link } from "@/app/components/ui/Link";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import type { InsightDetail, InsightListItem, InsightsAdsSettings } from "@/lib/queries";
import { rewriteUploadsInHtml, rewriteUploadsUrl } from "@/lib/wp-media";
import { AdBannerHorizontal, AdSidebarVertical, hasInsightsAdSlotImage } from "./InsightsAds";
import { InsightPostChrome } from "./InsightPostChrome";
import { InsightSharePanel } from "./InsightSharePanel";
import { InsightTopicBadge } from "./InsightTopicBadge";
import type { PostsListItem } from "@/lib/queries";
import {
  formatBylineDate,
  formatInsightExcerptPlain,
  formatMonthYear,
  insightCategoryHref,
  insightHref,
  INSIGHT_IMG_QUALITY,
  topicLabel,
} from "./insights-utils";

const PLACEHOLDER_IMG =
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/04/AML-Wealth-II-Announcement-040532023-HERO-1024x358-1.png";

type Props = {
  post: InsightDetail;
  /** Other insights for sidebar + bottom grid (same list; template slices). */
  relatedPosts: InsightListItem[];
  inTheNewsPosts: PostsListItem[];
  shareUrl: string;
  insightsAds?: InsightsAdsSettings | null;
};

function estimateReadMinutes(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function RelatedArticlesSidebar({ posts }: { posts: InsightListItem[] }) {
  if (posts.length === 0) return null;
  return (
    <div className="w-full">
      <div className="mb-4 flex items-center gap-3">
        <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-brand-primary)]">
          Related articles
        </h2>
        <div className="h-px flex-1 bg-[var(--color-border)]" aria-hidden />
      </div>
      <ul className="divide-y divide-[var(--color-border)]">
        {posts.map((item) => {
          const img =
            item.featuredImage?.node?.sourceUrl?.trim() || PLACEHOLDER_IMG;
          const href = insightHref(item.slug, item.insightTopics?.nodes?.[0]?.slug);
          return (
            <li key={item.id} className="flex gap-3 py-4 first:pt-0">
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
                  sizes="160px"
                  quality={INSIGHT_IMG_QUALITY}
                />
              </Link>
              <div className="min-w-0">
                <Link
                  href={href}
                  variant="button"
                  className="text-left text-sm font-bold leading-snug text-[var(--color-fg)] hover:text-[var(--color-brand-primary)]"
                >
                  {item.title}
                </Link>
                {item.date && (
                  <p className="mt-1 text-xs text-[var(--color-muted)]">
                    {formatMonthYear(item.date)}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function InTheNewsSidebar({ posts }: { posts: PostsListItem[] }) {
  if (posts.length === 0) return null;
  return (
    <div className="w-full mt-10">
      <div className="mb-4 flex items-center gap-3">
        <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-brand-primary)]">
          AmeriLife In The News
        </h2>
        <div className="h-px flex-1 bg-[var(--color-border)]" aria-hidden />
      </div>
      <ul className="divide-y divide-[var(--color-border)]">
        {posts.map((item) => {
          const img =
            item.featuredImage?.node?.sourceUrl?.trim() || PLACEHOLDER_IMG;
          const href = item.uri || "#";
          const categorySlug = item.categories?.nodes?.[0]?.slug;
         
          return (
            <li key={item.id} className="flex gap-3 py-4 first:pt-0">
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
                  sizes="160px"
                  quality={INSIGHT_IMG_QUALITY}
                />
              </Link>
              <div className="min-w-0">
                <Link
                  href={`/newsroom/${categorySlug}/${href}`}
                  variant="button"
                  className="text-left text-sm font-bold leading-snug text-[var(--color-fg)] hover:text-[var(--color-brand-primary)]"
                >
                  {item.title}
                </Link>
                {item.date && (
                  <p className="mt-1 text-xs text-[var(--color-muted)]">
                    {formatMonthYear(item.date)}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function RelatedPostsGrid({ posts }: { posts: InsightListItem[] }) {
  if (posts.length === 0) return null;
  return (
    <section className="border-t border-[var(--color-border)] pt-12 md:pt-16">
      <h2 className="mb-8 text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-brand-primary)] md:mb-10">
        Related posts
      </h2>
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {posts.map((item) => {
          const img =
            item.featuredImage?.node?.sourceUrl?.trim() || PLACEHOLDER_IMG;
          const href = insightHref(item.slug, item.insightTopics?.nodes?.[0]?.slug);
          return (
            <article key={item.id} className="group flex flex-col">
              <Link
                href={href}
                variant="button"
                className="relative mb-3 block aspect-video w-full overflow-hidden bg-[var(--color-border)]/40"
              >
                <Image
                  src={rewriteUploadsUrl(img)}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, min(480px, 33vw)"
                  quality={INSIGHT_IMG_QUALITY}
                />
              </Link>
              <Link href={href} variant="button" className="text-left hover:no-underline">
                <h3 className="font-sans text-lg font-bold leading-snug text-[var(--color-brand-dark)] transition-colors group-hover:text-[var(--color-brand-primary)]">
                  {item.title}
                </h3>
              </Link>
              {item.date && (
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  {formatMonthYear(item.date)}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function CareersCtaBanner() {
  return (
    <section
      className="mt-12 flex flex-col items-stretch justify-between gap-6 rounded-sm px-6 py-8 md:mt-16 md:flex-row md:items-center md:px-10 md:py-10"
      style={{ background: "var(--gradient-primary)" }}
      aria-labelledby="insights-careers-cta-heading"
    >
      <p
        id="insights-careers-cta-heading"
        className="text-center text-xl font-bold text-white md:text-left md:text-2xl"
      >
        Learn about careers at AmeriLife.
      </p>
      <Link
        href="/join-our-team/"
        variant="button"
        className="inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-sm bg-[var(--color-brand-dark)] px-8 text-sm font-bold uppercase tracking-wide text-white no-underline transition-opacity hover:!text-white hover:!no-underline hover:opacity-95"
      >
        Discover more
      </Link>
    </section>
  );
}

export function InsightPostTemplate({
  post,
  relatedPosts,
  inTheNewsPosts,
  shareUrl,
  insightsAds,
}: Props) {
  const html = post.content ? rewriteUploadsInHtml(post.content) : "";
  const rawImg =
    post.featuredImage?.node?.sourceUrl?.trim() ||
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&q=80";
  const img = rewriteUploadsUrl(rawImg);
  const excerptPlain = formatInsightExcerptPlain(post.excerpt);
  const topic = post.insightTopics?.nodes?.[0];
  const topicName = topic?.name?.trim() || "Insights";
  const topicSlug = topic?.slug?.trim();
  const readMin = estimateReadMinutes(html);

  const isEditorialTeam =
  post.author?.node?.firstName === "AmeriLife" &&
  post.author?.node?.lastName === "Editorial Team";

  const proseClasses =
    "insight-article-body max-w-none font-sans text-[var(--color-fg)] [&_h1]:font-sans [&_h2]:font-sans [&_h3]:font-sans [&_h4]:font-sans [&_h5]:font-sans [&_h6]:font-sans [&_p]:mb-4 [&_p]:leading-relaxed [&_a]:text-[var(--color-link)] [&_a:hover]:text-[var(--color-link-hover)] [&_a]:underline [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2 [&_iframe]:my-6 [&_iframe]:aspect-video [&_iframe]:w-full [&_iframe]:max-w-full [&_iframe]:rounded-md [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:scroll-mt-24 [&_h2]:text-base [&_h2]:font-bold [&_h2]:uppercase [&_h2]:tracking-wide [&_h2]:!text-[var(--color-brand-primary)] [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-base [&_h3]:font-bold [&_h3]:uppercase [&_h3]:tracking-wide [&_h3]:!text-[var(--color-brand-primary)] [&_strong]:text-[var(--color-fg)]";

  const sidebarList = relatedPosts.slice(0, 5);
  const bottomGrid = relatedPosts.slice(0, 3);

  return (
    <InsightPostChrome>
      <SiteBreadcrumb
        className="mb-6"
        items={[
          { label: "Home", href: "/" },
          { label: "Insights", href: "/insights/" },
          {
            label: topicName,
            href: topicSlug ? insightCategoryHref(topicSlug) : undefined,
            className: "max-w-[12rem] truncate",
          },
          {
            label: post.title ?? "Insights",
            className: "truncate text-[var(--color-muted)] sm:max-w-[28rem]",
          },
        ]}
      />

      <InsightTopicBadge
        post={post}
        className="mb-4 bg-[var(--color-brand-primary)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
      />

      <h1 className="max-w-4xl font-sans text-3xl font-bold leading-tight tracking-tight text-[var(--color-brand-dark)] sm:text-4xl md:text-[2.5rem] md:leading-[1.15]">
        {post.title}
      </h1>

      {excerptPlain ? (
        <div className="mt-4 max-w-3xl text-lg leading-relaxed text-[var(--color-muted)] whitespace-pre-line">
          {excerptPlain}
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-[var(--color-border)] pb-8 text-sm text-[var(--color-muted)]">
        {post.date ? (
          <time dateTime={post.date}>{formatBylineDate(post.date)}</time>
        ) : null}
        {post.date ? (
          <span className="text-[var(--color-border)]" aria-hidden>
            ·
          </span>
        ) : null}
        <span className="flex items-center gap-1.5">
          <Clock className="size-4 shrink-0" aria-hidden />
          {readMin} min read
        </span>
        <span className="text-[var(--color-border)]" aria-hidden>
          ·
        </span>
        <InsightSharePanel url={shareUrl} title={post.title ?? "Insight"} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-10 lg:gap-x-12">
          <div className="lg:col-span-8">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--color-border)]/30">
              <Image
                src={img}
                alt=""
                fill
                className="object-cover object-center"
                sizes="(max-width:1024px) 100vw, min(960px, 66vw)"
                quality={INSIGHT_IMG_QUALITY}
                priority
              />
            </div>

            <div className="mt-10">
              {html ? (
                <div
                  className={proseClasses}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              ) : (
                <p className="text-[var(--color-muted)]">Content coming soon.</p>
              )}
            </div>

            {hasInsightsAdSlotImage(insightsAds?.inArticle) ? (
              <div className="mt-12">
                <AdBannerHorizontal slot={insightsAds?.inArticle} />
              </div>
            ) : null}

            <div className="mt-10 flex flex-nowrap items-center justify-between gap-3 pt-8">
              {topicSlug ? (
                <Link
                  href={insightCategoryHref(topicSlug)}
                  variant="button"
                  className="inline-flex min-w-0 max-w-[calc(100%-3rem)] shrink items-center truncate rounded-sm border border-[var(--color-border)] bg-[#f4f6f8] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted)] transition-colors hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)]"
                >
                  {topicLabel(post)}
                </Link>
              ) : (
                <span className="inline-flex min-w-0 max-w-[calc(100%-3rem)] shrink items-center truncate rounded-sm border border-[var(--color-border)] bg-[#f4f6f8] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                  {topicLabel(post)}
                </span>
              )}
              <div className="shrink-0">
                <InsightSharePanel url={shareUrl} title={post.title ?? "Insight"} />
              </div>
            </div>

             <div className="mt-10 border-t border-[var(--color-border)] pt-8 flex flex items-start md:items-center">
              <Link href={`/contributors/${post.author?.node?.userFields?.contributorSlug}`}>
                <div className="relative h-[75px] min-h-[75px] w-[75px] min-w-[75px] shrink-0 overflow-hidden rounded-full bg-[#e2e5ed] mr-6 shadow-lg border border-gray-200">
                  <Image
                    src={post.author?.node?.userFields?.headshot || "https://headlessameril.wpenginepowered.com/wp-content/uploads/2021/11/cropped-favicon-blue-270x270.jpg"}
                    alt={post.author?.node?.firstName || ""}
                    fill
                    className="object-cover"
                    sizes="75px"
                    priority={false}
                  />
                </div>
              </Link>

              <div className="flex-1 min-w-0">

              {isEditorialTeam ? (
                <>
                  <p>
                    AmeriLife Editorial Team is a professional writers and editors within
                    the life, health insurance and financial services industry at AmeriLife
                    company.
                  </p>
                </>

                ) : ( 
                <>
                <p>
                  {post.author?.node?.firstName} {post.author?.node?.lastName}
                  {" is "}
                  {post.author?.node?.userFields?.jobTitle}
                  {" at "}
                  
                  {post.author?.node?.userFields?.companyWebsite ? (
                  <a
                  href={post.author.node.userFields.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline transition-colors hover:text-[var(--color-brand-primary)]"
                  >
                    {post.author?.node?.userFields?.company}
                  </a>
                  ) : (
                  
                  <p>{post.author?.node?.userFields?.company}</p>
                  
                  )}
                            
                  {post.author?.node?.userFields?.company &&
                  post.author?.node?.userFields?.company.toLowerCase() !== "amerilife"
                    ? (
                        <>
                          {", an "}
                          <a
                            href="https://amerilife.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline transition-colors hover:text-[var(--color-brand-primary)]"
                          >
                            AmeriLife
                          </a>
                          {" company."}
                        </>
                      )
                      : "."}

                </p>
                </>
                
)}

{post.author?.node?.userFields?.email ? (
                        <p className="">
                          <a
                            href={`mailto:${post.author.node.userFields.email}`}
                            className="underline transition-colors font-bold text-[var(--color-brand-primary)] hover:text-[var(--color-brand-dark)]"
                          >
                            {post.author.node.userFields.email}
                          </a>
                        </p>
                      ): null}
</div>

            </div>

          </div>

          <aside className="lg:col-span-4">
            <RelatedArticlesSidebar posts={sidebarList} />
            <InTheNewsSidebar posts={inTheNewsPosts} />
            {hasInsightsAdSlotImage(insightsAds?.sidebarVertical) ? (
              <div className="mt-10 w-full lg:sticky lg:top-[calc(var(--header-height)+1rem)] lg:self-start">
                <AdSidebarVertical slot={insightsAds?.sidebarVertical} />
              </div>
            ) : null}
          </aside>
        </div>

        <CareersCtaBanner />

        <RelatedPostsGrid posts={bottomGrid} />
    </InsightPostChrome>
  );
}
