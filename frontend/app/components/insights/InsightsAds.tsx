import Image from "next/image";
import type { InsightsAdSlotSetting } from "@/lib/queries";
import { rewriteUploadsUrl } from "@/lib/wp-media";
import { INSIGHT_IMG_QUALITY } from "./insights-utils";

/** Placeholder dimensions — layout hint only; image renders with height:auto so actual creatives keep natural ratio. */
const AD_IMG_FALLBACK_W = 1600;
const AD_IMG_FALLBACK_H = 900;

export function hasInsightsAdSlotImage(
  slot?: InsightsAdSlotSetting | null,
): boolean {
  return Boolean(slot?.imageUrl?.trim());
}

type BannerProps = {
  slot?: InsightsAdSlotSetting | null;
};

/** Renders nothing unless WP has an image for this slot. */
export function AdBannerHorizontal({ slot }: BannerProps) {
  const raw = slot?.imageUrl?.trim();
  if (!raw) {
    return null;
  }

  const src = rewriteUploadsUrl(raw);
  const alt = slot?.altText?.trim() ?? "";
  const href = slot?.targetUrl?.trim();

  const creative = (
    <div className="w-full overflow-hidden rounded-sm border border-[var(--color-border)] bg-neutral-50">
      <Image
        src={src}
        alt={alt}
        width={AD_IMG_FALLBACK_W}
        height={AD_IMG_FALLBACK_H}
        className="h-auto w-full max-w-full object-contain align-middle"
        sizes="(max-width: 1280px) 100vw, min(1200px, 92vw)"
        quality={INSIGHT_IMG_QUALITY}
        style={{ width: "100%", height: "auto" }}
      />
    </div>
  );

  return (
    <div className="w-full">
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)] focus-visible:ring-offset-2"
        >
          {creative}
        </a>
      ) : (
        creative
      )}
    </div>
  );
}

/** Renders nothing unless WP has an image for this slot. */
export function AdSidebarVertical({
  slot,
}: {
  slot?: InsightsAdSlotSetting | null;
}) {
  const raw = slot?.imageUrl?.trim();
  if (!raw) {
    return null;
  }

  const src = rewriteUploadsUrl(raw);
  const alt = slot?.altText?.trim() ?? "";
  const href = slot?.targetUrl?.trim();

  const creative = (
    <div className="w-full overflow-hidden rounded-sm border border-[var(--color-border)] bg-neutral-50">
      <Image
        src={src}
        alt={alt}
        width={800}
        height={1200}
        className="h-auto w-full max-w-full object-contain align-middle"
        sizes="(max-width: 1024px) 100vw, 400px"
        quality={INSIGHT_IMG_QUALITY}
        style={{ width: "100%", height: "auto" }}
      />
    </div>
  );

  return (
    <div className="w-full">
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)] focus-visible:ring-offset-2"
        >
          {creative}
        </a>
      ) : (
        creative
      )}
    </div>
  );
}
