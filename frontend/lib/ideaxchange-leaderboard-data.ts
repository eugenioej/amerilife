import { fetchGraphQL } from "@/lib/wp-client";
import {
  GET_LEADERBOARD_TABLES,
  type LeaderboardTableGraphql,
  type LeaderboardTablesResult,
} from "@/lib/ideaxchange-leaderboard-queries";
import type { IdeaxchangeCardItem } from "@/app/components/ideaxchange/shared/ideaxchange-card-types";
import { IDEAXCHANGE_PLACEHOLDER_IMG } from "@/app/components/ideaxchange/shared/ideaxchange-card-types";
import { IDEAXCHANGE_LEADERBOARD_PATH } from "@/lib/ideaxchange-constants";
import {
  formatLeaderboardTrendSymbol,
  mapSeedRowToDisplay,
  type LeaderboardSeedRow,
} from "@/lib/ideaxchange-leaderboard-format";
import type { IdeaxchangePersona } from "@/lib/ideaxchange-persona";
import { isItemVisibleToPersona } from "@/lib/ideaxchange-visibility";
import leaderboardSeed from "../wp/mu-plugins/ideaxchange/seed/ideaxchange-leaderboard-seed.json";

export type LeaderboardSchema = "standard" | "eo" | "aep";

export type LeaderboardRow = {
  rank?: string;
  affiliate: string;

  ytd: string;
  lytd: string;
  vsLytd: string;
  vsLqtd: string;
  vsLmtd: string;
  trend: string;

  currentYearNewSales?: string;
  priorYearNewSales?: string;
  plan?: string;
  forecast?: string;
  newSalesVsPriorYear?: string;
  percentToPlan?: string;
  percentOfForecast?: string;
  kpiValue?: string;
};

export type LeaderboardTableData = {
  rows: LeaderboardRow[];
  lastUpdated: string | null;
  schema: LeaderboardSchema;
};

export type LeaderboardTableConfig = {
  slug: string;
  title: string;
  schema?: LeaderboardSchema;
};

export type LeaderboardSectionConfig = {
  slug: string;
  title: string;
  tables: LeaderboardTableConfig[];
};

export const LEADERBOARD_TABLE_CONFIG: LeaderboardSectionConfig[] = [
  {
    slug: "life-production",
    title: "Life Production",
    tables: [
      { slug: "life", title: "Life" },
      { slug: "life-fe", title: "Life (FE)" },
      { slug: "life-non-fe", title: "Life (Non-FE)" },
    ],
  },
  {
    slug: "submitted-production",
    title: "Submitted Production",
    tables: [
      { slug: "annuity-production", title: "Annuity Production" },
      { slug: "medicare-supplement", title: "Medicare Supplement" },
      { slug: "medicare-advantage", title: "Medicare Advantage" },
      { slug: "health-specialty", title: "Health Specialty" },
    ],
  },
  {
    slug: "eo",
    title: "E&O",
    tables: [{ slug: "oe", title: "E&O", schema: "eo" }],
  },
  {
    slug: "aep-production",
    title: "AEP Production",
    tables: [
      {
        slug: "aep-2027-production",
        title: "AEP 2027 Production",
        schema: "aep",
      },
    ],
  },
];

export const LEADERBOARD_TABLE_SLUGS = LEADERBOARD_TABLE_CONFIG.flatMap((section) =>
  section.tables.map((table) => table.slug),
);

type SeedTable = {
  table_slug?: string;
  schema?: string;
  rows?: Array<LeaderboardSeedRow | AepLeaderboardSeedRow>;
};

type AepLeaderboardSeedRow = {
  affiliate: string;
  current_year_new_sales?: string | number;
  prior_year_new_sales?: string | number;
  plan?: string | number;
  forecast?: string | number;
  new_sales_vs_prior_year?: string | number;
  percent_to_plan?: string | number;
  percent_of_forecast?: string | number;
  kpi_value?: string | number;
};

const SEED_TABLES = (leaderboardSeed.tables ?? []) as SeedTable[];

