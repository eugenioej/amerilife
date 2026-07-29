import Image from "next/image";
import { Clock } from "lucide-react";
import { Link } from "@/app/components/ui/Link";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import type { IdeaxchangeDetail, IdeaxchangeListItem } from "@/lib/ideaxchange-queries";
import type { IdeaxchangeAdsSettings } from "@/lib/queries";
import { rewriteUploadsInHtml, rewriteUploadsUrl } from "@/lib/wp-media";
import { InsightPostChrome } from "@/app/components/insights/InsightPostChrome";
import { InsightSharePanel } from "@/app/components/insights/InsightSharePanel";
import { IdeaxchangeHorizontalAdSlot } from "@/app/components/ideaxchange/shared/IdeaxchangeHorizontalAdSlot";
import { IdeaxchangeSidebarAdSlot } from "@/app/components/ideaxchange/shared/IdeaxchangeSidebarAdSlot";
import { ideaxchangeFeaturedImageSrc } from "@/app/components/ideaxchange/shared/ideaxchange-card-types";
import {
  formatBylineDate,
  formatInsightExcerptPlain,
  formatMonthYear,
  INSIGHT_IMG_QUALITY,
} from "@/app/components/ideaxchange/magazine/ideaxchange-utils";
import { IDEAXCHANGE_SALES_SUCCESS_PATH } from "@/lib/ideaxchange-constants";
import { SALES_SUCCESS_BADGE_LABEL, salesSuccessHref } from "./sales-success-utils";

type Props = {
  post: IdeaxchangeDetail;
  relatedPosts: IdeaxchangeListItem[];
  shareUrl: string;
  ideaxchangeAds?: IdeaxchangeAdsSettings | null;
};

function estimateReadMinutes(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function AdditionalIncentivesSidebar({ posts }: { posts: IdeaxchangeListItem[] }) {
  if (posts.length === 0) return null;
  return (
    <div className="w-full">
      <div className="mb-4 flex items-center gap-3">
        <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-brand-primary)]">
          Additional incentives
        </h2>
        <div className="h-px flex-1 bg-[var(--color-border)]" aria-hidden />
      </div>
      <ul className="divide-y divide-[var(--color-border)]">
        {posts.map((item) => {
          const img = ideaxchangeFeaturedImageSrc(item.featuredImage?.node?.sourceUrl);
          const href = salesSuccessHref(item.slug);
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
                {item.date ? (
                  <p className="mt-1 text-xs text-[var(--color-muted)]">
                    {formatMonthYear(item.date)}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function SalesSuccessPostTemplate({
  post,
  relatedPosts,
  shareUrl,
  ideaxchangeAds,
}: Props) {
  const html = post.content ? rewriteUploadsInHtml(post.content) : "";
  const img = rewriteUploadsUrl(ideaxchangeFeaturedImageSrc(post.featuredImage?.node?.sourceUrl));
  const excerptPlain = formatInsightExcerptPlain(post.excerpt);
  const readMin = estimateReadMinutes(html);
  const sidebarList = relatedPosts.slice(0, 5);

  const proseClasses =
    "ideaxchange-article-body max-w-none font-sans text-[var(--color-fg)] [&_h1]:font-sans [&_h2]:font-sans [&_h3]:font-sans [&_h4]:font-sans [&_h5]:font-sans [&_h6]:font-sans [&_p]:mb-4 [&_p]:leading-relaxed [&_a]:text-[var(--color-link)] [&_a:hover]:text-[var(--color-link-hover)] [&_a]:underline [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2 [&_iframe]:my-6 [&_iframe]:aspect-video [&_iframe]:w-full [&_iframe]:max-w-full [&_iframe]:rounded-md [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:scroll-mt-24 [&_h2]:text-base [&_h2]:font-bold [&_h2]:uppercase [&_h2]:tracking-wide [&_h2]:!text-[var(--color-brand-primary)] [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-base [&_h3]:font-bold [&_h3]:uppercase [&_h3]:tracking-wide [&_h3]:!text-[var(--color-brand-primary)] [&_strong]:text-[var(--color-fg)]";

  return (
    <InsightPostChrome>
      <SiteBreadcrumb
        className="mb-6"
        items={[
          { label: "Home", href: "/" },
          { label: "Sales Success", href: "/ideaxchange/sales-success/" },
          { label: "Sales Success", href: IDEAXCHANGE_SALES_SUCCESS_PATH },
          {
            label: post.title ?? "Article",
            className: "truncate text-[var(--color-muted)] sm:max-w-[28rem]",
          },
        ]}
      />

      <span className="mb-4 inline-block bg-[var(--color-brand-primary)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
        {SALES_SUCCESS_BADGE_LABEL}
      </span>

      <h1 className="max-w-4xl font-sans text-3xl font-bold leading-tight tracking-tight text-[var(--color-brand-dark)] sm:text-4xl md:text-[2.5rem] md:leading-[1.15]">
        {post.title}
      </h1>

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-[var(--color-border)] pb-8 text-sm text-[var(--color-muted)]">
        <span>By: AmeriLife Editorial</span>
        {post.date ? (
          <>
            <span className="text-[var(--color-border)]" aria-hidden>
              ·
            </span>
            <time dateTime={post.date}>{formatBylineDate(post.date)}</time>
          </>
        ) : null}
        <span className="text-[var(--color-border)]" aria-hidden>
          ·
        </span>
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
              <div className={proseClasses} dangerouslySetInnerHTML={{ __html: html }} />
            ) : (
              <p className="text-[var(--color-muted)]">Content coming soon.</p>
            )}
          </div>

          <IdeaxchangeHorizontalAdSlot
            slot={ideaxchangeAds?.homePrimaryHorizontal}
            className="mt-12"
          />

          <div className="mt-10 flex flex-nowrap items-center justify-between gap-3 border-t border-[var(--color-border)] pt-8">
            <Link
              href={IDEAXCHANGE_SALES_SUCCESS_PATH}
              variant="button"
              className="inline-flex min-w-0 max-w-[calc(100%-3rem)] shrink items-center truncate rounded-sm border border-[var(--color-border)] bg-[#f4f6f8] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted)] transition-colors hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)]"
            >
              {SALES_SUCCESS_BADGE_LABEL}
            </Link>
            <div className="shrink-0">
              <InsightSharePanel url={shareUrl} title={post.title ?? "Article"} />
            </div>
          </div>
        </div>

        <aside className="lg:col-span-4">
          <AdditionalIncentivesSidebar posts={sidebarList} />
          <div className="mt-10">
            <IdeaxchangeSidebarAdSlot slot={ideaxchangeAds?.homeSidebarVertical} />
          </div>
        </aside>
      </div>
    </InsightPostChrome>
  );
}
