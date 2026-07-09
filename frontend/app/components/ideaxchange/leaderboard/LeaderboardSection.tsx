import type {
  LeaderboardRow,
  LeaderboardSectionConfig,
} from "@/lib/ideaxchange-leaderboard-data";
import { LeaderboardTable } from "./LeaderboardTable";

type Props = {
  section: LeaderboardSectionConfig;
  tableData: Record<string, LeaderboardRow[]>;
};

export function LeaderboardSection({ section, tableData }: Props) {
  return (
    <section className="mt-12 md:mt-16" aria-labelledby={`leaderboard-${section.slug}`}>
      <h2
        id={`leaderboard-${section.slug}`}
        className="mb-8 text-sm font-bold uppercase tracking-[0.12em] text-[var(--color-brand-primary)] md:mb-10"
      >
        {section.title}
      </h2>
      <div className="flex flex-col gap-10 md:gap-12">
        {section.tables.map((table) => (
          <LeaderboardTable
            key={table.slug}
            id={`leaderboard-table-${table.slug}`}
            title={table.title}
            rows={tableData[table.slug] ?? []}
          />
        ))}
      </div>
    </section>
  );
}