function isStandardSeedRow(
  row: LeaderboardSeedRow | AepLeaderboardSeedRow,
): row is LeaderboardSeedRow {
  return (
    "ytd" in row &&
    "lytd" in row &&
    "vs_lytd" in row &&
    "vs_lqtd" in row &&
    "vs_lmtd" in row &&
    "trend" in row
  );
}

const FALLBACK_STANDARD_ROWS: LeaderboardRow[] = (
  SEED_TABLES.find((t) => t.table_slug === "life")?.rows ??
  SEED_TABLES[0]?.rows ??
  []
)
  .filter(isStandardSeedRow)
  .map(mapSeedRowToDisplay);

const FALLBACK_EO_ROWS: LeaderboardRow[] = (
  SEED_TABLES.find((t) => t.table_slug === "oe")?.rows ?? []
)
  .filter(isStandardSeedRow)
  .map((row) => {
  const mapped = mapSeedRowToDisplay(row);
  return {
    ...mapped,
    lytd: "—",
    vsLytd: "—",
    vsLqtd: "—",
    vsLmtd: "—",
    trend: "—",
  };
});

const FALLBACK_AEP_ROWS: LeaderboardRow[] = (
  SEED_TABLES.find((table) => table.table_slug === "aep-2027-production")?.rows ?? []
).map((row) => {
  const aepRow = row as AepLeaderboardSeedRow;

  return {
    affiliate: aepRow.affiliate,

    // Required standard properties are unused by the AEP renderer.
    ytd: "—",
    lytd: "—",
    vsLytd: "—",
    vsLqtd: "—",
    vsLmtd: "—",
    trend: "—",

    currentYearNewSales: String(aepRow.current_year_new_sales ?? ""),
    priorYearNewSales: String(aepRow.prior_year_new_sales ?? ""),
    plan: String(aepRow.plan ?? ""),
    forecast: String(aepRow.forecast ?? ""),
    newSalesVsPriorYear: String(aepRow.new_sales_vs_prior_year ?? ""),
    percentToPlan: String(aepRow.percent_to_plan ?? ""),
    percentOfForecast: String(aepRow.percent_of_forecast ?? ""),
    kpiValue: String(aepRow.kpi_value ?? ""),
  };
});

const FALLBACK_REPORT_DATE =
  typeof leaderboardSeed.report_date === "string" ? leaderboardSeed.report_date : null;

const FALLBACK_BY_TABLE: Record<string, LeaderboardTableData> = Object.fromEntries(
  LEADERBOARD_TABLE_CONFIG.flatMap((section) =>
    section.tables.map((table) => {
      const schema = table.schema ?? "standard";

      let rows: LeaderboardRow[];

      if (schema === "eo") {
        rows = FALLBACK_EO_ROWS;
      } else if (schema === "aep") {
        rows = FALLBACK_AEP_ROWS;
      } else {
        rows = FALLBACK_STANDARD_ROWS;
      }

      return [
        table.slug,
        {
          rows,
          lastUpdated: FALLBACK_REPORT_DATE,
          schema,
        } satisfies LeaderboardTableData,
      ];
    }),
  ),
);

function getConfiguredTableSchema(slug: string): LeaderboardSchema {
  for (const section of LEADERBOARD_TABLE_CONFIG) {
    const table = section.tables.find((item) => item.slug === slug);

    if (table) {
      return table.schema ?? "standard";
    }
  }

  return "standard";
}

