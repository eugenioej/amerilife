# IdeaXchange Ad Spots — Design

**Date:** 2026-07-15  
**Status:** Approved (Approach 1)  
**Scope:** Full stack — WP MU-plugin + GraphQL + frontend wiring + deploy via existing SFTP script

## Summary

Add IdeaXchange-specific advertisement slots managed in WordPress Admin, independent of Insights ads. Each location has its own slot; each slot supports up to three creatives (image + click URL + alt). On each page render, the frontend picks one creative at random. Content teams see recommended dimensions as a legend in the admin UI.

Existing IdeaXchange CPTs, visibility, and Insights ads remain unchanged.

## Decisions

| Topic | Choice |
|-------|--------|
| Organization | Location-specific slots (not shared global IX slots) |
| Creatives per slot | Up to 3 (image + URL + alt each) |
| Rotation | Random on each page load (server/render pick) |
| Dimensions | Horizontal 1200×280; Sidebar 400×600 |
| Delivery | Approach 1 — new MU-plugin mirroring Insights Ads pattern |
| Insights ads | Untouched; IX stops consuming `insightsAdsSettings` |

## Non-goals

- Carousel / timed rotation JS
- Per-persona ad targeting
- Ad frequency capping / analytics dashboard
- Changing Insights Ads plugin or public Insights placements
- CPT-based ad spots

## Plugin architecture

### New file

`frontend/wp/mu-plugins/ideaxchange/amerilife-ideaxchange-ads.php`

### Loader

Add to `$ideaxchange_mu_plugins` in `frontend/wp/mu-plugins/amerilife-ideaxchange.php`:

```php
'amerilife-ideaxchange-ads.php',
```

### Admin

- Submenu under ideaXchange magazine CPT menu: **Ads**
- Capability: `manage_options` (same as Insights Ads)
- Group slots visually by section (Home, Category, Recruiting, Sales Success, Leaderboard, Carrier, Article)
- Per slot: recommended dimensions legend; up to 3 creative rows (media picker, click URL, alt, clear)
- Save via `admin-post` + nonce → `update_option('amerilife_ideaxchange_ads', …)`

### Data model

Option key: `amerilife_ideaxchange_ads`

```
slot_key => [
  'creatives' => [
    [ 'attachment_id' => int, 'target_url' => string, 'alt' => string ], // 0–3 entries
  ],
]
```

Sanitize: absint attachment IDs, `esc_url_raw` URLs, `sanitize_text_field` alt; truncate creatives to 3; drop empty trailing rows without image.

### GraphQL

Root field: `ideaxchangeAdsSettings`

Types (illustrative):

- `IdeaxchangeAdCreative` — `imageUrl`, `targetUrl`, `altText`
- `IdeaxchangeAdSlot` — `creatives: [IdeaxchangeAdCreative]`
- `IdeaxchangeAdsSettings` — one field per slot key (camelCase)

Resolver returns only creatives with a resolvable image URL.

## Slot inventory

| Option / GraphQL key | Placement | Dimensions legend |
|----------------------|-----------|-------------------|
| `home_primary_horizontal` / `homePrimaryHorizontal` | Home / Magazine — below featured | 1200 × 280 px |
| `home_secondary_horizontal` / `homeSecondaryHorizontal` | Home / Magazine — main column | 1200 × 280 px |
| `home_sidebar_vertical` / `homeSidebarVertical` | Home / Magazine — sidebar | 400 × 600 px |
| `category_primary_horizontal` / `homePrimaryHorizontal` | Magazine category pages | 1200 × 280 px |
| `recruiting_primary_horizontal` / `homePrimaryHorizontal` | Recruiting Hub — primary | 1200 × 280 px |
| `recruiting_secondary_horizontal` / `homeSecondaryHorizontal` | Recruiting Hub — secondary | 1200 × 280 px |
| `recruiting_sidebar_vertical` / `homeSidebarVertical` | Recruiting Hub — sidebar | 400 × 600 px |
| `sales_success_primary_horizontal` / `homePrimaryHorizontal` | Sales Success — primary | 1200 × 280 px |
| `sales_success_sidebar_vertical` / `homeSidebarVertical` | Sales Success — sidebar | 400 × 600 px |
| `leaderboard_secondary_horizontal` / `homeSecondaryHorizontal` | Sales Leaderboard — secondary | 1200 × 280 px |
| `leaderboard_sidebar_vertical` / `homeSidebarVertical` | Sales Leaderboard — sidebar | 400 × 600 px |
| `carrier_sidebar_vertical` / `homeSidebarVertical` | Carrier Spotlight detail — sidebar | 400 × 600 px |
| `article_in_article` / `articleInArticle` | Article mid-content (new) | 1200 × 280 px |
| `article_sidebar_vertical` / `homeSidebarVertical` | Article sidebar (new) | 400 × 600 px |

Horizontal minimum guidance in admin copy: 960 × 200. Sidebar minimum: 300 × 450.

## Frontend

### Data layer

- Add `getIdeaxchangeAdsSettings()` (new query; mirror Insights pattern in `lib/insights-data.ts` / `lib/queries.ts`)
- Replace `getInsightsAdsSettings()` usage under `/ideaxchange/*` routes and IX components

### Components

- Extend `IdeaxchangeHorizontalAdSlot` / `IdeaxchangeSidebarAdSlot` (or thin wrappers) to accept a slot with `creatives[]`
- Pick one creative at random when `creatives.length > 0`
- Reuse existing Insights visual renderers (`AdBannerHorizontal` / `AdSidebarVertical`) for a single resolved creative, or equivalent IX helpers
- Empty slot → keep current gray “Ad space” placeholder (`showPlaceholder` behavior unchanged)

### Page wiring

| Surface | Slots |
|---------|-------|
| Home (`IdeaXchangeMagazinePage`) | home primary, secondary, sidebar |
| Category | category primary |
| Recruiting Hub | recruiting primary, secondary, sidebar |
| Sales Success | sales success primary + sidebar |
| Sales Leaderboard | leaderboard secondary + sidebar |
| Carrier Spotlight detail | carrier sidebar |
| Article template | article in-article + article sidebar (add placements) |

## Deploy

Existing script already uploads the whole `ideaxchange/` MU folder:

```bash
cd frontend && node scripts/deploy-mu-plugins.mjs
```

Requires `HEADLESS_SFTP_USER` and `HEADLESS_SFTP_PASSWORD` in `.env.local`.

After deploy, verify WP Admin → ideaXchange → Ads and GraphQL field `ideaxchangeAdsSettings`.

## Compatibility / risk

- Production content teams continue using existing CPTs; ads feature is additive
- Insights and IX ads become independent (expected; currently they incorrectly share Insights creatives)
- Until creatives are uploaded for a slot, placeholders remain visible (same as today when Insights slot empty)

## Spec self-review

- [x] No placeholder TODOs left in decisions
- [x] Slot list matches approved inventory (all IX locations + article)
- [x] Insights ads explicitly out of scope for modification
- [x] Deploy path uses existing SFTP script (no new secret scheme)
- [x] Frontend scope includes random pick + page wiring
