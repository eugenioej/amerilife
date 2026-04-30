# Definition of Done

This document defines the criteria required for a feature, page, or system component to be considered complete. A deliverable that does not satisfy these criteria is not done.

---

## 1. Definition of Done — System Pages (Frontend-Owned)

System pages have hardcoded layout and content (e.g. `/`, `/about-us/who-we-are`, `/our-solutions/*`, `/find-an-agent`, all lead forms, FAQ pages, and special landing pages).

A system page is complete when:

- [ ] Uses shared layout components (`LayoutShell`, `SiteHeader`, `SiteFooter`) — no layout duplication
- [ ] Renders correctly on mobile, tablet, and desktop (no overflow, no broken columns)
- [ ] Images are uploaded to headless WordPress and URLs are in `lib/wp-image-sources.ts`
- [ ] Has a `metadata` export with accurate title and description (`staticPageMetadata()`)
- [ ] Added to `lib/sitemap-config.ts` (`STATIC_SITEMAP_PATHS`) if publicly indexable
- [ ] Added to `lib/search-index.ts` if the page should appear in site search
- [ ] Contains no temporary placeholder content
- [ ] Does not interfere with dynamic CMS routing or the catch-all route
- [ ] No console errors in browser DevTools
- [ ] Can be migrated to CMS-driven in the future without architectural changes

---

## 2. Definition of Done — CMS-Driven Pages

CMS-driven pages fetch their content from WordPress and are rendered by the catch-all route `[...slug]/page.tsx`.

### 2.1 Data Integrity

- [ ] Content is fetched via WPGraphQL (`GET_NODE_BY_URI`)
- [ ] No hardcoded content in the frontend
- [ ] Slug-based routing resolves correctly end-to-end
- [ ] 404 is returned (`notFound()`) when the WordPress page does not exist

### 2.2 Content Rendering

- [ ] Page content renders correctly from `dangerouslySetInnerHTML`
- [ ] `rewriteUploadsInHtml()` applied to page content so images resolve from headless WP
- [ ] No broken image URLs (verify with `NEXT_PUBLIC_USE_LIVE_IMAGES=0`)
- [ ] Gutenberg layout (columns, spacing, headings) renders acceptably with global CSS

### 2.3 SEO

- [ ] Title pulled from Yoast (`yoastSeoToMetadata()`)
- [ ] Meta description pulled from Yoast
- [ ] Open Graph metadata present (title, description, URL)
- [ ] Canonical URL correct (rewritten to frontend domain if `NEXT_PUBLIC_SITE_URL` set)
- [ ] No hardcoded metadata for this page

### 2.4 Layout & Responsiveness

- [ ] Uses `LayoutShell` (header + footer render)
- [ ] Renders correctly on mobile, tablet, and desktop
- [ ] No layout overflow or broken columns
- [ ] Images scale correctly

### 2.5 Error Handling

- [ ] GraphQL fetch errors are caught; page does not crash
- [ ] 404 fallback works correctly

### 2.6 Environment Safety

- [ ] No hardcoded API URLs — all use `NEXT_PUBLIC_GRAPHQL_ENDPOINT`
- [ ] Page renders correctly in development, Preview, and Production

---

## 3. Definition of Done — CPT Detail Pages

Applies to Agency, OfficeAgent, Leader, and Insight pages (all use dedicated templates, not the catch-all).

- [ ] Data fetched from the correct CPT query (e.g. `fetchAgencyBySlug()`, `GET_LEADER_BY_SLUG`)
- [ ] Template component renders all required fields
- [ ] Metadata built from CPT data (or Yoast if available) — not hardcoded
- [ ] 404 returned when CPT record does not exist
- [ ] `dynamicParams = true` set on pages that should support new slugs without a rebuild
- [ ] Responsive on all breakpoints
- [ ] No console errors

---

## 4. Definition of Done — Gravity Forms

A form integration is complete when:

- [ ] Form ID declared as a named constant in `lib/gf-client.ts`
- [ ] Server component fetches form schema with `fetchGravityForm(FORM_ID)` and passes to `<GravityForm>`
- [ ] `null` form renders gracefully (fallback UI or nothing — no crash)
- [ ] Submission succeeds end-to-end (entry appears in WP Admin → Gravity Forms → Entries)
- [ ] Confirmation message or redirect shown on success
- [ ] Field-level validation errors display correctly
- [ ] reCAPTCHA completes without error (if form has a CAPTCHA field)
- [ ] Tested in both `default` and `on-dark` visual variants (if applicable)

---

## 5. Definition of Done — New Component

- [ ] Built from `ui/` primitives where applicable (`Button`, `Link`, `FadeInOnView`)
- [ ] Uses CSS variables from `globals.css` — no hardcoded color or spacing values
- [ ] Responsive (no hardcoded pixel widths that break on mobile)
- [ ] Props are typed with TypeScript interfaces
- [ ] Optional props handled safely (no unchecked `.property` access on nullable values)
- [ ] Added to [COMPONENTS.md](COMPONENTS.md) with props table
- [ ] Does not fetch data directly — data is passed as props from the parent page/Server Component

---

## 6. Definition of Done — Deployment Release

A release is ready for production when:

- [ ] `pnpm build` succeeds with no errors or warnings
- [ ] No TypeScript errors (`tsc --noEmit`)
- [ ] `pnpm lint` passes
- [ ] `pnpm -C frontend check:pages-404` reports 0 failures
- [ ] All new images are uploaded to headless WordPress
- [ ] Environment variables configured in Atlas (see [DEPLOYMENT.md](DEPLOYMENT.md))
- [ ] At least one full-page visual check after deploy (images, nav, forms)
- [ ] No `console.error` or `console.log` debug output in production build

---

## 7. Non-Negotiable Violations

The following conditions **invalidate** a "done" claim regardless of other criteria:

- Hardcoded content in any CMS-driven page
- Raw WordPress image objects passed to UI components (use `lib/wp-media.ts` rewriting)
- Hardcoded API endpoints (must use `NEXT_PUBLIC_GRAPHQL_ENDPOINT`)
- Unhandled GraphQL errors causing runtime crashes
- Layout duplication (header or footer re-implemented outside `LayoutShell`)
- Layout or design logic embedded in WordPress content
- Missing 404 handling in dynamic routes
