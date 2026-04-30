# Content Model

This document describes the content ownership model: which content lives in WordPress vs. which is owned by the frontend.

---

## 1. Content Philosophy

Content ownership is separated clearly across the system:

- **System pages** are frontend-owned. Layout and content are defined in code.
- **CMS-driven pages** are managed in WordPress. The frontend fetches and renders them.
- **WordPress** is responsible for structured content, SEO metadata, navigation, and editorial workflow.
- **The frontend** is responsible for layout, rendering, routing, and user experience.

No CMS-managed content may be hardcoded in the frontend. No layout logic may live in WordPress.

---

## 2. Page Ownership Classification

### 2.1 System Pages (Frontend-Owned)

These pages are intentionally not managed in WordPress. Their content is defined directly in React components.

Examples:
- `/` — Homepage
- `/about-us/who-we-are`, `/about-us/our-distribution/*` — About Us sections
- `/our-solutions/*` — Solutions pages
- `/find-an-agent` — Agent search
- `/faq`, `/consumers/faq`, `/brokers/faq` — FAQ pages
- `/career/*` — Career pages
- All lead forms (`/connect`, `/contact`, `/worksite/lead`, etc.)
- Special landing pages (`/givesback`, `/join-our-team`, `/kickoff-recap-2025`, etc.)
- Legal pages (`/privacy-policy`, `/terms`, `/sms-text-messaging-terms-and-conditions`)

Characteristics:
- Layout and content are hardcoded in React components
- May fetch images or forms from WordPress (but not page content)
- Use shared `LayoutShell` or route group layouts
- Do not use Gutenberg blocks
- Can be migrated to CMS in the future without architectural changes

### 2.2 CMS-Driven Pages (WordPress)

Pages whose content is authored in WordPress and fetched via GraphQL.

Examples:
- Any page created in WP Admin and not matched by a static Next.js route
- Individual blog posts (`/blog/[category]/[slug]`)
- Insights articles (`/insights/[slug]`)

Behavior:
- Handled by the catch-all `(site)/[...slug]/page.tsx`
- Page content (`node.content`) is the raw Gutenberg-generated HTML
- Rendered via `dangerouslySetInnerHTML` with `rewriteUploadsInHtml()` applied to fix image URLs
- SEO metadata is fetched from Yoast and applied via `yoastSeoToMetadata()`

> **Note on block rendering:** The current implementation renders CMS page content as raw HTML (`dangerouslySetInnerHTML`). There is no block-by-block component mapping. Global CSS in `globals.css` styles the rendered Gutenberg HTML. If custom block rendering is needed in the future, it should be implemented as a `BlockRenderer` component that maps block types to React components.

### 2.3 Custom Post Type (CPT) Pages

Pages driven by WordPress Custom Post Types, but rendered by dedicated frontend templates — not the catch-all:

| CPT | Route | Template |
|-----|-------|----------|
| Agency | `/{agency-slug}/` | `LocationPageTemplate` |
| OfficeAgent | `/{agency-slug}/{agent-slug}/` | `AgentDetailTemplate` |
| Leader | `/about-us/our-leaders/[slug]/` | `LeaderDetailTemplate` |
| Insight | `/insights/[slug]/` | `InsightPostTemplate` |

These pages fetch structured CPT data (not raw Gutenberg HTML) and render it with purpose-built components.

### 2.4 Hybrid Pages

| Page | Description |
|------|-------------|
| Newsroom / Blog listing | Frontend-owned layout; individual posts are CMS-driven |
| Insights magazine | Frontend-owned layout; individual articles are CMS CPT |
| `/about-us/our-leaders/` | Frontend layout; leader cards fetched from WordPress Leader CPT |
| `/find-an-agent/` | Frontend layout; agency cards fetched from WordPress Agency CPT |

---

## 3. Core Content Types

### 3.1 Page (WordPress)

Standard WordPress pages. Used for marketing and editorial content not covered by CPTs.

Key fields:
- Title, slug
- Content (Gutenberg blocks, rendered as HTML)
- Featured image (optional)
- SEO metadata (Yoast: title, description, canonical, Open Graph)

### 3.2 Post (Blog)

WordPress posts. Used for the Newsroom and category blog listings.

Key fields:
- Title, slug, publish date, author
- Categories, tags
- Content (Gutenberg blocks)
- Featured image
- SEO metadata

### 3.3 Agency CPT

Career agency office locations. See [AGENCIES.md](AGENCIES.md) for full schema.

### 3.4 OfficeAgent CPT

Individual agents linked to a parent Agency. See [AGENCIES.md](AGENCIES.md) for full schema.

### 3.5 Leader CPT

Executive leadership profiles for `/about-us/our-leaders/`.

Key fields: name (title), slug, photo, bio (post content), role/title, menu order.

### 3.6 Insight CPT

Articles for the `/insights/` section. Supports categories (Insight Topics).

Key fields: title, slug, content, featured image, topic/category, publish date, SEO metadata.

---

## 4. Global CMS Data

### Navigation Menus

Stored in WordPress Menus (WP Admin → Appearance → Menus). Fetched at every render by `LayoutShell` via `getPrimaryMenu()` and `getFooterMenu()`. Falls back to hardcoded static nav if WordPress returns no menu.

### SEO Metadata

Managed via Yoast SEO plugin on WordPress. The frontend fetches `seo { title, metaDesc, canonical, opengraphTitle, opengraphDescription, opengraphImage }` for every CMS-driven page and maps it to the Next.js `Metadata` API via `yoastSeoToMetadata()`.

System pages use `staticPageMetadata()` instead, which generates metadata from hardcoded strings.

### Redirects

Managed via the Redirection plugin in WordPress. Fetched at build time via `getRedirectsFromWP()` and merged into Next.js `redirects()` in `next.config.ts`.

### Gravity Forms

Contact and lead capture forms are defined in Gravity Forms (WP Admin → Forms). See [FORMS.md](FORMS.md).

---

## 5. Routing & Slug Behavior

Dynamic routing must:
- Match the WordPress slug exactly
- Support nested paths (e.g. `/blog/category/slug/`)
- Return 404 for missing content (no silent empty pages)

The catch-all route resolves in this order: Agency CPT → OfficeAgent CPT → Static `locations-data.ts` fallback → WordPress page → 404. See [ROUTING.md](ROUTING.md) for the full diagram.

---

## 6. Content Integrity Rules

A CMS-driven page is valid when:
- Content is fetched dynamically — no hardcoded fallback content
- SEO metadata is populated in Yoast
- Slug-based routing resolves correctly
- 404 is returned for missing content
- Image URLs are rewritten correctly (`rewriteUploadsInHtml()`)
- No layout logic exists in WordPress

---

## 7. Scalability Constraints

This content model is designed to support:
- 300+ pages
- Multiple Custom Post Types (currently: Agency, OfficeAgent, Leader, Insight)
- Future CPTs (events, resources, case studies) can be added without changing routing logic
- New pages require no new layout logic — they use existing templates or the catch-all
