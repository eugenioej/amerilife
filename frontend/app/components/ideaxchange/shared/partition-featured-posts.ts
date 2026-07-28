import type { IdeaxchangeCardItem } from "./ideaxchange-card-types";

function dedupeById<T extends IdeaxchangeCardItem>(posts: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const p of posts) {
    const id = p.id?.trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(p);
  }
  return out;
}

function takeFeatured<T extends IdeaxchangeCardItem>(pool: T[], count: number): T[] {
  const ids = new Set<string>();
  const out: T[] = [];
  const add = (p: T) => {
    const id = p.id?.trim();
    if (!id || ids.has(id) || out.length >= count) return;
    ids.add(id);
    out.push(p);
  };
  for (const p of pool) {
    if (out.length >= count) break;
    if (p.isFeatured) add(p);
  }
  for (const p of pool) {
    if (out.length >= count) break;
    add(p);
  }
  return out;
}

export function partitionFeaturedPosts<T extends IdeaxchangeCardItem>(
  posts: T[],
  featuredCount = 4,
) {
  const unique = dedupeById(posts);

  const hero = unique.slice(0, 3);
  let remaining = unique.slice(3);

  let spotlight: T | null = null;
  const spotlightIdx = remaining.findIndex((p) => p.isSpotlight);
  if (spotlightIdx >= 0) {
    spotlight = remaining[spotlightIdx]!;
    remaining = remaining.filter((_, i) => i !== spotlightIdx);
  } else if (remaining.length > 0) {
    spotlight = remaining[0]!;
    remaining = remaining.slice(1);
  }

  const featured = takeFeatured(remaining, featuredCount);
  const featuredIds = new Set(featured.map((p) => p.id).filter(Boolean) as string[]);
  remaining = remaining.filter((p) => !p.id || !featuredIds.has(p.id));

  const recentSidebar = remaining.slice(0, 4);
  const newsroomRest = remaining.slice(4);

  return { hero, spotlight, featured, recentSidebar, newsroomRest };
}
