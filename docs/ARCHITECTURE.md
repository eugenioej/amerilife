1. System Overview

This project uses a Headless WordPress architecture deployed on WP Engine.

The system is composed of two primary runtime layers:

WordPress (Headless CMS)
        ↓
Next.js Frontend (Node environment)
        ↓
End Users

WordPress manages structured content and editorial workflows.

The Next.js frontend is responsible for rendering, layout, performance, and user experience.

WordPress does not render HTML to end users.

⸻

2. Architectural Principles

The system follows these principles:
	•	Separation of concerns between CMS and presentation
	•	No hardcoded marketing content in dynamic CMS-driven pages
	•	Reusable component architecture
	•	Centralized data fetching
	•	Environment-safe configuration
	•	Scalable to 300+ pages

The goal is to build a page rendering engine, not handcrafted pages.

⸻

3. Responsibility Matrix

WordPress (CMS Layer)

WordPress is responsible for:
	•	Pages (dynamic)
	•	Posts (blog)
	•	Custom Post Types (if added)
	•	Gutenberg block structure
	•	Content hierarchy
	•	SEO metadata (Yoast)
	•	Editorial workflow (Draft / Publish / Schedule)
	•	User roles and permissions

WordPress is NOT responsible for:
	•	Layout rendering
	•	Styling
	•	Performance optimization
	•	Routing logic
	•	UI behavior

⸻

Next.js Frontend (Presentation Layer)

The frontend is responsible for:
	•	Rendering all UI
	•	Layout system (Header, Footer, Templates)
	•	Block rendering
	•	Routing
	•	Performance optimization
	•	SEO metadata injection
	•	Responsive behavior
	•	Error handling

The frontend must not hardcode CMS-driven content.

⸻

4. Page Ownership Model

Pages are divided into two categories.

⸻

4.1 System Pages (Frontend-Owned)

These pages are intentionally hardcoded for now:
	•	/ (Homepage)
	•	/landing (Landing pages)

Characteristics:
	•	Layout and content are defined in frontend code
	•	They do not fetch content from WordPress
	•	They use shared layout components
	•	They are isolated from dynamic CMS routing

This decision is intentional and may be revisited later.

⸻

4.2 CMS-Driven Pages (Dynamic)

All other marketing and editorial pages are CMS-driven.

Examples:
	•	Blog posts
	•	Newsroom
	•	Marketing content pages
	•	Future CPT pages

Characteristics:
	•	Content fetched from WordPress via GraphQL
	•	Slug-based dynamic routing
	•	Block-based rendering
	•	No hardcoded content

Dynamic pages are handled via:

app/[...slug]/page.tsx

System pages must not conflict with dynamic routing.

⸻

5. Technology Stack

Frontend
	•	Framework: Next.js (App Router)
	•	Language: TypeScript
	•	Data Fetching: Server Components (preferred)
	•	Styling: (Define here: Tailwind / CSS Modules / etc.)
	•	Environment variables for all endpoints

⸻

WordPress
	•	Hosted on WP Engine
	•	Headless configuration
	•	Gutenberg enabled
	•	WPGraphQL installed
	•	Yoast SEO installed

⸻

6. API Strategy

Primary API: WPGraphQL

The frontend communicates with WordPress using GraphQL.

Reasons:
	•	Structured queries
	•	Reduced overfetching
	•	Strong schema control
	•	Clear content modeling

GraphQL endpoint must be stored in environment variables:

NEXT_PUBLIC_GRAPHQL_ENDPOINT=

No hardcoded endpoints are allowed.

⸻

7. Data Flow

For CMS-driven pages:
	1.	User requests route
	2.	Next.js resolves slug
	3.	Frontend fetches structured content from WordPress
	4.	Gutenberg blocks are mapped to React components
	5.	UI renders using shared layout

For system pages:
	1.	User requests route
	2.	Next.js renders predefined template
	3.	Shared layout components are used

⸻

8. Media Strategy (Current Phase)

For now:
	•	WordPress Media Library is the source of truth
	•	All images must pass through a Media adapter layer
	•	UI components must not consume raw WordPress image objects

Media Interface

type Media = {
  src: string
  alt?: string
  width?: number
  height?: number
}

This abstraction allows future DAM integration without refactoring UI components.

⸻

9. Block Rendering Architecture

Dynamic CMS pages use centralized block rendering:

BlockRenderer → Individual Block Components

Rules:
	•	Blocks do not fetch data
	•	Blocks do not contain business logic
	•	Blocks receive normalized props
	•	Page templates do not contain block conditionals

This enables scalability across hundreds of pages.

⸻

10. Routing Strategy

Routing must follow this structure:
	•	/ → Homepage (system page)
	•	/landing → Landing (system page)
	•	/[...slug] → CMS-driven pages

Dynamic routing must:
	•	Match WordPress slugs
	•	Support nested paths
	•	Return 404 when content is missing

No hardcoded CMS routes are allowed.

⸻

11. Environment Structure

The system must support:
	•	Development
	•	Preview
	•	Production

All configuration must be environment-based.

No hardcoded URLs, tokens, or credentials.

⸻

12. Scalability Goal

The architecture must support:
	•	300+ pages
	•	Reusable blocks
	•	Reusable templates
	•	Future Custom Post Types
	•	Future DAM integration
	•	Enterprise-level stability

The objective is to build a scalable rendering engine, not page-by-page implementations.

