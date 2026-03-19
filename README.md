# AmeriLife

Headless WordPress + Next.js marketing site for AmeriLife, deployed on WP Engine Atlas.

## Architecture

```mermaid
flowchart TB
    subgraph CMS [WordPress Headless CMS]
        WP[WordPress on WP Engine]
        GQL[WPGraphQL API]
        WP --> GQL
    end

    subgraph Frontend [Next.js Frontend]
        Next[Next.js 16 on Atlas]
        Next --> Render[Server Components]
        Next --> Static[Static Pages]
    end

    subgraph Users [End Users]
        Browser[Browser]
    end

    GQL -->|GraphQL queries| Next
    Render --> Browser
    Static --> Browser
```

- **WordPress** manages content, SEO metadata, navigation, and redirects.
- **Next.js** handles all rendering, layout, and user experience.
- WordPress does not render HTML to end users.

## Quick Start

```bash
# Install dependencies (uses pnpm)
pnpm install

# Copy environment variables
cp frontend/.env.example frontend/.env.local

# Edit frontend/.env.local: set NEXT_PUBLIC_GRAPHQL_ENDPOINT
# Default: https://headlessameril.wpenginepowered.com/graphql

# Run development server (port 3000)
pnpm dev
```

## Project Structure

```
amerilife/
├── frontend/                 # Main Next.js application (all active development)
│   ├── app/                  # App Router: pages, layouts, route groups
│   ├── app/components/       # React components by feature
│   ├── lib/                  # Utilities: WP client, queries, media, SEO
│   ├── scripts/              # Image sync, migration, verification
│   └── wp/mu-plugins/        # WordPress must-use plugins
├── docs/                     # Project documentation
├── app/                      # Legacy scaffold (largely empty)
├── components/              # Legacy scaffold
└── lib/                      # Legacy scaffold
```

All active development happens in `frontend/`.

## Documentation

| Document | Description |
|----------|-------------|
| [docs/STACK.md](docs/STACK.md) | Tech stack: Next.js, React, Tailwind v4, WPGraphQL, versions |
| [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) | Local setup, env vars, scripts, workflow |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System overview, data flow, responsibility matrix |
| [docs/ROUTING.md](docs/ROUTING.md) | Route map, catch-all logic, page types |
| [docs/COMPONENTS.md](docs/COMPONENTS.md) | Component library reference |
| [docs/STYLING.md](docs/STYLING.md) | Tailwind v4, design tokens, CSS variables |
| [docs/WORDPRESS.md](docs/WORDPRESS.md) | WordPress integration, GraphQL, media sync |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | WP Engine Atlas deployment |

## Key Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start dev server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm start` | Run production server |
| `pnpm lint` | Run ESLint |
| `pnpm -C frontend sync:wp-images` | Sync images to headless WP (requires SFTP env vars) |

## Requirements

- Node.js >= 20
- pnpm (package manager)
