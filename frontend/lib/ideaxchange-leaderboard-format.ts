export type LeaderboardTrend = "up" | "down" | "flat";

export type LeaderboardSeedRow = {
  affiliate: string;
  ytd: number;
  lytd: number;
  vs_lytd: number;
  vs_lqtd: number;
  vs_lmtd: number;
  trend: LeaderboardTrend;
};

export function formatLeaderboardCount(value: number): string {
  return value.toLocaleString("en-US");
}

/** Matches source export: `22.10%`, `-25.20%`, `0.00%` (no + prefix). */
export function formatLeaderboardPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function formatLeaderboardTrendSymbol(trend: string): string {
  const t = trend.trim().toLowerCase();
  if (t === "up" || t === "▲" || t === "▴" || t === "↑" || t === "⬆") return "▲";
  if (t === "down" || t === "▼" || t === "▾" || t === "↓" || t === "⬇") return "▼";
  if (t === "flat" || t === "⬤" || t === "●") return "⬤";
  return "—";
}

/** Formats ISO timestamps or YYYY-MM-DD report dates as MM/DD/YYYY. */
export function formatLeaderboardUpdatedDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const trimmed = iso.trim();
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (dateOnly) {
    const [, year, month, day] = dateOnly;
    return `${month}/${day}/${year}`;
  }
  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}

export function mapSeedRowToDisplay(row: LeaderboardSeedRow) {
  return {
    affiliate: row.affiliate,
    ytd: formatLeaderboardCount(row.ytd),
    lytd: formatLeaderboardCount(row.lytd),
    vsLytd: formatLeaderboardPercent(row.vs_lytd),
    vsLqtd: formatLeaderboardPercent(row.vs_lqtd),
    vsLmtd: formatLeaderboardPercent(row.vs_lmtd),
    trend: formatLeaderboardTrendSymbol(row.trend),
  };
}
