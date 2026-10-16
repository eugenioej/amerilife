import type {
  LeaderboardSectionConfig,
  LeaderboardTableData,
} from "@/lib/ideaxchange-leaderboard-data";
import { EoLeaderboardTable } from "./EoLeaderboardTable";
import { LeaderboardTable } from "./LeaderboardTable";
import { AepLeaderboardTable } from "./AepLeaderboardTable";

function isAepSeason(): boolean {
  const now = new Date();

  const start = new Date("2026-10-15T00:00:00");
  const end = new Date("2026-12-08T08:00:00");

  return now >= start && now < end;
}

type Props = {
  section: LeaderboardSectionConfig;
  tableData: Record<string, LeaderboardTableData>;
};

export function LeaderboardSection({ section, tableData }: Props) {

  const visibleTables = section.tables.filter((table) => {
    const data = tableData[table.slug];
    const schema = data?.schema ?? table.schema ?? "standard";

    if (schema === "aep") {
      return isAepSeason();
    }

    return true;
  });

  if (visibleTables.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 md:mt-16" aria-labelledby={`leaderboard-${section.slug}`}>
      <h2
        id={`leaderboard-${section.slug}`}
        className="mb-8 text-sm font-bold uppercase tracking-[0.12em] text-[var(--color-brand-primary)] md:mb-10"
      >
        {section.title}
      </h2>
      <div className="flex flex-col gap-10 md:gap-12">
        {visibleTables.map((table) => {
          const data = tableData[table.slug];
          const schema = data?.schema ?? table.schema ?? "standard";

          const shared = {
            id: `leaderboard-table-${table.slug}`,
            title: table.title,
            rows: data?.rows ?? [],
            lastUpdated: data?.lastUpdated,
          };
          if (schema === "eo") {
            return <EoLeaderboardTable key={table.slug} {...shared} />;
          }

          if (schema === "aep") {
            return <AepLeaderboardTable key={table.slug} {...shared} />;
          }
          return <LeaderboardTable key={table.slug} {...shared} />;
        })}
      </div>
    </section>
  );
}
