"use client";

import { useMemo, useState } from "react";
import type { LeaderboardRow } from "@/lib/ideaxchange-leaderboard-data";
import { formatLeaderboardUpdatedDate } from "@/lib/ideaxchange-leaderboard-format";
import { Button } from "@/app/components/ui/Button";
import { ChevronDownIcon } from "@/app/components/ui/ChevronDownIcon";

const INITIAL_VISIBLE_ROWS = 10;

type EoSortColumn = "rank" | "affiliate" | "ytd";
type EoSortDirection = "asc" | "desc";

type EoSortState = {
  column: EoSortColumn;
  direction: EoSortDirection;
};

const DEFAULT_EO_SORT: EoSortState = {
  column: "ytd",
  direction: "desc",
};

const EO_SORT_LABELS: Record<EoSortColumn, string> = {
  rank: "Rank",
  affiliate: "Affiliate",
  ytd: "New Policies",
};

type Props = {
  id?: string;
  title: string;
  rows: LeaderboardRow[];
  lastUpdated?: string | null;
};

function parseCount(value: string): number {
  const n = Number.parseFloat(value.replace(/,/g, ""));
  return Number.isNaN(n) ? Number.NEGATIVE_INFINITY : n;
}

function parseRank(value: string | undefined, fallback: number): number {
  const n = Number.parseInt(String(value ?? "").trim(), 10);
  return Number.isNaN(n) ? fallback : n;
}

function sortEoRows(rows: LeaderboardRow[], sort: EoSortState): LeaderboardRow[] {
  const factor = sort.direction === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    let cmp = 0;
    if (sort.column === "affiliate") {
      cmp = a.affiliate.localeCompare(b.affiliate, undefined, { sensitivity: "base" });
    } else if (sort.column === "ytd") {
      cmp = parseCount(a.ytd) - parseCount(b.ytd);
    } else {
      cmp =
        parseRank(a.rank, Number.POSITIVE_INFINITY) -
        parseRank(b.rank, Number.POSITIVE_INFINITY);
    }
    if (cmp !== 0) return cmp * factor;
    return a.affiliate.localeCompare(b.affiliate, undefined, { sensitivity: "base" });
  });
}

function SortableHeader({
  column,
  label,
  align = "left",
  sort,
  onSort,
}: {
  column: EoSortColumn;
  label: string;
  align?: "left" | "right" | "center";
  sort: EoSortState;
  onSort: (column: EoSortColumn) => void;
}) {
  const active = sort.column === column;
  const alignClass =
    align === "right"
      ? "justify-end text-right"
      : align === "center"
        ? "justify-center text-center"
        : "text-left";

  return (
    <th
      className="px-4 py-3 sm:px-6"
      aria-sort={active ? (sort.direction === "asc" ? "ascending" : "descending") : "none"}
    >
      <button
        type="button"
        onClick={() => onSort(column)}
        className={`group inline-flex w-full items-center gap-1 text-xs font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${alignClass}`}
        aria-label={`Sort by ${EO_SORT_LABELS[column]}${active ? `, ${sort.direction === "asc" ? "ascending" : "descending"}` : ""}`}
      >
        <span>{label}</span>
        <ChevronDownIcon
          size={14}
          className={`shrink-0 transition-transform ${active ? "opacity-100" : "opacity-40 group-hover:opacity-70"} ${active && sort.direction === "asc" ? "rotate-180" : ""}`}
        />
      </button>
    </th>
  );
}

export function EoLeaderboardTable({ id, title, rows, lastUpdated }: Props) {
  const [sort, setSort] = useState<EoSortState>(DEFAULT_EO_SORT);
  const [showAll, setShowAll] = useState(false);
  const formattedUpdated = formatLeaderboardUpdatedDate(lastUpdated);

  const sortedRows = useMemo(() => sortEoRows(rows, sort), [rows, sort]);
  const hasMoreRows = sortedRows.length > INITIAL_VISIBLE_ROWS;
  const visibleRows = showAll ? sortedRows : sortedRows.slice(0, INITIAL_VISIBLE_ROWS);
  const hiddenCount = sortedRows.length - INITIAL_VISIBLE_ROWS;

  const handleSort = (column: EoSortColumn) => {
    setSort((current) => {
      if (current.column === column) {
        return {
          column,
          direction: current.direction === "asc" ? "desc" : "asc",
        };
      }
      return {
        column,
        direction: column === "affiliate" ? "asc" : column === "rank" ? "asc" : "desc",
      };
    });
  };

  const resetSort = () => setSort(DEFAULT_EO_SORT);
  const isDefaultSort =
    sort.column === DEFAULT_EO_SORT.column && sort.direction === DEFAULT_EO_SORT.direction;
  const sortSummary = `${EO_SORT_LABELS[sort.column]} (${sort.direction === "asc" ? "low → high" : "high → low"})`;

  return (
    <div
      id={id}
      className="scroll-mt-[calc(var(--header-height)+1rem)] overflow-hidden rounded-lg border border-[var(--color-border)] bg-white shadow-[0_4px_20px_rgba(36,66,96,0.06)]"
    >
      <div className="flex flex-col gap-3 border-b border-[var(--color-border)] bg-[var(--color-brand-primary)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <h3 className="text-center text-sm font-bold uppercase tracking-wider text-white sm:text-left">
          {title}
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-white/80">
            Sorted by {sortSummary}
          </span>
          {!isDefaultSort && (
            <button
              type="button"
              onClick={resetSort}
              className="rounded-sm border border-white/40 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            >
              Reset sort
            </button>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-[var(--color-brand-dark)] text-white">
              <SortableHeader column="rank" label="Rank" align="center" sort={sort} onSort={handleSort} />
              <SortableHeader column="affiliate" label="Affiliate" sort={sort} onSort={handleSort} />
              <SortableHeader
                column="ytd"
                label="New Policies"
                align="right"
                sort={sort}
                onSort={handleSort}
              />
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, i) => (
              <tr
                key={`${row.affiliate}-${i}`}
                className={i % 2 === 0 ? "bg-white" : "bg-[#f7faf9]"}
              >
                <td className="px-4 py-3.5 text-center font-semibold text-[var(--color-brand-dark)] sm:px-6">
                  {row.rank?.trim() || String(i + 1)}
                </td>
                <td className="px-4 py-3.5 font-semibold text-[var(--color-fg)] sm:px-6">
                  {row.affiliate}
                </td>
                <td className="px-4 py-3.5 text-right font-medium text-[var(--color-brand-dark)] sm:px-6">
                  {row.ytd}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hasMoreRows ? (
        <div className="flex justify-center border-t border-[var(--color-border)] bg-[#f7faf9] px-4 py-4 sm:px-6">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setShowAll((current) => !current)}
            aria-expanded={showAll}
          >
            {showAll ? "View less" : `View more (${hiddenCount})`}
          </Button>
        </div>
      ) : null}

      {formattedUpdated ? (
        <div className="border-t border-[var(--color-border)] bg-[#f7faf9] px-4 py-3 text-center text-xs text-[var(--color-muted)] sm:px-6 sm:text-right">
          Data last updated on {formattedUpdated}
        </div>
      ) : null}
    </div>
  );
}
