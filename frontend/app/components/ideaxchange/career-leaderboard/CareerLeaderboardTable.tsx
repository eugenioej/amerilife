"use client";

import { useMemo, useState } from "react";
import type {
  CareerLeaderboardColumn,
  CareerLeaderboardRow,
} from "@/lib/ideaxchange-career-leaderboard-data";
import { formatCareerLeaderboardUpdatedDate } from "@/lib/ideaxchange-career-leaderboard-data";
import { Button } from "@/app/components/ui/Button";
import { ChevronDownIcon } from "@/app/components/ui/ChevronDownIcon";

const INITIAL_VISIBLE_ROWS = 10;

type SortState = {
  column: string;
  direction: "asc" | "desc";
};

type Props = {
  id?: string;
  title: string;
  columns: CareerLeaderboardColumn[];
  rows: CareerLeaderboardRow[];
  periodLabel?: string | null;
  lastUpdated?: string | null;
  isFallback?: boolean;
};

function parseSortableValue(value: string): number | string {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "—") return "";
  const numeric = trimmed.replace(/[$,%]/g, "");
  const parsed = Number(numeric);
  if (!Number.isNaN(parsed) && numeric !== "") return parsed;
  return trimmed.toLowerCase();
}

function compareRows(
  a: CareerLeaderboardRow,
  b: CareerLeaderboardRow,
  column: string,
  direction: "asc" | "desc",
): number {
  const av = parseSortableValue(a[column] ?? "");
  const bv = parseSortableValue(b[column] ?? "");

  let result = 0;
  if (typeof av === "number" && typeof bv === "number") {
    result = av - bv;
  } else {
    result = String(av).localeCompare(String(bv));
  }

  return direction === "asc" ? result : -result;
}

function defaultSortColumn(columns: CareerLeaderboardColumn[]): string {
  return columns.find((column) => column.key === "rank")?.key ?? columns[0]?.key ?? "agentName";
}

export function CareerLeaderboardTable({
  id,
  title,
  columns,
  rows,
  periodLabel,
  lastUpdated,
  isFallback,
}: Props) {
  const defaultColumn = defaultSortColumn(columns);
  const [sort, setSort] = useState<SortState>({ column: defaultColumn, direction: "asc" });
  const [showAll, setShowAll] = useState(false);

  const sortedRows = useMemo(
    () => [...rows].sort((a, b) => compareRows(a, b, sort.column, sort.direction)),
    [rows, sort.column, sort.direction],
  );

  const hasMoreRows = sortedRows.length > INITIAL_VISIBLE_ROWS;
  const visibleRows = showAll ? sortedRows : sortedRows.slice(0, INITIAL_VISIBLE_ROWS);
  const hiddenCount = sortedRows.length - INITIAL_VISIBLE_ROWS;

  const activeColumn = columns.find((column) => column.key === sort.column);

  const handleSort = (columnKey: string) => {
    setSort((current) => {
      if (current.column === columnKey) {
        return { column: columnKey, direction: current.direction === "asc" ? "desc" : "asc" };
      }
      return { column: columnKey, direction: columnKey === "rank" ? "asc" : "desc" };
    });
  };

  return (
    <div
      id={id}
      className="scroll-mt-[calc(var(--header-height)+1rem)] overflow-hidden rounded-lg border border-[var(--color-border)] bg-white shadow-[0_4px_20px_rgba(36,66,96,0.06)]"
    >
      <div className="relative flex flex-col gap-2 border-b border-[var(--color-border)] bg-[var(--color-brand-primary)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h3 className="text-center text-sm font-bold uppercase tracking-wider text-white sm:text-left">
            {title}
          </h3>
        
          {periodLabel ? (
            <p className="mt-1 text-center text-[10px] font-semibold uppercase tracking-wider text-white/75 sm:text-left">
              {periodLabel}
            </p>
          ) : null}
        </div>
        
        <span className="text-center text-[11px] font-semibold tracking-wide text-white sm:absolute sm:left-1/2 sm:-translate-x-1/2">
          Numbers are in (000s)
        </span>
        
        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
          {isFallback ? (
            <span className="rounded-sm bg-white/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              Demo data
            </span>
          ) : null}
      
          <span className="text-[10px] font-semibold uppercase tracking-wider text-white/80">
            Sorted by {activeColumn?.label ?? sort.column} (
            {sort.direction === "asc" ? "low → high" : "high → low"})
          </span>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="px-6 py-12 text-center text-sm text-[var(--color-muted)]">
          No standings available for this period.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-[var(--color-brand-dark)] text-white">
                {columns.map((column) => {
                  const active = sort.column === column.key;
                  const align = column.align ?? "left";
                  const alignClass =
                    align === "right"
                      ? "justify-end text-right"
                      : align === "center"
                        ? "justify-center text-center"
                        : "text-left";

                  return (
                    <th
                      key={column.key}
                      className="px-4 py-3 sm:px-6"
                      aria-sort={
                        active ? (sort.direction === "asc" ? "ascending" : "descending") : "none"
                      }
                    >
                      <button
                        type="button"
                        onClick={() => handleSort(column.key)}
                        className={`group inline-flex w-full items-center gap-1 text-xs font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${alignClass}`}
                      >
                        <span>{column.label}</span>
                        <ChevronDownIcon
                          size={14}
                          className={`shrink-0 transition-transform ${active ? "opacity-100" : "opacity-40 group-hover:opacity-70"} ${active && sort.direction === "asc" ? "rotate-180" : ""}`}
                        />
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row, index) => (
                <tr
                  key={`${row.agentName ?? "row"}-${index}`}
                  className={index % 2 === 0 ? "bg-white" : "bg-[#f7faf9]"}
                >
                  {columns.map((column) => {
                    const align = column.align ?? "left";
                    const alignClass =
                      align === "right"
                        ? "text-right"
                        : align === "center"
                          ? "text-center"
                          : "text-left";

                    return (
                      <td
                        key={column.key}
                        className={`px-4 py-3.5 sm:px-6 ${alignClass} ${
                          column.key === "agentName"
                            ? "font-semibold text-[var(--color-fg)]"
                            : column.key === "net" ||
                                column.key === "agentPercentOfGoal" ||
                                column.key === "totalBonusEarned" ||
                                column.key === "bonusEarned" ||
                                column.key === "totalAnnualized"
                              ? "font-semibold text-[var(--color-brand-dark)]"
                              : "text-[var(--color-muted)]"
                        }`}
                      >
                        {row[column.key] ?? "—"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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

      {lastUpdated ? (
        <div className="border-t border-[var(--color-border)] bg-[#f7faf9] px-4 py-3 text-center text-xs text-[var(--color-muted)] sm:px-6 sm:text-right">
          Data last updated on {formatCareerLeaderboardUpdatedDate(lastUpdated)}
        </div>
      ) : null}
    </div>
  );
}
