import Image from "next/image";
import { Facebook, Instagram, Linkedin, Youtube, Clock } from "lucide-react";
import { Link } from "@/app/components/ui/Link";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import type { InsightDetail, InsightListItem } from "@/lib/queries";
import { rewriteUploadsInHtml, rewriteUploadsUrl } from "@/lib/wp-media";
import { AdBannerHorizontal, AdSidebarVertical } from "./InsightsAds";
import {
  formatBylineDate,
  formatMonthYear,
  insightHref,
  stripHtml,
  topicLabel,
} from "./insights-utils";

const PLACEHOLDER_IMG =
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/04/AML-Wealth-II-Announcement-040532023-HERO-1024x358-1.png";

type Props = {
  post: InsightDetail;
  /** Other insights for sidebar + bottom grid (same list; template slices). */
  relatedPosts: InsightListItem[];
  shareUrl: string;
};

function estimateReadMinutes(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function ShareBarLarge({ url, title }: { url: string; title: string }) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  return (
    <div className="flex flex-wrap gap-3">
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${u}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-[44px] items-center gap-2 rounded-sm bg-[#1877F2] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        <Facebook className="size-5 shrink-0" aria-hidden />
        <span>Facebook</span>
      </a>
      <a
        href="https://www.instagram.com/amerilife/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-[44px] items-center gap-2 rounded-sm bg-[#E4405F] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        <Instagram className="size-5 shrink-0" aria-hidden />
        <span>Instagram</span>
      </a>
      <a
        href="https://www.youtube.com/channel/UCFbug5RiedNPdb-5Fpq3szuOg"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-[44px] items-center gap-2 rounded-sm bg-[#FF0000] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        <Youtube className="size-5 shrink-0" aria-hidden />
        <span>YouTube</span>
      </a>
      <span className="sr-only">Share: {t}</span>
    </div>
  );
}

function ShareIconsRow({ url }: { url: string }) {
  const u = encodeURIComponent(url);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${u}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex size-10 items-center justify-center rounded-sm bg-[#1877F2] text-white transition-opacity hover:opacity-90"
        aria-label="Share on Facebook"
      >
        <Facebook className="size-5" />
      </a>
      <a
        href="https://www.instagram.com/amerilife/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex size-10 items-center justify-center rounded-sm bg-[#E4405F] text-white transition-opacity hover:opacity-90"
        aria-label="AmeriLife on Instagram"
      >
        <Instagram className="size-5" />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex size-10 items-center justify-center rounded-sm bg-[#0A66C2] text-white transition-opacity hover:opacity-90"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="size-5" />
      </a>
      <a
        href="https://www.youtube.com/channel/UCFbug5RiedNPdb-5Fpq3szuOg"
        target="_blank"
        rel="noopener noreferrer"
        className="flex size-10 items-center justify-center rounded-sm bg-[#FF0000] text-white transition-opacity hover:opacity-90"
        aria-label="AmeriLife on YouTube"
      >
        <Youtube className="size-5" />
      </a>
    </div>
  );
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
          const href = insightHref(item.slug);
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
                  sizes="80px"
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
          const href = insightHref(item.slug);
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
                  sizes="(max-width:640px) 100vw, 33vw"
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
        className="inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-sm bg-[var(--color-brand-dark)] px-8 text-sm font-bold uppercase tracking-wide text-white transition-opacity hover:opacity-95"
      >
        Discover more
      </Link>
    </section>
  );
}

export function InsightPostTemplate({ post, relatedPosts, shareUrl }: Props) {
  const html = post.content ? rewriteUploadsInHtml(post.content) : "";
  const rawImg =
    post.featuredImage?.node?.sourceUrl?.trim() ||
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&q=80";
  const img = rewriteUploadsUrl(rawImg);
  const excerptPlain = stripHtml(post.excerpt);
  const topic = post.insightTopics?.nodes?.[0];
  const topicName = topic?.name?.trim() || "Insights";
  const readMin = estimateReadMinutes(html);

  const proseClasses =
    "insight-article-body max-w-none font-sans text-[var(--color-fg)] [&_h1]:font-sans [&_h2]:font-sans [&_h3]:font-sans [&_h4]:font-sans [&_h5]:font-sans [&_h6]:font-sans [&_p]:mb-4 [&_p]:leading-relaxed [&_a]:text-[var(--color-link)] [&_a:hover]:text-[var(--color-link-hover)] [&_a]:underline [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2 [&_iframe]:my-6 [&_iframe]:aspect-video [&_iframe]:w-full [&_iframe]:max-w-full [&_iframe]:rounded-md [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:scroll-mt-24 [&_h2]:text-base [&_h2]:font-bold [&_h2]:uppercase [&_h2]:tracking-wide [&_h2]:!text-[var(--color-brand-primary)] [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-base [&_h3]:font-bold [&_h3]:uppercase [&_h3]:tracking-wide [&_h3]:!text-[var(--color-brand-primary)] [&_strong]:text-[var(--color-fg)]";

  const sidebarList = relatedPosts.slice(0, 5);
  const bottomGrid = relatedPosts.slice(0, 3);

  return (
    <article className="bg-white pb-16 md:pb-20">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] pt-8 md:pt-10">
        <SiteBreadcrumb
          className="mb-6"
          items={[
            { label: "Home", href: "/" },
            { label: "Insights", href: "/insights/" },
            {
              label: topicName,
              className: "max-w-[min(100%,12rem)] truncate",
            },
            {
              label: post.title ?? "Insights",
              className: "max-w-[min(100%,28rem)] truncate text-[var(--color-muted)]",
            },
          ]}
        />

        <span className="mb-4 inline-block bg-[var(--color-brand-primary)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
          {topicLabel(post)}
        </span>

        <h1 className="max-w-4xl font-sans text-3xl font-bold leading-tight tracking-tight text-[var(--color-brand-dark)] sm:text-4xl md:text-[2.5rem] md:leading-[1.15]">
          {post.title}
        </h1>

        {excerptPlain ? (
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[var(--color-muted)]">
            {excerptPlain}
          </p>
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
        </div>

        <ShareBarLarge url={shareUrl} title={post.title ?? "Insight"} />

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-10 lg:gap-x-12">
          <div className="lg:col-span-8">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--color-border)]/30">
              <Image
                src={img}
                alt=""
                fill
                className="object-cover object-center"
                sizes="(max-width:1024px) 100vw, 66vw"
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

            <div className="mt-12">
              <AdBannerHorizontal label="In-article" />
            </div>

            <div className="mt-10 flex flex-col gap-6 border-t border-[var(--color-border)] pt-8 sm:flex-row sm:items-center sm:justify-between">
              <span className="inline-flex w-fit items-center rounded-sm border border-[var(--color-border)] bg-[#f4f6f8] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                {topicLabel(post)}
              </span>
              <ShareIconsRow url={shareUrl} />
            </div>

          </div>

          <aside className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
            <RelatedArticlesSidebar posts={sidebarList} />
            <div className="mt-10">
              <AdSidebarVertical />
            </div>
          </aside>
        </div>

        <CareersCtaBanner />

        <RelatedPostsGrid posts={bottomGrid} />
      </div>
    </article>
  );
}
