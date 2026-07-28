# IdeaXchange Ad Spots Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship location-specific IdeaXchange ad spots (up to 3 creatives each, random pick) in WP Admin + GraphQL + frontend, without changing Insights ads.

**Architecture:** New MU-plugin `amerilife-ideaxchange-ads.php` loaded by `amerilife-ideaxchange.php`. Stores options, exposes `ideaxchangeAdsSettings` via WPGraphQL. Frontend fetches that field, wires each IX surface to its slot, picks one creative at random per render.

**Tech Stack:** WordPress MU-plugin PHP, WPGraphQL, Next.js App Router, existing SFTP deploy script.

## Global Constraints

- Do not modify `amerilife-insights-ads.php` or Insights frontend ad wiring
- Do not remove existing IdeaXchange CPT / visibility plugins
- Max 3 creatives per slot; random pick on each render
- Horizontal legend: 1200×280; Sidebar legend: 400×600
- Deploy: `cd frontend && node scripts/deploy-mu-plugins.mjs`

## File map

| File | Role |
|------|------|
| `frontend/wp/mu-plugins/ideaxchange/amerilife-ideaxchange-ads.php` | Create — admin + option + GraphQL |
| `frontend/wp/mu-plugins/amerilife-ideaxchange.php` | Modify — require new plugin |
| `frontend/lib/queries.ts` | Modify — IX ads types + query |
| `frontend/lib/ideaxchange-data.ts` | Modify — `getIdeaxchangeAdsSettings()` |
| `frontend/app/components/ideaxchange/shared/IdeaxchangeHorizontalAdSlot.tsx` | Modify — creatives[] + random |
| `frontend/app/components/ideaxchange/shared/IdeaxchangeSidebarAdSlot.tsx` | Modify — creatives[] + random |
| IX pages/components listed in spec | Modify — stop using Insights ads; wire slots |
| `IdeaXchangePostTemplate.tsx` + article page | Modify — add in-article + sidebar ads |

---

### Task 1: WP MU-plugin Ad Spots

**Files:**
- Create: `frontend/wp/mu-plugins/ideaxchange/amerilife-ideaxchange-ads.php`
- Modify: `frontend/wp/mu-plugins/amerilife-ideaxchange.php`

- [x] **Step 1:** Implement plugin with defaults for all 14 slots, sanitize (max 3 creatives), admin page under `edit.php?post_type=ideaxchange_article` submenu Ads, media picker JS for up to 3 rows per slot with dimension legends, GraphQL types + `ideaxchangeAdsSettings` resolve.
- [x] **Step 2:** Add `'amerilife-ideaxchange-ads.php'` to loader array.
- [x] **Step 3:** Deploy with `node scripts/deploy-mu-plugins.mjs` (user runs or agent runs if credentials present).

### Task 2: Frontend data layer

**Files:**
- Modify: `frontend/lib/queries.ts`
- Modify: `frontend/lib/ideaxchange-data.ts`

- [x] **Step 1:** Add `IdeaxchangeAdCreative`, `IdeaxchangeAdSlot`, `IdeaxchangeAdsSettings`, `GET_IDEAXCHANGE_ADS_SETTINGS`.
- [x] **Step 2:** Add `getIdeaxchangeAdsSettings()` in `ideaxchange-data.ts`.

### Task 3: Ad slot components + page wiring

**Files:**
- Modify shared ad slot components
- Modify magazine / recruiting / sales / leaderboard / carrier / category / home pages and templates
- Modify `IdeaXchangePostTemplate` + article page

- [x] **Step 1:** Update horizontal/sidebar slots to accept `IdeaxchangeAdSlot`, pick random creative with image, render via existing Insights ad visuals.
- [x] **Step 2:** Change sidebar props from full `InsightsAdsSettings` to a single `adSlot`.
- [x] **Step 3:** Wire each page to its location-specific slot; article gets in-article + sidebar.
- [x] **Step 4:** Remove `getInsightsAdsSettings` from all `/ideaxchange/*` routes.

### Task 4: Verify

- [x] Typecheck / lint touched TS files
- [x] Confirm Insights still uses `getInsightsAdsSettings`
- [x] Document deploy command for user
