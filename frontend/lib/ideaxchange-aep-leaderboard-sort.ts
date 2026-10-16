import type { LeaderboardRow } from "@/lib/ideaxchange-leaderboard-data";

export type LeaderboardSortColumn =
  | "affiliate"
  | "ytd"
  | "lytd"
  | "vsLytd"
  | "vsLqtd"
  | "vsLmtd"
  | "trend";

export type LeaderboardSortDirection = "asc" | "desc";

export type LeaderboardSortState = {
  column: LeaderboardSortColumn;
  direction: LeaderboardSortDirection;
};

export const DEFAULT_LEADERBOARD_SORT: LeaderboardSortState = {
  column: "ytd",
  direction: "desc",
};

function parseCount(value: string): number {
  const n = Number.parseFloat(value.replace(/,/g, ""));
  return Number.isNaN(n) ? Number.NEGATIVE_INFINITY : n;
}

function parsePercent(value: string): number {
  const n = Number.parseFloat(value.replace("%", ""));
  return Number.isNaN(n) ? Number.NEGATIVE_INFINITY : n;
}

function parseTrend(value: string): number {
  if (value === "▲") return 1;
  if (value === "⬤") return 0;
  if (value === "▼") return -1;
  return Number.NEGATIVE_INFINITY;
}

function compareValues(a: number | string, b: number | string): number {
  if (typeof a === "string" && typeof b === "string") {
    return a.localeCompare(b, undefined, { sensitivity: "base" });
  }
  return (a as number) - (b as number);
}

function sortValue(row: LeaderboardRow, column: LeaderboardSortColumn): number | string {
  switch (column) {
    case "affiliate":
      return row.affiliate;
    case "ytd":
      return parseCount(row.ytd);
    case "lytd":
      return parseCount(row.lytd);
    case "vsLytd":
      return parsePercent(row.vsLytd);
    case "vsLqtd":
      return parsePercent(row.vsLqtd);
    case "vsLmtd":
      return parsePercent(row.vsLmtd);
    case "trend":
      return parseTrend(row.trend);
  }
}

export function sortLeaderboardRows(
  rows: LeaderboardRow[],
  sort: LeaderboardSortState,
): LeaderboardRow[] {
  const factor = sort.direction === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    const cmp = compareValues(sortValue(a, sort.column), sortValue(b, sort.column));
    if (cmp !== 0) return cmp * factor;
    return a.affiliate.localeCompare(b.affiliate, undefined, { sensitivity: "base" });
  });
}

export function nextLeaderboardSort(
  current: LeaderboardSortState,
  column: LeaderboardSortColumn,
): LeaderboardSortState {
  if (current.column === column) {
    return {
      column,
      direction: current.direction === "asc" ? "desc" : "asc",
    };
  }
  return {
    column,
    direction: column === "affiliate" ? "asc" : "desc",
  };
}

export const LEADERBOARD_SORT_LABELS: Record<LeaderboardSortColumn, string> = {
  affiliate: "Affiliate",
  ytd: "YTD",
  lytd: "LYTD",
  vsLytd: "vs LYTD",
  vsLqtd: "vs LQTD",
  vsLmtd: "vs LMTD",
  trend: "Trend",
};
