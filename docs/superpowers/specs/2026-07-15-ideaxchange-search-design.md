# IdeaXchange Search — Design

**Date:** 2026-07-15  
**Status:** Approved (Approach A)

## Summary

Gated IdeaXchange search mirroring main-site UX: header magnifying glass → modal → `/ideaxchange/search?q=…`. Results cover the full IX surface and are filtered by persona visibility.

## Scope

| Type | Source | Badge | Href |
|------|--------|-------|------|
| Pillar pages | Static index from persona nav | Page | pillar path |
| Articles | `ideaxchange_article` batch + local haystack | Article | `/ideaxchange/article/[slug]/` |
| Case studies | CPT batch + haystack | Campaign | `/ideaxchange/recruiting-hub/[slug]/` |
| Companies | CPT batch (+ mock/case-study fallback) | Company | `/ideaxchange/recruiting-hub/company/[slug]/` |
| Carriers | CPT batch + haystack | Carrier | `/ideaxchange/carrier-spotlight/[slug]/` |

Career Spotlight pillar page is excluded from the static index while `IDEAXCHANGE_CARRIER_SPOTLIGHT_NAV_ENABLED` is false; carrier CPT results still searchable for personas that can see them.

## Behavior

- Auth: `requireIdeaxchangeAuth` on `/ideaxchange/search`
- Persona: `filterItemsByPersonaVisibility` on CPT nodes; pillars via `getIdeaxchangeNavItemsForPersona`
- Ranking: local Insights-style phrase/token scoring; limit 20 per type
- Order: Pages → Articles → Campaigns → Companies → Carriers
- Header: reuse `HeaderSearch` with `resultsPath="/ideaxchange/search"`

## Out of scope

- Autocomplete / live results
- Cross-type global ranking
- Searching public Insights / main-site pages from IX
