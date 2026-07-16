import type { IdeaxchangePersona } from "@/lib/ideaxchange-persona";
import { getIdeaxchangeNavItemsForPersona } from "@/lib/ideaxchange-pillar-visibility";

export type IdeaxchangePageSearchEntry = {
  path: string;
  title: string;
  description: string;
  keywords: string[];
};

export type IdeaxchangePageSearchResult = IdeaxchangePageSearchEntry & {
  score: number;
};

const PAGE_DESCRIPTIONS: Record<string, { description: string; keywords: string[] }> = {
  "/ideaxchange/home/": {
    description: "Your personalized ideaXchange feed — articles and updates across AmeriLife pillars.",
    keywords: ["home", "feed", "articles", "magazine", "newsroom"],
  },
  "/ideaxchange/recruiting-hub/": {
    description: "Recruiting campaigns, case studies, and company profiles on ideaXchange.",
    keywords: ["recruiting", "campaigns", "case studies", "companies", "hire"],
  },
  "/ideaxchange/leaderboard/": {
    description: "Sales leaderboards and performance standings for Brokerage teams.",
    keywords: ["sales", "leaderboard", "rankings", "brokerage", "performance"],
  },
  "/ideaxchange/career-leaderboard/": {
    description: "Career leaderboards and performance standings for Career teams.",
    keywords: ["career", "leaderboard", "rankings", "performance"],
  },
  "/ideaxchange/carrier-spotlight/": {
    description: "Carrier and career partner profiles, resources, and spotlight articles.",
    keywords: ["carrier", "spotlight", "partners", "resources"],
  },
  "/ideaxchange/sales-success/": {
    description: "Sales Success initiatives, stories, and resources on ideaXchange.",
    keywords: ["sales success", "initiative", "stories", "growth"],
  },
};

/**
 * Search persona-visible ideaXchange pillar pages (nav-driven).
 */
export function searchIdeaxchangePages(
  query: string,
  persona: IdeaxchangePersona,
): IdeaxchangePageSearchResult[] {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 1);
  if (terms.length === 0) return [];

  const scored: IdeaxchangePageSearchResult[] = [];

  for (const item of getIdeaxchangeNavItemsForPersona(persona)) {
    const meta = PAGE_DESCRIPTIONS[item.href] ?? {
      description: `${item.label} on AmeriLife ideaXchange.`,
      keywords: [item.label.toLowerCase()],
    };
    const entry: IdeaxchangePageSearchEntry = {
      path: item.href,
      title: item.label,
      description: meta.description,
      keywords: meta.keywords,
    };

    let score = 0;
    let matchedAll = true;
    for (const term of terms) {
      let termScore = 0;
      if (entry.title.toLowerCase().includes(term)) termScore += 10;
      if (entry.keywords.some((k) => k.toLowerCase().includes(term))) termScore += 5;
      if (entry.description.toLowerCase().includes(term)) termScore += 2;
      if (entry.path.toLowerCase().includes(term)) termScore += 3;
      if (termScore === 0) matchedAll = false;
      score += termScore;
    }
    if (score === 0) continue;
    if (matchedAll) score *= 1.5;
    scored.push({ ...entry, score });
  }

  return scored.sort((a, b) => b.score - a.score);
}
