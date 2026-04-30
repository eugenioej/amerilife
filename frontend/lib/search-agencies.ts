import { fetchGraphQL } from "@/lib/wp-client";
import {
  GET_AGENCIES_SEARCH_BATCH,
  type AgenciesSearchBatchResult,
  type AgencySearchNode,
} from "@/lib/queries";

/** Lowercase US state / territory abbrev → full name (for matching `VA` ↔ “virginia”). */
const STATE_ABBR_TO_NAME: Record<string, string> = {
  al: "alabama",
  ak: "alaska",
  az: "arizona",
  ar: "arkansas",
  ca: "california",
  co: "colorado",
  ct: "connecticut",
  de: "delaware",
  dc: "district of columbia",
  fl: "florida",
  ga: "georgia",
  hi: "hawaii",
  id: "idaho",
  il: "illinois",
  in: "indiana",
  ia: "iowa",
  ks: "kansas",
  ky: "kentucky",
  la: "louisiana",
  me: "maine",
  md: "maryland",
  ma: "massachusetts",
  mi: "michigan",
  mn: "minnesota",
  ms: "mississippi",
  mo: "missouri",
  mt: "montana",
  ne: "nebraska",
  nv: "nevada",
  nh: "new hampshire",
  nj: "new jersey",
  nm: "new mexico",
  ny: "new york",
  nc: "north carolina",
  nd: "north dakota",
  oh: "ohio",
  ok: "oklahoma",
  or: "oregon",
  pa: "pennsylvania",
  ri: "rhode island",
  sc: "south carolina",
  sd: "south dakota",
  tn: "tennessee",
  tx: "texas",
  ut: "utah",
  vt: "vermont",
  va: "virginia",
  wa: "washington",
  wv: "west virginia",
  wi: "wisconsin",
  wy: "wyoming",
};

const BATCH = 100;
const MAX_BATCHES = 80;

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function compactText(s: string): string {
  return normalizeText(s).replace(/\s+/g, "");
}

/** Wagner–Fischer distance (bounded comparisons only). */
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const row = new Array<number>(n + 1);
  for (let j = 0; j <= n; j++) row[j] = j;
  for (let i = 1; i <= m; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = row[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + cost);
      prev = tmp;
    }
  }
  return row[n];
}

function expandStateSegment(raw: string | null | undefined): string {
  const s = normalizeText(raw ?? "");
  if (!s) return "";
  const full = STATE_ABBR_TO_NAME[s];
  if (full) return `${s} ${full}`;
  const abbr = Object.entries(STATE_ABBR_TO_NAME).find(([, name]) => name === s)?.[0];
  if (abbr) return `${abbr} ${s}`;
  return s;
}

function variantsForToken(token: string): string[] {
  const t = token.toLowerCase();
  const set = new Set<string>([t]);
  const full = STATE_ABBR_TO_NAME[t];
  if (full) set.add(full);
  const abbr = Object.entries(STATE_ABBR_TO_NAME).find(([, name]) => name === t)?.[0];
  if (abbr) set.add(abbr);
  return [...set];
}

function wordMatchesToken(word: string, token: string): boolean {
  const variants = variantsForToken(token);
  for (const v of variants) {
    if (word === v) return true;
    if (v.length >= 4 && word.includes(v)) return true;
    if (word.length >= 4 && v.length >= 4 && v.includes(word)) return true;
  }
  if (token.length >= 4 && word.length >= 4) {
    if (Math.abs(word.length - token.length) > 3) return false;
    if (levenshtein(word, token) <= 2) return true;
  }
  return false;
}

function tokenMatchesHaystack(token: string, haystack: string): boolean {
  if (token.length < 2) return false;
  const words = haystack.split(/\s+/).filter(Boolean);
  return words.some((word) => wordMatchesToken(word, token));
}

function splitQueryTokens(raw: string): string[] {
  return normalizeText(raw)
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

function phraseMatchesQuery(rawQuery: string, haystack: string): boolean {
  const phrase = normalizeText(rawQuery);
  if (!phrase) return false;
  if (haystack.includes(phrase)) return true;

  // Many imported agency slugs omit spaces (`tampabay`, `eastpasco`), while users
  // naturally search for the spaced phrase (`tampa bay`, `east pasco`).
  const compactQuery = compactText(rawQuery);
  return compactQuery.length >= 4 && compactText(haystack).includes(compactQuery);
}

export function buildAgencySearchHaystack(node: AgencySearchNode): string {
  const af = node.agencyFields;
  const contentPlain = node.content ? stripHtml(node.content) : "";
  const slugWords = (node.slug ?? "").replace(/-/g, " ");
  const stateChunk = expandStateSegment(af?.addressState);
  return normalizeText(
    [
      node.title,
      slugWords,
      contentPlain,
      af?.addressLine1,
      af?.addressLine2,
      af?.addressCity,
      af?.addressZip,
      af?.phone,
      stateChunk,
    ]
      .filter(Boolean)
      .join(" "),
  );
}

function rankTokens(rawQuery: string, tokens: string[], titleNorm: string, haystack: string): number {
  let score = 0;
  if (phraseMatchesQuery(rawQuery, titleNorm)) score += 100;
  else if (phraseMatchesQuery(rawQuery, haystack)) score += 60;

  for (const token of tokens) {
    if (tokenMatchesHaystack(token, titleNorm)) score += 25;
    else if (tokenMatchesHaystack(token, haystack)) score += 10;
  }
  return score;
}

async function fetchAllAgencySearchNodes(): Promise<AgencySearchNode[]> {
  const out: AgencySearchNode[] = [];
  let after: string | null = null;
  for (let i = 0; i < MAX_BATCHES; i++) {
    const data: AgenciesSearchBatchResult = await fetchGraphQL<AgenciesSearchBatchResult>(
      GET_AGENCIES_SEARCH_BATCH,
      {
        first: BATCH,
        after,
      },
    );
    const conn = data.agencies;
    const nodes = conn?.nodes ?? [];
    out.push(...nodes);
    const hasNext = conn?.pageInfo?.hasNextPage ?? false;
    after = conn?.pageInfo?.endCursor ?? null;
    if (!hasNext || !after || nodes.length === 0) break;
  }
  return out;
}

/**
 * Match agencies by title, slug, excerpt, and address meta — not only WP full-text search
 * (meta fields are excluded there). Typo-tolerant for tokens ≥4 chars (e.g. “viriginia”).
 */
export async function searchAgenciesLocal(rawQuery: string, limit = 20): Promise<AgencySearchNode[]> {
  const tokens = splitQueryTokens(rawQuery);
  if (tokens.length === 0) return [];

  try {
    const nodes = await fetchAllAgencySearchNodes();
    const scored: { node: AgencySearchNode; score: number }[] = [];

    for (const node of nodes) {
      if (!node.slug) continue;
      const haystack = buildAgencySearchHaystack(node);
      if (!haystack) continue;
      const phraseMatch = phraseMatchesQuery(rawQuery, haystack);
      const allMatch = tokens.every((t) => tokenMatchesHaystack(t, haystack));
      if (!phraseMatch && !allMatch) continue;
      const titleNorm = normalizeText(node.title ?? "");
      scored.push({
        node,
        score: rankTokens(rawQuery, tokens, titleNorm, haystack),
      });
    }

    scored.sort((a, b) => {
      const d = b.score - a.score;
      if (d !== 0) return d;
      return (a.node.title ?? "").localeCompare(b.node.title ?? "", undefined, {
        sensitivity: "base",
      });
    });

    return scored.slice(0, limit).map((s) => s.node);
  } catch {
    return [];
  }
}
