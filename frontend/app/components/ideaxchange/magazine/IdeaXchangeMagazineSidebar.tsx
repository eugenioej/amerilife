import Image from "next/image";
import { Link } from "@/app/components/ui/Link";
import type { IdeaxchangeListItem } from "@/lib/ideaxchange-queries";
import type { InsightsAdsSettings } from "@/lib/queries";
import { rewriteUploadsUrl } from "@/lib/wp-media";
import { IdeaxchangeSidebarAdSlot } from "@/app/components/ideaxchange/shared/IdeaxchangeSidebarAdSlot";
import {
  ideaxchangeFeaturedImageSrc,
} from "@/app/components/ideaxchange/shared/ideaxchange-card-types";
import {
  formatBylineDate,
  formatInsightExcerptPlain,
  formatMonthYear,
  ideaxchangeHref,
  INSIGHT_IMG_QUALITY,
  topicLabel,
} from "./ideaxchange-utils";

type Props = {
  spotlight: IdeaxchangeListItem | null;
  recentSidebar: IdeaxchangeListItem[];
  spotlightBadgeLabel?: string;
  recentHeading?: string;
  insightsAds?: InsightsAdsSettings | null;
};

export function IdeaXchangeMagazineSidebar({
  spotlight,
  recentSidebar,
  spotlightBadgeLabel,
  recentHeading = "Recent articles",
  insightsAds,
}: Props) {
  return (
    <>
      {spotlight ? (
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
                    ideaxchangeFeaturedImageSrc(spotlight.featuredImage?.node?.sourceUrl),
                  )}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  sizes="(max-width:1024px) 100vw, min(400px, 33vw)"
                  quality={INSIGHT_IMG_QUALITY}
                />
                <span className="absolute bottom-3 left-3 inline-block w-fit max-w-full bg-[var(--color-brand-primary)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                  {spotlightBadgeLabel ?? topicLabel(spotlight)}
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
                <div className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[var(--color-muted)]">
                  {formatInsightExcerptPlain(spotlight.excerpt) ||
                    "Explore this spotlight story in full."}
                </div>
              </div>
            </Link>
          </div>
        </div>
      ) : null}

      {recentSidebar.length > 0 ? (
        <div className="mb-10">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-brand-primary)]">
            {recentHeading}
          </h3>
          <ul className="divide-y divide-[var(--color-border)]">
            {recentSidebar.map((post) => {
              const img = ideaxchangeFeaturedImageSrc(post.featuredImage?.node?.sourceUrl);
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
                    {post.date ? (
                      <p className="mt-1 text-xs text-[var(--color-muted)]">
                        {formatMonthYear(post.date)}
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <IdeaxchangeSidebarAdSlot slot={insightsAds?.sidebarVertical} />
    </>
  );
}
