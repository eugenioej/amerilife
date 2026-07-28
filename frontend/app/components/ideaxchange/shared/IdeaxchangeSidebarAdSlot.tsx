import type { IdeaxchangeAdSlot } from "@/lib/queries";
import {
  AdSidebarVertical,
  hasInsightsAdSlotImage,
} from "@/app/components/insights/InsightsAds";
import { pickIdeaxchangeAdCreative } from "./ideaxchange-ads";

type Props = {
  slot?: IdeaxchangeAdSlot | null;
  /** When false, hide the gray placeholder if WP has no creative. Default true. */
  showPlaceholder?: boolean;
};

export function IdeaxchangeSidebarAdSlot({
  slot,
  showPlaceholder = true,
}: Props) {
  const creative = pickIdeaxchangeAdCreative(slot);

  if (hasInsightsAdSlotImage(creative)) {
    return (
      <div className="lg:sticky lg:top-[calc(var(--header-height)+1rem)] lg:self-start">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
          Advertisement
        </p>
        <AdSidebarVertical slot={creative} />
      </div>
    );
  }

  if (!showPlaceholder) {
    return null;
  }

  return (
    <div className="lg:sticky lg:top-[calc(var(--header-height)+1rem)] lg:self-start">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
        Advertisement
      </p>
      <div
        className="flex min-h-[300px] w-full items-center justify-center rounded-sm border border-[var(--color-border)] bg-[#e4e8ec]"
        aria-hidden
      >
        <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
          Ad space
        </span>
      </div>
    </div>
  );
}
