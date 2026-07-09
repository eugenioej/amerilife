import Image from "next/image";
import { Clock } from "lucide-react";
import { Link } from "@/app/components/ui/Link";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import type { IdeaxchangeDetail, IdeaxchangeListItem } from "@/lib/ideaxchange-queries";
import { rewriteUploadsInHtml, rewriteUploadsUrl } from "@/lib/wp-media";
import { InsightPostChrome } from "@/app/components/insights/InsightPostChrome";
import { InsightSharePanel } from "@/app/components/insights/InsightSharePanel";
import { IdeaXchangeTopicBadge } from "./IdeaXchangeTopicBadge";
import { ideaxchangeFeaturedImageSrc } from "@/app/components/ideaxchange/shared/ideaxchange-card-types";
import { IDEAXCHANGE_HOME_FEED_PATH } from "@/lib/ideaxchange-constants";
import {
  formatBylineDate,
  formatInsightExcerptPlain,
  formatMonthYear,
  ideaxchangeCategoryHref,
  ideaxchangeHref,
  INSIGHT_IMG_QUALITY,
  topicLabel,
} from "./ideaxchange-utils";

type Props = {
  post: IdeaxchangeDetail;
  /** Other insights for sidebar + bottom grid (same list; template slices). */
  relatedPosts: IdeaxchangeListItem[];
  shareUrl: string;
};

function estimateReadMinutes(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function RelatedArticlesSidebar({ posts }: { posts: IdeaxchangeListItem[] }) {
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
            ideaxchangeFeaturedImageSrc(item.featuredImage?.node?.sourceUrl);
          const href = ideaxchangeHref(item.slug);
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

function RelatedPostsGrid({ posts }: { posts: IdeaxchangeListItem[] }) {
  if (posts.length === 0) return null;
  return (
    <section className="border-t border-[var(--color-border)] pt-12 md:pt-16">
      <h2 className="mb-8 text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-brand-primary)] md:mb-10">
        Related posts
      </h2>
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {posts.map((item) => {
          const img =
            ideaxchangeFeaturedImageSrc(item.featuredImage?.node?.sourceUrl);
          const href = ideaxchangeHref(item.slug);
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
      aria-labelledby="ideaxchange-careers-cta-heading"
    >
      <p
        id="ideaxchange-careers-cta-heading"
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

export function IdeaXchangePostTemplate({
  post,
  relatedPosts,
  shareUrl,
}: Props) {
  const html = post.content ? rewriteUploadsInHtml(post.content) : "";
  const img = rewriteUploadsUrl(ideaxchangeFeaturedImageSrc(post.featuredImage?.node?.sourceUrl));
  const excerptPlain = formatInsightExcerptPlain(post.excerpt);
  const topic = post.ideaxchangeTopics?.nodes?.[0];
  const topicName = topic?.name?.trim() || "Insights";
  const topicSlug = topic?.slug?.trim();
  const readMin = estimateReadMinutes(html);

  const proseClasses =
    "ideaxchange-article-body max-w-none font-sans text-[var(--color-fg)] [&_h1]:font-sans [&_h2]:font-sans [&_h3]:font-sans [&_h4]:font-sans [&_h5]:font-sans [&_h6]:font-sans [&_p]:mb-4 [&_p]:leading-relaxed [&_a]:text-[var(--color-link)] [&_a:hover]:text-[var(--color-link-hover)] [&_a]:underline [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2 [&_iframe]:my-6 [&_iframe]:aspect-video [&_iframe]:w-full [&_iframe]:max-w-full [&_iframe]:rounded-md [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:scroll-mt-24 [&_h2]:text-base [&_h2]:font-bold [&_h2]:uppercase [&_h2]:tracking-wide [&_h2]:!text-[var(--color-brand-primary)] [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-base [&_h3]:font-bold [&_h3]:uppercase [&_h3]:tracking-wide [&_h3]:!text-[var(--color-brand-primary)] [&_strong]:text-[var(--color-fg)]";

  const sidebarList = relatedPosts.slice(0, 5);
  const bottomGrid = relatedPosts.slice(0, 3);

  return (
    <InsightPostChrome>
      <SiteBreadcrumb
        className="mb-6"
        items={[
          { label: "Home", href: "/" },
          { label: "ideaXchange", href: IDEAXCHANGE_HOME_FEED_PATH },
          {
            label: topicName,
            href: topicSlug ? ideaxchangeCategoryHref(topicSlug) : undefined,
            className: "max-w-[12rem] truncate",
          },
          {
            label: post.title ?? "ideaXchange",
            className: "truncate text-[var(--color-muted)] sm:max-w-[28rem]",
          },
        ]}
      />

      <IdeaXchangeTopicBadge
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
        <InsightSharePanel url={shareUrl} title={post.title ?? "Article"} />
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


            <div className="mt-10 flex flex-nowrap items-center justify-between gap-3 border-t border-[var(--color-border)] pt-8">
              {topicSlug ? (
                <Link
                  href={ideaxchangeCategoryHref(topicSlug)}
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
                <InsightSharePanel url={shareUrl} title={post.title ?? "Article"} />
              </div>
            </div>

          </div>

          <aside className="lg:col-span-4">
            <RelatedArticlesSidebar posts={sidebarList} />
          </aside>
        </div>

        <CareersCtaBanner />

        <RelatedPostsGrid posts={bottomGrid} />
    </InsightPostChrome>
  );
}
