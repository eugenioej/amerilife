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

export type LeaderboardRow = {
  affiliate: string;
  ytd: string;
  lytd: string;
  vsLytd: string;
  vsLqtd: string;
  vsLmtd: string;
  trend: string;
};

export type LeaderboardTableData = {
  rows: LeaderboardRow[];
  lastUpdated: string | null;
};

export type LeaderboardTableConfig = {
  slug: string;
  title: string;
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
];

export const LEADERBOARD_TABLE_SLUGS = LEADERBOARD_TABLE_CONFIG.flatMap((section) =>
  section.tables.map((table) => table.slug),
);

const FALLBACK_ROWS: LeaderboardRow[] = (
  (leaderboardSeed.tables?.[0]?.rows as LeaderboardSeedRow[] | undefined) ?? []
).map(mapSeedRowToDisplay);

const FALLBACK_REPORT_DATE =
  typeof leaderboardSeed.report_date === "string" ? leaderboardSeed.report_date : null;

const FALLBACK_BY_TABLE: Record<string, LeaderboardTableData> = Object.fromEntries(
  LEADERBOARD_TABLE_SLUGS.map((slug) => [
    slug,
    { rows: FALLBACK_ROWS, lastUpdated: FALLBACK_REPORT_DATE },
  ]),
);

function mapGraphqlRow(row: {
  affiliate?: string | null;
  ytdAmount?: string | null;
  lytdAmount?: string | null;
  vsLytd?: string | null;
  vsLqtd?: string | null;
  vsLmtd?: string | null;
  trend?: string | null;
}): LeaderboardRow | null {
  const affiliate = row.affiliate?.trim() ?? "";
  if (!affiliate) return null;
  return {
    affiliate,
    ytd: row.ytdAmount?.trim() || "—",
    lytd: row.lytdAmount?.trim() || "—",
    vsLytd: row.vsLytd?.trim() || "—",
    vsLqtd: row.vsLqtd?.trim() || "—",
    vsLmtd: row.vsLmtd?.trim() || "—",
    trend: formatLeaderboardTrendSymbol(row.trend?.trim() || ""),
  };
}

function mapTableNode(
  node: LeaderboardTableGraphql,
  persona: IdeaxchangePersona,
): [string, LeaderboardTableData] | null {
  if (!isItemVisibleToPersona(node, persona)) return null;
  const slug = node.slug?.trim();
  if (!slug) return null;
  const rows = (node.ideaxchangeLbTableFields?.rows ?? [])
    .map((row) => mapGraphqlRow(row))
    .filter(Boolean) as LeaderboardRow[];
  const reportDate = node.ideaxchangeLbTableFields?.reportDate?.trim() || null;
  return [
    slug,
    {
      rows: rows.length > 0 ? rows : FALLBACK_BY_TABLE[slug]?.rows ?? [],
      lastUpdated: reportDate ?? FALLBACK_BY_TABLE[slug]?.lastUpdated ?? null,
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
