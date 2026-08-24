import {
  fetchPiperLeaderboard,
  getCurrentPiperPeriod,
  getPiperLeaderboardRows,
  getPiperLeaderboardUpdatedAt,
  isPiperApiConfigured,
  type PiperLeaderboardResponse,
} from "@/lib/ideaxchange-piper-api";
import careerLeaderboardSeed from "../wp/mu-plugins/ideaxchange/seed/ideaxchange-career-leaderboard-seed.json";

export type CareerLeaderboardColumn = {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
  format?: "currency" | "percent" | "number";
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

const AGENT_COLUMNS: CareerLeaderboardColumn[] = [
  { key: "rank", label: "Rank", align: "center" },
  { key: "agentName", label: "Agent" },
  { key: "office", label: "Market" },
];

const GOAL_FYC_COLUMNS: CareerLeaderboardColumn[] = [
  ...AGENT_COLUMNS,
  { key: "agentPercentOfGoal", label: "% of Goal", align: "right" },
  { key: "agentFyc", label: "FYC", align: "right" },
];

function topGunColumns(volumeFormat: "currency" | "number"): CareerLeaderboardColumn[] {
  return [
    ...AGENT_COLUMNS,
    { key: "total", label: "Total", align: "right", format: volumeFormat },
    { key: "placed", label: "Placed", align: "right", format: volumeFormat },
    { key: "bonusPotential", label: "Bonus Potential", align: "right", format: "currency" },
    { key: "bonusEarned", label: "Bonus Earned", align: "right", format: "currency" },
  ];
}

/**
 * Event vs non-event grouping requested by Career Marketing:
 * Incentive = Kickoff, Best in Class, Top Producer, President's Club, HOF, Top Gun.
 * Production = Fast Start.
 * Piper embed does not expose separate YTD / Monthly incentive types.
 */
export const CAREER_LEADERBOARD_CONFIG: CareerLeaderboardSectionConfig[] = [
  {
    slug: "incentive-programs",
    title: "Incentive Programs",
    tables: [
      {
        slug: "kickoff",
        title: "Kickoff",
        incentiveType: "kickoff",
        columns: GOAL_FYC_COLUMNS,
      },
      {
        slug: "bestinclass",
        title: "Best In Class",
        incentiveType: "bestinclass",
        columns: GOAL_FYC_COLUMNS,
      },
      {
        slug: "topproducer",
        title: "Top Producer",
        incentiveType: "topproducer",
        columns: [
          ...AGENT_COLUMNS,
          { key: "losCategory", label: "LOS Category" },
          { key: "agentFyc", label: "FYC", align: "right" },
        ],
      },
      {
        slug: "presidentsclub",
        title: "President's Club",
        incentiveType: "presidentsclub",
        columns: [
          ...AGENT_COLUMNS,
          { key: "totalAnnualized", label: "Annualized", align: "right" },
          { key: "qualificationStatus", label: "Status" },
          { key: "agentPercentOfGoal", label: "% of Goal", align: "right" },
        ],
      },
      {
        slug: "halloffame",
        title: "Hall of Fame",
        incentiveType: "halloffame",
        columns: [
          ...AGENT_COLUMNS,
          { key: "agentFyc", label: "Total FYC", align: "right" },
          { key: "agentPercentOfGoal", label: "% of Goal", align: "right" },
        ],
      },
      {
        slug: "topgunlife",
        title: "Top Gun Life",
        incentiveType: "topgunlife",
        columns: topGunColumns("number"),
      },
      {
        slug: "topgunannuity",
        title: "Top Gun Annuity",
        incentiveType: "topgunannuity",
        columns: topGunColumns("currency"),
      },
      {
        slug: "topgunmedsup",
        title: "Top Gun MedSup",
        incentiveType: "topgunmedsup",
        columns: topGunColumns("number"),
      },
      {
        slug: "topgunspecialty",
        title: "Top Gun Specialty",
        incentiveType: "topgunspecialty",
        columns: topGunColumns("number"),
      },
    ],
  },
  {
    slug: "production",
    title: "Production",
    tables: [
      {
        slug: "faststart",
        title: "Fast Start",
        incentiveType: "faststart",
        columns: [
          ...AGENT_COLUMNS,
          { key: "totalEligibleFyc", label: "Eligible FYC", align: "right" },
          { key: "totalBonusEarned", label: "Bonus Earned", align: "right" },
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
  office: [
    "market",
    "Market",
    "office",
    "Office",
    "fieldOffice",
    "officeCode",
    "OfficeCode",
    "agentOffice",
    "AgentOffice",
  ],
  agentPercentOfGoal: [
    "percentOfGoal",
    "PercentOfGoal",
    "agentPercentOfGoal",
    "Agent % of Goal",
    "agent % of goal",
  ],
  totalEligibleFyc: [
    "totalEligibleFYC",
    "totalEligibleFyc",
    "Total Eligible FYC",
    "total eligible fyc",
  ],
  totalBonusEarned: [
    "totalBonusEarned",
    "Total Bonus Earned",
    "total bonus earned",
  ],
  agentFyc: ["agentFYC", "agentFyc", "Agent FYC", "agent fyc", "AgentFYC", "total", "net", "Net"],
  losCategory: [
    "lOSCategory",
    "losCategory",
    "LOS Category",
    "los category",
    "LOSCategory",
  ],
  qualificationStatus: [
    "agentQualificationStatus",
    "qualificationStatus",
    "status",
    "Status",
  ],
  totalAnnualized: ["totalAnnualized", "annualized", "Annualized"],
  total: [
    "lifeTotal",
    "annuityTotal",
    "medSupTotal",
    "specialtyTotal",
    "total",
  ],
  placed: ["lifePlaced", "annuityPlaced", "medSupPlaced", "specialtyPlaced"],
  bonusPotential: [
    "lifeBonusPotential",
    "annuityBonusPotential",
    "medSupBonusPotential",
    "specialtyBonusPotential",
  ],
  bonusEarned: [
    "lifeBonusEarned",
    "annuityBonusEarned",
    "medSupBonusEarned",
    "specialtyBonusEarned",
    "totalBonusEarned",
  ],
};

const CURRENCY_COLUMNS = new Set([
  "agentFyc",
  "totalEligibleFyc",
  "totalBonusEarned",
  "totalAnnualized",
  "bonusPotential",
  "bonusEarned",
  "net",
]);
const PERCENT_COLUMNS = new Set(["agentPercentOfGoal"]);

type SeedFile = {
  updated?: string;
  tables?: Record<string, CareerLeaderboardRow[]>;
};

const SEED = careerLeaderboardSeed as SeedFile;

function normalizeKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function formatCurrencyCell(value: unknown): string {
  if (value == null || String(value).trim() === "") return "—";
  const raw = String(value).replace(/[$,\s]/g, "");
  const amount = Number(raw);
  if (Number.isNaN(amount)) return String(value);
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function formatPercentCell(value: unknown): string {
  if (value == null || String(value).trim() === "") return "—";
  const raw = String(value).replace(/%/g, "").trim();
  const amount = Number(raw);
  if (Number.isNaN(amount)) return String(value);
  const rounded = Number.isInteger(amount) ? amount.toFixed(0) : amount.toFixed(1);
  return `${rounded}%`;
}

function formatNumberCell(value: unknown): string {
  if (value == null || String(value).trim() === "") return "—";
  const amount = Number(String(value).replace(/[$,\s]/g, ""));
  if (Number.isNaN(amount)) return String(value);
  return amount.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

function getCellValue(
  row: Record<string, unknown>,
  column: CareerLeaderboardColumn | string,
): string {
  const resolved: CareerLeaderboardColumn =
    typeof column === "string" ? { key: column, label: column } : column;
  const aliases = FIELD_ALIASES[resolved.key] ?? [resolved.key];
  for (const alias of aliases) {
    if (row[alias] != null && String(row[alias]).trim() !== "") {
      return formatCellValue(resolved, row[alias]);
    }
  }

  const target = normalizeKey(resolved.key);
  for (const [key, value] of Object.entries(row)) {
    if (value == null || String(value).trim() === "") continue;
    if (normalizeKey(key) === target) return formatCellValue(resolved, value);
  }

  return "—";
}

function formatCellValue(column: CareerLeaderboardColumn, value: unknown): string {
  const format =
    column.format ??
    (CURRENCY_COLUMNS.has(column.key) ? "currency" : undefined) ??
    (PERCENT_COLUMNS.has(column.key) ? "percent" : undefined);
  if (format === "currency") return formatCurrencyCell(value);
  if (format === "percent") return formatPercentCell(value);
  if (format === "number") return formatNumberCell(value);
  return String(value);
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
      mapped[column.key] = getCellValue(raw, column);
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
  const rawRows = getPiperLeaderboardRows(response);
  return {
    slug: table.slug,
    title: response.metadata?.title?.trim() || table.title,
    incentiveType: table.incentiveType,
    columns: table.columns,
    rows: mapPiperRows(rawRows, table.columns),
    lastUpdated: getPiperLeaderboardUpdatedAt(response),
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

type CareerLeaderboardTableFetch = {
  table: CareerLeaderboardTableData;
  piperError?: string;
  piperStatus?: number;
};

async function fetchCareerLeaderboardTable(
  table: CareerLeaderboardTableConfig,
): Promise<CareerLeaderboardTableFetch> {
  const { year, month } = getCurrentPiperPeriod();

  if (!isPiperApiConfigured()) {
    return {
      table: buildTableFromSeed(table),
      piperError: "PIPER_API_KEY is not configured",
      piperStatus: 0,
    };
  }

  const result = await fetchPiperLeaderboard(table.incentiveType, year, month);

  if (!result.ok || !result.data) {
    console.warn(
      `[career-leaderboard] Piper fetch failed for ${table.incentiveType}:`,
      result.error ?? result.status,
    );
    return {
      table: buildTableFromSeed(table),
      piperError: result.error ?? `HTTP ${result.status}`,
      piperStatus: result.status,
    };
  }

  const mapped = buildTableFromPiper(table, result.data, year, month);
  // Empty live payload still counts as connected — keep it so we don't hide a real empty period.
  return { table: mapped };
}

export type CareerLeaderboardPageData = {
  sections: CareerLeaderboardSectionConfig[];
  tables: CareerLeaderboardTableData[];
  piperConfigured: boolean;
  usingSeedFallback: boolean;
  piperError: string | null;
  piperStatus: number | null;
};

export { formatLeaderboardUpdatedDate as formatCareerLeaderboardUpdatedDate } from "@/lib/ideaxchange-leaderboard-format";

export async function getCareerLeaderboardPageData(): Promise<CareerLeaderboardPageData> {
  const allTables = CAREER_LEADERBOARD_CONFIG.flatMap((section) => section.tables);
  const results = await Promise.all(allTables.map((table) => fetchCareerLeaderboardTable(table)));
  const tables = results.map((result) => result.table);

  const piperConfigured = isPiperApiConfigured();
  const usingSeedFallback = tables.some((table) => table.source === "seed");
  const firstError = results.find((result) => result.piperError);

  return {
    sections: CAREER_LEADERBOARD_CONFIG,
    tables,
    piperConfigured,
    usingSeedFallback,
    piperError: firstError?.piperError ?? null,
    piperStatus: firstError?.piperStatus ?? null,
  };
}

export function getCareerLeaderboardTablesBySlug(
  tables: CareerLeaderboardTableData[],
): Record<string, CareerLeaderboardTableData> {
  return Object.fromEntries(tables.map((table) => [table.slug, table]));
}
