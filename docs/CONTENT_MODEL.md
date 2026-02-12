1. Content Philosophy

This system separates content ownership clearly:
	•	System pages are frontend-owned.
	•	Marketing and editorial pages are CMS-driven.
	•	WordPress controls structured content.
	•	The frontend controls layout and rendering.

No CMS-driven content may be hardcoded in the frontend.

⸻

2. Page Ownership Classification

2.1 System Pages (Frontend-Owned)

These pages are intentionally not managed in WordPress:
	•	/ (Homepage)
	•	/landing (Landing pages)

Characteristics:
	•	Layout and content are hardcoded
	•	Use shared layout components
	•	Do not use Gutenberg blocks
	•	Do not fetch CMS data
	•	Easily migratable to CMS in future

These pages are isolated from dynamic routing.

⸻

2.2 CMS-Driven Pages (Dynamic)

All other content pages are managed via WordPress.

Examples:
	•	Marketing content pages
	•	Blog posts
	•	Newsroom
	•	Future Custom Post Types

These pages:
	•	Use Gutenberg blocks
	•	Fetch content via WPGraphQL
	•	Render through centralized BlockRenderer
	•	Must not contain hardcoded content

⸻

3. Core Content Types

3.1 Page

Represents marketing or informational pages.

Fields:
	•	Title
	•	Slug
	•	Content (Gutenberg blocks)
	•	Featured image (optional)
	•	SEO metadata (Yoast)
	•	Published status

Pages render dynamically based on slug.

⸻

3.2 Post (Blog)

Represents editorial articles.

Fields:
	•	Title
	•	Slug
	•	Publish date
	•	Author
	•	Categories
	•	Tags
	•	Content (Gutenberg blocks)
	•	Featured image
	•	SEO metadata

Posts may use a dedicated template but share block rendering logic.

⸻

3.3 Custom Post Types (Future)

Examples:
	•	Newsroom
	•	Resources
	•	Case Studies
	•	Events

CPTs must:
	•	Follow structured schema
	•	Use Gutenberg blocks or structured fields
	•	Avoid layout logic inside WordPress

⸻

4. Global Data

4.1 Navigation

Stored in WordPress Menus.

Frontend:
	•	Fetches menu structure
	•	Renders navigation
	•	Handles responsive behavior

Navigation structure is dynamic.
Design is frontend-controlled.

⸻

4.2 Header

Rendered in frontend.

May consume:
	•	Navigation
	•	Optional announcement bar (future)

Logo and icons are frontend-owned assets.

⸻

4.3 Footer

Rendered in frontend.

May include:
	•	Dynamic menu links
	•	Legal links
	•	Optional CMS-driven content

⸻

4.4 SEO Metadata

Managed in WordPress via Yoast.

Frontend must fetch:
	•	Title
	•	Meta description
	•	OpenGraph fields
	•	Canonical URL

Metadata must not be hardcoded for CMS-driven pages.

⸻

5. Gutenberg Block Strategy

Dynamic CMS pages rely on Gutenberg.

Rendering model:

Page → BlockRenderer → Individual Block Components

Rules:
	•	Blocks do not fetch data.
	•	Blocks do not contain business logic.
	•	Blocks receive normalized props.
	•	Block logic is reusable.
	•	Page templates do not contain block-specific conditionals.

⸻

6. Supported Blocks (Phase 1)

Initial supported blocks:

Core Blocks
	1.	Heading
	2.	Paragraph
	3.	Image
	4.	Button
	5.	Columns
	6.	List
	7.	Quote

Each block must have:
	•	Defined props
	•	Safe rendering logic
	•	Responsive behavior
	•	Graceful fallback handling

⸻

7. Media Handling (Current Phase)

Source of Truth

WordPress Media Library.

All images must pass through a Media adapter.

⸻

Media Interface (Mandatory)

export type Media = {
  src: string
  alt?: string
  width?: number
  height?: number
}

UI components must not consume raw WordPress image objects.

This ensures future DAM integration without refactoring UI components.

⸻

8. Routing & Slug Behavior

Dynamic routing must:
	•	Match WordPress slug
	•	Support nested paths
	•	Return 404 for missing content

Example:

/about
/services/insurance
/blog/post-title

System pages (/, /landing) must not conflict with CMS routing.

⸻

9. Content Integrity Rules

A CMS-driven page is valid when:
	•	All blocks render
	•	Media resolves
	•	SEO metadata exists
	•	No hardcoded fallback content
	•	No layout logic lives in WordPress

⸻

10. Scalability Constraints

This content model must support:
	•	300+ pages
	•	Reusable blocks
	•	Future CPTs
	•	Structured growth
	•	Controlled expansion of block types

New blocks must be:
	•	Explicitly added
	•	Documented
	•	Implemented in BlockRenderer

No implicit block rendering allowed.
