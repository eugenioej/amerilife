import type {
  CareerLeaderboardSectionConfig,
  CareerLeaderboardTableData,
} from "@/lib/ideaxchange-career-leaderboard-data";
import { CareerLeaderboardTable } from "./CareerLeaderboardTable";

type Props = {
  section: CareerLeaderboardSectionConfig;
  tablesBySlug: Record<string, CareerLeaderboardTableData>;
};

export function CareerLeaderboardSection({ section, tablesBySlug }: Props) {
  return (
    <section className="mt-12 md:mt-16" aria-labelledby={`career-leaderboard-${section.slug}`}>
      <h2
        id={`career-leaderboard-${section.slug}`}
        className="mb-8 text-sm font-bold uppercase tracking-[0.12em] text-[var(--color-brand-primary)] md:mb-10"
      >
        {section.title}
      </h2>
      <div className="flex flex-col gap-10 md:gap-12">
        {section.tables.map((tableConfig) => {
          const table = tablesBySlug[tableConfig.slug];
          if (!table) return null;

          return (
            <CareerLeaderboardTable
              key={table.slug}
              id={`career-leaderboard-table-${table.slug}`}
              title={table.title}
              columns={table.columns}
              rows={table.rows}
              periodLabel={table.periodLabel}
              lastUpdated={table.lastUpdated}
              isFallback={table.isFallback}
            />
          );
        })}
      </div>
    </section>
  );
}
