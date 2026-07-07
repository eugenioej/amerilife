import type { InsightsAdSlotSetting } from "@/lib/queries";
import {
  AdBannerHorizontal,
  hasInsightsAdSlotImage,
} from "@/app/components/insights/InsightsAds";

type Props = {
  slot?: InsightsAdSlotSetting | null;
  className?: string;
  showPlaceholder?: boolean;
};

export function IdeaxchangeHorizontalAdSlot({
  slot,
  className = "",
  showPlaceholder = true,
}: Props) {
  if (hasInsightsAdSlotImage(slot)) {
    return (
      <div className={className}>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
          Advertisement
        </p>
        <AdBannerHorizontal slot={slot} />
      </div>
    );
  }

  if (!showPlaceholder) {
    return null;
  }

  return (
    <div className={className}>
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
        Advertisement
      </p>
      <div
        className="flex min-h-[120px] w-full items-center justify-center rounded-sm border border-[var(--color-border)] bg-[#e4e8ec] md:min-h-[140px]"
        aria-hidden
      >
        <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
          Ad space
        </span>
      </div>
    </div>
  );
}
