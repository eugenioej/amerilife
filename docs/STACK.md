# Tech Stack

Complete reference of technologies used in the AmeriLife project.

## Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.1.6 | App framework. App Router, Server Components, Turbopack in dev, catch-all routing for WordPress pages |
| **React** | 19.2.3 | UI library |
| **React DOM** | 19.2.3 | React rendering |
| **TypeScript** | ^5 | Type checking, strict mode, `@/*` path alias |

## Styling

| Technology | Version | Purpose |
|------------|---------|---------|
| **Tailwind CSS** | ^4 | Utility-first CSS. Config-file-free: uses `@import "tailwindcss"` and `@theme inline {}` in `globals.css` |
| **@tailwindcss/postcss** | ^4 | PostCSS integration for Tailwind v4 |

## Icons & Animation

| Technology | Version | Purpose |
|------------|---------|---------|
| **lucide-react** | ^0.574.0 | SVG icon set used across components |
| **framer-motion** | ^12.34.0 | Animations (workspace-level, root package.json) |
| **clsx** | ^2.1.1 | Conditional class names (workspace-level) |

## WordPress Integration

| Technology | Purpose |
|------------|---------|
| **WPGraphQL** | GraphQL API layer on headless WordPress |
| **Yoast SEO** | SEO metadata (title, description, canonical, Open Graph, Twitter) |
| **WPGraphQL Yoast SEO Addon** | Exposes Yoast fields in GraphQL |
| **Redirection plugin** | 301/302 redirect management |
| **WPGraphQL Redirection Addon** | Query redirects via GraphQL at build time |

## Build & Tooling

| Technology | Version | Purpose |
|------------|---------|---------|
| **ESLint** | ^9 | Linting |
| **eslint-config-next** | 16.1.6 | Next.js ESLint rules |
| **@types/node** | ^20 | Node.js type definitions |
| **@types/react** | ^19 | React type definitions |
| **@types/react-dom** | ^19 | React DOM type definitions |

## Scripts & Utilities

| Technology | Version | Purpose |
|------------|---------|---------|
| **ssh2-sftp-client** | ^12.0.1 | SFTP upload for image sync script (`sync-wp-images.mjs`) |

## Hosting

| Technology | Purpose |
|------------|---------|
| **WP Engine Atlas** | Hosts both headless WordPress and Next.js. Deploy on push to `main` or manual redeploy |

## Package Manager

- **pnpm** 9.12.3 — Used exclusively (per project conventions)

## Path Alias

- `@/*` → `./` (frontend root) — Used for imports like `@/lib/wp-client`, `@/app/components/ui/Button`
