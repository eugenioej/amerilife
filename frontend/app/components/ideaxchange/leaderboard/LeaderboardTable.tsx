"use client";

import { useMemo, useState, type ReactNode } from "react";
import type { LeaderboardRow } from "@/lib/ideaxchange-leaderboard-data";
import { formatLeaderboardUpdatedDate } from "@/lib/ideaxchange-leaderboard-format";
import {
  DEFAULT_LEADERBOARD_SORT,
  LEADERBOARD_SORT_LABELS,
  nextLeaderboardSort,
  sortLeaderboardRows,
  type LeaderboardSortColumn,
  type LeaderboardSortState,
} from "@/lib/ideaxchange-leaderboard-sort";
import { Button } from "@/app/components/ui/Button";
import { ChevronDownIcon } from "@/app/components/ui/ChevronDownIcon";

const INITIAL_VISIBLE_ROWS = 10;

type Props = {
  id?: string;
  title: string;
  rows: LeaderboardRow[];
  lastUpdated?: string | null;
};

function percentClass(value: string): string {
  if (value.startsWith("-")) return "text-[#c45c5c]";
  const n = parseFloat(value.replace("%", ""));
  if (!Number.isNaN(n) && n > 0) return "text-[var(--color-brand-primary)]";
  return "text-[var(--color-fg)]";
}

function trendClass(symbol: string): string {
  if (symbol === "▲") return "text-[var(--color-brand-primary)]";
  if (symbol === "▼") return "text-[#c45c5c]";
  return "text-[var(--color-muted)]";
}

type SortableHeaderProps = {
  column: LeaderboardSortColumn;
  label: ReactNode;
  align?: "left" | "right" | "center";
  sort: LeaderboardSortState;
  onSort: (column: LeaderboardSortColumn) => void;
  className?: string;
};

function SortableHeader({
  column,
  label,
  align = "left",
  sort,
  onSort,
  className = "",
}: SortableHeaderProps) {
  const active = sort.column === column;
  const alignClass =
    align === "right" ? "justify-end text-right" : align === "center" ? "justify-center text-center" : "text-left";

  return (
    <th className={`px-4 py-3 sm:px-6 ${className}`} aria-sort={active ? (sort.direction === "asc" ? "ascending" : "descending") : "none"}>
      <button
        type="button"
        onClick={() => onSort(column)}
        className={`group inline-flex w-full items-center gap-1 text-xs font-bold tracking-wider text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${alignClass}`}
        aria-label={`Sort by ${LEADERBOARD_SORT_LABELS[column]}${active ? `, ${sort.direction === "asc" ? "ascending" : "descending"}` : ""}`}
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

export function LeaderboardTable({ id, title, rows, lastUpdated }: Props) {
  const [sort, setSort] = useState<LeaderboardSortState>(DEFAULT_LEADERBOARD_SORT);
  const [showAll, setShowAll] = useState(false);
  const formattedUpdated = formatLeaderboardUpdatedDate(lastUpdated);

  const sortedRows = useMemo(() => sortLeaderboardRows(rows, sort), [rows, sort]);
  const hasMoreRows = sortedRows.length > INITIAL_VISIBLE_ROWS;
  const visibleRows = showAll ? sortedRows : sortedRows.slice(0, INITIAL_VISIBLE_ROWS);
  const hiddenCount = sortedRows.length - INITIAL_VISIBLE_ROWS;

  const handleSort = (column: LeaderboardSortColumn) => {
    setSort((current) => nextLeaderboardSort(current, column));
  };

  const resetSort = () => setSort(DEFAULT_LEADERBOARD_SORT);

  const sortSummary = `${LEADERBOARD_SORT_LABELS[sort.column]} (${sort.direction === "asc" ? "low → high" : "high → low"})`;

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
          {(sort.column !== DEFAULT_LEADERBOARD_SORT.column ||
            sort.direction !== DEFAULT_LEADERBOARD_SORT.direction) && (
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
              <SortableHeader
                column="affiliate"
                label="Affiliate"
                sort={sort}
                onSort={handleSort}
                className="uppercase"
              />
              <SortableHeader
                column="ytd"
                label="YTD"
                align="right"
                sort={sort}
                onSort={handleSort}
                className="uppercase"
              />
              <SortableHeader
                column="lytd"
                label="LYTD"
                align="right"
                sort={sort}
                onSort={handleSort}
                className="uppercase"
              />
              <SortableHeader
                column="vsLytd"
                label="vs LYTD"
                align="right"
                sort={sort}
                onSort={handleSort}
                className="normal-case tracking-normal"
              />
              <SortableHeader
                column="vsLqtd"
                label="vs LQTD"
                align="right"
                sort={sort}
                onSort={handleSort}
                className="normal-case tracking-normal"
              />
              <SortableHeader
                column="vsLmtd"
                label="vs LMTD"
                align="right"
                sort={sort}
                onSort={handleSort}
                className="normal-case tracking-normal"
              />
              <SortableHeader
                column="trend"
                label={<span className="whitespace-nowrap">▲ ⬤ ▼ (vs LYTD)</span>}
                align="center"
                sort={sort}
                onSort={handleSort}
                className="normal-case tracking-normal"
              />
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, i) => (
              <tr
                key={`${row.affiliate}-${i}`}
                className={i % 2 === 0 ? "bg-white" : "bg-[#f7faf9]"}
              >
                <td className="px-4 py-3.5 font-semibold text-[var(--color-fg)] sm:px-6">
                  {row.affiliate}
                </td>
                <td className="px-4 py-3.5 text-right font-medium text-[var(--color-brand-dark)] sm:px-6">
                  {row.ytd}
                </td>
                <td className="px-4 py-3.5 text-right text-[var(--color-muted)] sm:px-6">
                  {row.lytd}
                </td>
                <td
                  className={`px-4 py-3.5 text-right font-semibold sm:px-6 ${percentClass(row.vsLytd)}`}
                >
                  {row.vsLytd}
                </td>
                <td
                  className={`px-4 py-3.5 text-right font-semibold sm:px-6 ${percentClass(row.vsLqtd)}`}
                >
                  {row.vsLqtd}
                </td>
                <td
                  className={`px-4 py-3.5 text-right font-semibold sm:px-6 ${percentClass(row.vsLmtd)}`}
                >
                  {row.vsLmtd}
                </td>
                <td
                  className={`px-4 py-3.5 text-center text-base font-semibold sm:px-6 ${trendClass(row.trend)}`}
                  aria-label={`Trend vs LYTD: ${row.trend}`}
                >
                  {row.trend}
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
