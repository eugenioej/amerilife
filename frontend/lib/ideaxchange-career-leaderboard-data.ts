import {
  fetchPiperLeaderboard,
  getCurrentPiperPeriod,
  isPiperApiConfigured,
  type PiperLeaderboardResponse,
} from "@/lib/ideaxchange-piper-api";
import careerLeaderboardSeed from "../wp/mu-plugins/ideaxchange/seed/ideaxchange-career-leaderboard-seed.json";

export type CareerLeaderboardColumn = {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
};

export type CareerLeaderboardTableConfig = {
  slug: string;
  title: string;
  incentiveType: string;
  columns: CareerLeaderboardColumn[];
};

export type CareerLeaderboardSectionConfig = {
  slug: string;
  title: string;
  tables: CareerLeaderboardTableConfig[];
};

export type CareerLeaderboardCellValue = string;

export type CareerLeaderboardRow = Record<string, CareerLeaderboardCellValue>;

export type CareerLeaderboardTableData = {
  slug: string;
  title: string;
  incentiveType: string;
  columns: CareerLeaderboardColumn[];
  rows: CareerLeaderboardRow[];
  lastUpdated: string | null;
  periodLabel: string | null;
  isFallback: boolean;
  source: "piper" | "seed";
};

export const CAREER_LEADERBOARD_CONFIG: CareerLeaderboardSectionConfig[] = [
  {
    slug: "incentive-programs",
    title: "Incentive Programs",
    tables: [
      {
        slug: "kickoff",
        title: "Kickoff",
        incentiveType: "kickoff",
        columns: [
          { key: "rank", label: "Rank", align: "center" },
          { key: "agentName", label: "Agent" },
          { key: "office", label: "Office" },
          { key: "agentPercentOfGoal", label: "% of Goal", align: "right" },
          { key: "net", label: "Net", align: "right" },
        ],
      },
      {
        slug: "faststart",
        title: "FastStart",
        incentiveType: "faststart",
        columns: [
          { key: "rank", label: "Rank", align: "center" },
          { key: "agentName", label: "Agent" },
          { key: "office", label: "Office" },
          { key: "totalEligibleFyc", label: "Eligible FYC", align: "right" },
          { key: "totalBonusEarned", label: "Bonus Earned", align: "right" },
        ],
      },
      {
        slug: "bestinclass",
        title: "Best In Class",
        incentiveType: "bestinclass",
        columns: [
          { key: "rank", label: "Rank", align: "center" },
          { key: "agentName", label: "Agent" },
          { key: "office", label: "Office" },
          { key: "agentPercentOfGoal", label: "% of Goal", align: "right" },
          { key: "net", label: "Net", align: "right" },
        ],
      },
    ],
  },
  {
    slug: "production",
    title: "Production",
    tables: [
      {
        slug: "fycbylos",
        title: "FYC by LOS",
        incentiveType: "fycbylos",
        columns: [
          { key: "rank", label: "Rank", align: "center" },
          { key: "agentName", label: "Agent" },
          { key: "office", label: "Office" },
          { key: "losCategory", label: "LOS Category" },
          { key: "agentFyc", label: "Agent FYC", align: "right" },
        ],
      },
    ],
  },
];

export const CAREER_LEADERBOARD_TABLE_SLUGS = CAREER_LEADERBOARD_CONFIG.flatMap((section) =>
  section.tables.map((table) => table.slug),
);

const FIELD_ALIASES: Record<string, string[]> = {
  rank: ["rank", "Rank", "position", "Position"],
  agentName: ["agentName", "AgentName", "Agent Name", "agent name", "name", "Name"],
  office: ["office", "Office", "officeCode", "OfficeCode", "agentOffice", "AgentOffice"],
  agentPercentOfGoal: [
    "agentPercentOfGoal",
    "Agent % of Goal",
    "agent % of goal",
    "percentOfGoal",
    "PercentOfGoal",
  ],
  net: ["net", "Net", "NET"],
  totalEligibleFyc: ["totalEligibleFyc", "Total Eligible FYC", "total eligible fyc"],
  totalBonusEarned: ["totalBonusEarned", "Total Bonus Earned", "total bonus earned"],
  agentFyc: ["agentFyc", "Agent FYC", "agent fyc", "AgentFYC"],
  losCategory: ["losCategory", "LOS Category", "los category", "LOSCategory"],
};

type SeedFile = {
  updated?: string;
  tables?: Record<string, CareerLeaderboardRow[]>;
};

const SEED = careerLeaderboardSeed as SeedFile;

function normalizeKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function getCellValue(row: Record<string, unknown>, columnKey: string): string {
  const aliases = FIELD_ALIASES[columnKey] ?? [columnKey];
  for (const alias of aliases) {
    if (row[alias] != null && String(row[alias]).trim() !== "") {
      return String(row[alias]);
    }
  }

  const target = normalizeKey(columnKey);
  for (const [key, value] of Object.entries(row)) {
    if (value == null || String(value).trim() === "") continue;
    if (normalizeKey(key) === target) return String(value);
  }

  return "—";
}

function mapPiperRows(
  rawRows: Record<string, unknown>[],
  columns: CareerLeaderboardColumn[],
): CareerLeaderboardRow[] {
  return rawRows.map((raw, index) => {
    const mapped: CareerLeaderboardRow = {};
    for (const column of columns) {
      if (column.key === "rank") {
        const existing = getCellValue(raw, "rank");
        mapped.rank = existing !== "—" ? existing : String(index + 1);
        continue;
      }
      mapped[column.key] = getCellValue(raw, column.key);
    }
    return mapped;
  });
}

function formatPeriodLabel(period: string | undefined, year: number, month: number): string {
  if (period) {
    const [y, m] = period.split("-");
    if (y && m) {
      const date = new Date(Number(y), Number(m) - 1, 1);
      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      }
    }
  }
  const fallback = new Date(year, month - 1, 1);
  return fallback.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function getSeedRows(slug: string): CareerLeaderboardRow[] {
  return SEED.tables?.[slug] ?? [];
}

function buildTableFromPiper(
  table: CareerLeaderboardTableConfig,
  response: PiperLeaderboardResponse,
  year: number,
  month: number,
): CareerLeaderboardTableData {
  const rawRows = Array.isArray(response.data) ? response.data : [];
  return {
    slug: table.slug,
    title: response.metadata?.title?.trim() || table.title,
    incentiveType: table.incentiveType,
    columns: table.columns,
    rows: mapPiperRows(rawRows, table.columns),
    lastUpdated: response.updated ?? null,
    periodLabel: formatPeriodLabel(response.period, year, month),
    isFallback: response.isFallbackData === true,
    source: "piper",
  };
}

function buildTableFromSeed(table: CareerLeaderboardTableConfig): CareerLeaderboardTableData {
  const { year, month } = getCurrentPiperPeriod();
  return {
    slug: table.slug,
    title: table.title,
    incentiveType: table.incentiveType,
    columns: table.columns,
    rows: getSeedRows(table.slug),
    lastUpdated: SEED.updated ?? null,
    periodLabel: formatPeriodLabel(undefined, year, month),
    isFallback: true,
    source: "seed",
  };
}

async function fetchCareerLeaderboardTable(
  table: CareerLeaderboardTableConfig,
): Promise<CareerLeaderboardTableData> {
  const { year, month } = getCurrentPiperPeriod();

  if (!isPiperApiConfigured()) {
    return buildTableFromSeed(table);
  }

  const result = await fetchPiperLeaderboard(table.incentiveType, year, month);

  if (!result.ok || !result.data) {
    console.warn(
      `[career-leaderboard] Piper fetch failed for ${table.incentiveType}:`,
      result.error ?? result.status,
    );
    return buildTableFromSeed(table);
  }

  return buildTableFromPiper(table, result.data, year, month);
}

export type CareerLeaderboardPageData = {
  sections: CareerLeaderboardSectionConfig[];
  tables: CareerLeaderboardTableData[];
  piperConfigured: boolean;
  usingSeedFallback: boolean;
  lastUpdated: string | null;
};

export function formatCareerLeaderboardUpdatedDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}

export async function getCareerLeaderboardPageData(): Promise<CareerLeaderboardPageData> {
  const allTables = CAREER_LEADERBOARD_CONFIG.flatMap((section) => section.tables);
  const tables = await Promise.all(allTables.map((table) => fetchCareerLeaderboardTable(table)));

  const piperConfigured = isPiperApiConfigured();
  const usingSeedFallback = tables.some((table) => table.source === "seed");

  const datedTables = tables
    .map((table) => table.lastUpdated)
    .filter((value): value is string => Boolean(value));
  const lastUpdated =
    datedTables.length > 0
      ? datedTables.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]
      : null;

  return {
    sections: CAREER_LEADERBOARD_CONFIG,
    tables,
    piperConfigured,
    usingSeedFallback,
    lastUpdated,
  };
}

export function getCareerLeaderboardTablesBySlug(
  tables: CareerLeaderboardTableData[],
): Record<string, CareerLeaderboardTableData> {
  return Object.fromEntries(tables.map((table) => [table.slug, table]));
}
