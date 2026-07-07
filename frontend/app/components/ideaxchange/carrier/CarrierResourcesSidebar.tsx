import Image from "next/image";
import { Link2 } from "lucide-react";
import { Link } from "@/app/components/ui/Link";
import type { IdeaxchangeCarrierResource } from "@/lib/ideaxchange-carrier-queries";
import type { IdeaxchangeListItem } from "@/lib/ideaxchange-queries";
import { IdeaxchangeSidebarAdSlot } from "@/app/components/ideaxchange/shared/IdeaxchangeSidebarAdSlot";
import { ideaxchangeFeaturedImageSrc } from "@/app/components/ideaxchange/shared/ideaxchange-card-types";
import {
  formatMonthYear,
  ideaxchangeHref,
  INSIGHT_IMG_QUALITY,
} from "@/app/components/ideaxchange/magazine/ideaxchange-utils";
import type { InsightsAdsSettings } from "@/lib/queries";
import { rewriteUploadsUrl } from "@/lib/wp-media";

type Props = {
  resources: IdeaxchangeCarrierResource[];
  articles: IdeaxchangeListItem[];
  insightsAds?: InsightsAdsSettings | null;
};

function fileTypeLabel(mimeType: string | null | undefined): string {
  if (!mimeType) return "File Type";
  if (mimeType.includes("pdf")) return "PDF";
  if (mimeType.includes("word") || mimeType.includes("document")) return "DOC";
  if (mimeType.includes("sheet") || mimeType.includes("excel")) return "XLS";
  return "File Type";
}

function CarrierResourceItem({ resource }: { resource: IdeaxchangeCarrierResource }) {
  const url = resource.fileUrl?.trim();
  if (!url) return null;
  const href = rewriteUploadsUrl(url);
  return (
    <li className="flex items-center gap-4 border-b border-[var(--color-border)] py-5 last:border-b-0">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-primary)] text-white"
        aria-hidden
      >
        <Link2 className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <a
          href={href}
          download
          className="block text-sm font-bold text-[var(--color-brand-dark)] hover:text-[var(--color-brand-primary)]"
        >
          {resource.label}
        </a>
        <span className="text-xs text-[var(--color-muted)]">
          {fileTypeLabel(resource.mimeType)}
        </span>
      </div>
    </li>
  );
}

function CarrierArticleItem({ article }: { article: IdeaxchangeListItem }) {
  const img = ideaxchangeFeaturedImageSrc(article.featuredImage?.node?.sourceUrl);
  return (
    <li className="flex gap-4 border-b border-[var(--color-border)] py-5 last:border-b-0">
      <Link
        href={ideaxchangeHref(article.slug)}
        variant="button"
        className="relative h-16 w-24 shrink-0 overflow-hidden bg-[var(--color-border)]/40"
      >
        <Image
          src={rewriteUploadsUrl(img)}
          alt=""
          fill
          className="object-cover"
          sizes="96px"
          quality={INSIGHT_IMG_QUALITY}
        />
      </Link>
      <div className="min-w-0 flex-1">
        <Link
          href={ideaxchangeHref(article.slug)}
          variant="button"
          className="text-left text-sm font-bold leading-snug text-[var(--color-brand-dark)] hover:text-[var(--color-brand-primary)]"
        >
          {article.title}
        </Link>
        {article.date ? (
          <p className="mt-1 text-xs text-[var(--color-muted)]">{formatMonthYear(article.date)}</p>
        ) : null}
      </div>
    </li>
  );
}

export function CarrierResourcesSidebar({ resources, articles, insightsAds }: Props) {
  const visibleResources = resources.filter((r) => r.fileUrl?.trim());

  return (
    <aside className="space-y-10">
      <section aria-labelledby="carrier-resources-heading">
        <h2
          id="carrier-resources-heading"
          className="mb-4 border-b-2 border-[var(--color-brand-primary)] pb-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-brand-primary)]"
        >
          Carrier resources
        </h2>
        {visibleResources.length > 0 ? (
          <ul>
            {visibleResources.map((r) => (
              <CarrierResourceItem key={r.label ?? r.fileUrl} resource={r} />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[var(--color-muted)]">No resources available yet.</p>
        )}
      </section>

      {articles.length > 0 ? (
        <section aria-labelledby="carrier-articles-heading">
          <h2
            id="carrier-articles-heading"
            className="mb-4 border-b-2 border-[var(--color-brand-primary)] pb-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-brand-primary)]"
          >
            Carrier spotlight articles
          </h2>
          <ul>{articles.slice(0, 3).map((a) => <CarrierArticleItem key={a.id} article={a} />)}</ul>
        </section>
      ) : null}

      <IdeaxchangeSidebarAdSlot slot={insightsAds?.sidebarVertical} />
    </aside>
  );
}
