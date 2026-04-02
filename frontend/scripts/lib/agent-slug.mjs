/**
 * Agent URL slug: `slugify(agencySlug + '-' + name)` per person.
 * Only adds a numeric suffix (`-2`, `-3`, …) when the same office has two+ people with the
 * same display name (rare). Different names → different slugs, no `-1` / `-2` by position.
 *
 * @param {(s: string) => string} slugify
 * @param {{ name?: string }[]} agents — same array as in JSON; uses `name` at each index
 */
export function buildAgentSlug(slugify, pageSlug, agents, index) {
  const name = String(agents[index]?.name ?? "").trim();
  const base = slugify(`${pageSlug}-${name}`);
  let dupBefore = 0;
  for (let i = 0; i < index; i++) {
    const prev = String(agents[i]?.name ?? "").trim();
    if (slugify(`${pageSlug}-${prev}`) === base) dupBefore++;
  }
  if (dupBefore === 0) return base;
  return `${base}-${dupBefore + 1}`;
}