function mapGraphqlRow(row: {
  rank?: string | null;
  affiliate?: string | null;
  ytdAmount?: string | null;
  lytdAmount?: string | null;
  vsLytd?: string | null;
  vsLqtd?: string | null;
  vsLmtd?: string | null;
  trend?: string | null;

  currentYearNewSales?: string | null;
  priorYearNewSales?: string | null;
  plan?: string | null;
  forecast?: string | null;
  newSalesVsPriorYear?: string | null;
  percentToPlan?: string | null;
  percentOfForecast?: string | null;
  kpiValue?: string | null;
}): LeaderboardRow | null {
  const affiliate = row.affiliate?.trim() ?? "";
  if (!affiliate) return null;

  return {
    rank: row.rank?.trim() || undefined,
    affiliate,

    ytd: row.ytdAmount?.trim() || "—",
    lytd: row.lytdAmount?.trim() || "—",
    vsLytd: row.vsLytd?.trim() || "—",
    vsLqtd: row.vsLqtd?.trim() || "—",
    vsLmtd: row.vsLmtd?.trim() || "—",
    trend: formatLeaderboardTrendSymbol(row.trend?.trim() || ""),

    currentYearNewSales: row.currentYearNewSales?.trim() || "",
    priorYearNewSales: row.priorYearNewSales?.trim() || "",
    plan: row.plan?.trim() || "",
    forecast: row.forecast?.trim() || "",
    newSalesVsPriorYear: row.newSalesVsPriorYear?.trim() || "",
    percentToPlan: row.percentToPlan?.trim() || "",
    percentOfForecast: row.percentOfForecast?.trim() || "",
    kpiValue: row.kpiValue?.trim() || "",
  };
}


function mapTableNode(
  node: LeaderboardTableGraphql,
  persona: IdeaxchangePersona,
): [string, LeaderboardTableData] | null {
  if (!isItemVisibleToPersona(node, persona)) return null;
  const slug = node.slug?.trim();
  if (!slug) return null;
  const graphqlSchema = node.ideaxchangeLbTableFields?.schema?.trim();

  const schema: LeaderboardSchema =
    graphqlSchema === "standard" ||
    graphqlSchema === "eo" ||
    graphqlSchema === "aep"
      ? graphqlSchema
      : getConfiguredTableSchema(slug);
  const rows = (node.ideaxchangeLbTableFields?.rows ?? [])
    .map((row) => mapGraphqlRow(row))
    .filter(Boolean) as LeaderboardRow[];
  const reportDate = node.ideaxchangeLbTableFields?.reportDate?.trim() || null;
  return [
    slug,
    {
      rows: rows.length > 0 ? rows : FALLBACK_BY_TABLE[slug]?.rows ?? [],
      lastUpdated: reportDate ?? FALLBACK_BY_TABLE[slug]?.lastUpdated ?? null,
      schema,
    },
  ];
}

export async function getLeaderboardTables(
  persona: IdeaxchangePersona = "brokerage",
): Promise<Record<string, LeaderboardTableData>> {
  const fallback = { ...FALLBACK_BY_TABLE };
  try {
    const data = await fetchGraphQL<LeaderboardTablesResult>(GET_LEADERBOARD_TABLES);
    const nodes = data?.ideaxchangeLbTables?.nodes ?? [];
    if (nodes.length === 0) return fallback;

    const out = { ...fallback };
    for (const node of nodes) {
      const mapped = mapTableNode(node, persona);
      if (mapped) {
        out[mapped[0]] = mapped[1];
      }
    }
    return out;
  } catch {
    return fallback;
  }
}

const HERO_PLACEHOLDER: IdeaxchangeCardItem[] = [
  {
    id: "lb-hero-1",
    title: "Increasing Awareness to Boost Simplified-Issue Life Sales",
    date: "2025-10-01T00:00:00",
    badgeLabel: "SALES",
    href: IDEAXCHANGE_LEADERBOARD_PATH,
    featuredImage: { node: { sourceUrl: IDEAXCHANGE_PLACEHOLDER_IMG } },
  },
  {
    id: "lb-hero-2",
    title: "5 Strategies to Help Build Trust and Confidence Through Annuities",
    date: "2025-11-01T00:00:00",
    badgeLabel: "SALES",
    href: IDEAXCHANGE_LEADERBOARD_PATH,
    featuredImage: { node: { sourceUrl: IDEAXCHANGE_PLACEHOLDER_IMG } },
  },
  {
    id: "lb-hero-3",
    title: "Driving Medicare Advantage Growth Across the Network",
    date: "2025-10-01T00:00:00",
    badgeLabel: "SALES",
    href: IDEAXCHANGE_LEADERBOARD_PATH,
    featuredImage: { node: { sourceUrl: IDEAXCHANGE_PLACEHOLDER_IMG } },
  },
];

export function getLeaderboardHeroStories(): IdeaxchangeCardItem[] {
  return HERO_PLACEHOLDER;
}
