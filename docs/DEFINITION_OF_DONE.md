1. Purpose

This document defines the criteria required for a feature, page, block, or system component to be considered complete.

If a deliverable does not meet these conditions, it is not considered done.

⸻

2. Definition of Done — System Pages

System pages are frontend-owned:
	•	/
	•	/landing

These pages are intentionally hardcoded.

A system page is considered complete when:
	•	It uses shared layout components (Header, Footer).
	•	It does not duplicate layout logic.
	•	It is responsive across mobile, tablet, and desktop.
	•	It does not interfere with dynamic CMS routing.
	•	It contains no temporary placeholder content.
	•	It can be migrated to CMS later without architectural refactor.

Hardcoded content is allowed only for system pages.

⸻

3. Definition of Done — CMS-Driven Pages

A CMS-driven page is complete when all of the following are satisfied:

⸻

3.1 Data Integrity
	•	Content is fetched via WPGraphQL.
	•	No hardcoded content exists.
	•	Slug-based routing resolves correctly.
	•	Nested routes function properly.
	•	404 behavior works for missing content.

⸻

3.2 Block Rendering
	•	All Gutenberg blocks render via centralized BlockRenderer.
	•	No page-specific block conditionals exist.
	•	Blocks receive normalized props.
	•	Blocks do not fetch their own data.
	•	No unhandled block types cause runtime crashes.

⸻

3.3 Media Handling
	•	All images pass through the Media adapter.
	•	UI components accept only Media interface.
	•	Alt text is preserved.
	•	Missing images fail gracefully.
	•	No raw WordPress image objects are used in UI components.

⸻

3.4 Layout Integrity
	•	Page uses shared layout.
	•	No layout duplication.
	•	No layout logic exists in WordPress.
	•	No template logic is embedded inside block components.

⸻

3.5 Responsiveness
	•	Renders correctly on mobile, tablet, desktop.
	•	No layout overflow.
	•	No broken column behavior.
	•	Images scale correctly.

⸻

3.6 SEO Compliance
	•	Title pulled from WordPress.
	•	Meta description pulled from WordPress.
	•	OpenGraph metadata applied if available.
	•	Canonical URL correct.
	•	No hardcoded metadata for CMS-driven pages.

⸻

3.7 Error Handling
	•	GraphQL errors are handled gracefully.
	•	Network failures do not crash app.
	•	Invalid block data does not cause runtime errors.
	•	Proper fallback UI exists where needed.

⸻

3.8 Environment Safety
	•	No hardcoded API endpoints.
	•	All endpoints use environment variables.
	•	Page works in Dev, Preview, and Production environments.

⸻

4. Definition of Done — Block Level

A block is complete when:
	•	It renders correctly with normalized props.
	•	It does not call APIs.
	•	It contains no business logic.
	•	It handles optional fields safely.
	•	It is reusable.
	•	It does not assume a specific page context.
	•	It does not depend on other blocks directly.

⸻

5. Definition of Done — API Layer

The API layer is complete when:
	•	GraphQL client is centralized.
	•	Queries are reusable and consistent.
	•	No UI component performs direct fetch calls.
	•	Errors are properly handled.
	•	No duplicate query logic exists across files.

⸻

6. Definition of Done — Media Adapter

Media system is complete when:
	•	A single Media interface exists.
	•	All image data is normalized.
	•	UI components only consume Media.
	•	Replacing WordPress Media would require changing only the adapter layer.

⸻

7. Definition of Done — Deployment Readiness

A release is ready when:
	•	No console errors exist.
	•	Build passes without warnings.
	•	No TODO comments remain.
	•	No debug logs remain.
	•	Environment variables are configured.
	•	All routes resolve correctly.

⸻

8. Non-Negotiable Violations

The following invalidate completion:
	•	Hardcoded content in CMS-driven pages.
	•	Page-specific block logic.
	•	Raw WordPress image usage in UI.
	•	Hardcoded API endpoints.
	•	Layout duplication.
	•	Unhandled runtime errors.

⸻

9. Scalability Validation

Before expanding page volume:
	•	Adding a new page requires no new layout logic.
	•	Adding a new block does not require refactoring existing blocks.
	•	Routing system supports nested paths.
	•	System supports large content volume without manual configuration.

⸻

10. Final Validation Checklist

Before marking a CMS page complete:
	•	Content loads dynamically.
	•	All blocks render.
	•	Media resolves.
	•	SEO metadata applied.
	•	Responsive behavior verified.
	•	No console errors.
	•	No hardcoded content remains.
