import type { LeaderListItem } from "@/lib/queries";
import { LeaderCard } from "./LeaderCard";

type LeadersGridProps = {
  leaders: LeaderListItem[];
  /** If set, that leader is omitted (e.g. on detail page). */
  excludeSlug?: string;
};

export function LeadersGrid({ leaders, excludeSlug }: LeadersGridProps) {
  const items = excludeSlug
    ? leaders.filter((l) => l.slug && l.slug !== excludeSlug)
    : leaders;

  if (items.length === 0) {
    return (
      <p className="text-center text-[var(--color-muted)]">No leaders to display.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((leader, index) => (
        <LeaderCard key={leader.id} leader={leader} revealIndex={index} />
      ))}
    </div>
  );
}
