# Styling

Tailwind CSS v4 with design tokens in CSS variables.

## Tailwind v4 Setup

There is **no `tailwind.config.js`**. Configuration lives in `frontend/app/globals.css`:

1. `@import "tailwindcss"` — Enables Tailwind
2. `:root` — Design tokens as CSS custom properties
3. `@theme inline { }` — Maps tokens to Tailwind utilities

```css
@import "tailwindcss";

:root {
  --color-brand-primary: #3fa590;
  /* ... */
}

@theme inline {
  --color-primary: var(--color-brand-primary);
  /* ... */
}
```

## Design Tokens

### Colors — Brand

| Token | Value | Usage |
|-------|-------|-------|
| `--color-brand-primary` | `#3fa590` | Teal, primary actions |
| `--color-brand-primary-hover` | `#008066` | Hover state |
| `--color-brand-secondary` | `#00cca3` | Accent |
| `--color-brand-dark` | `#244260` | Navy |
| `--color-topbar` | `#3FA590` | Top bar |
| `--color-footer-bg` | `rgb(36, 66, 96)` | Footer background |

### Colors — Neutrals

| Token | Value |
|-------|-------|
| `--color-bg` | `#ffffff` |
| `--color-fg` | `#2b3e50` |
| `--color-muted` | `#52606d` |
| `--color-border` | `#e8ede8` |

### Colors — Links

| Token | Value |
|-------|-------|
| `--color-link` | `#3fa590` |
| `--color-link-hover` | `#008066` |

### Gradient

| Token | Value |
|-------|-------|
| `--gradient-primary` | Linear gradient (#0e3250 → #003a74 → #009b7c → #67c084) |
| `--gradient-header` | Same as primary |

### Typography

| Token | Value |
|-------|-------|
| `--font-sans` | Open Sans (via `next/font/google`) |
| `--font-serif` | Georgia |
| `--font-mono` | ui-monospace |
| `--font-weight-regular` | 400 |
| `--font-weight-medium` | 500 |
| `--font-weight-semibold` | 600 |
| `--font-weight-bold` | 700 |
| `--tracking-tight` | 0.02em |
| `--tracking-normal` | 0.06em |
| `--tracking-wide` | 0.08em |
| `--leading-tight` | 1.25 |
| `--leading-normal` | 1.5 |
| `--leading-relaxed` | 1.75 |

### Spacing

| Token | Value |
|-------|-------|
| `--space-1` | 0.25rem |
| `--space-2` | 0.5rem |
| `--space-3` | 0.75rem |
| `--space-4` | 1rem |
| `--space-5` | 1.25rem |
| `--space-6` | 1.5rem |
| `--space-8` | 2rem |
| `--space-10` | 2.5rem |
| `--space-12` | 3rem |
| `--space-16` | 4rem |

### Layout

| Token | Value |
|-------|-------|
| `--container-max` | 1280px |
| `--container-padding-x` | 1.5rem |
| `--header-height` | 4rem |

### Radii

| Token | Value |
|-------|-------|
| `--radius-sm` | 4px |
| `--radius-md` | 8px |
| `--radius-lg` | 16px |
| `--radius-full` | 32px |

### Shadows

| Token | Value |
|-------|-------|
| `--shadow-sm` | 0 1px 2px rgba(0,0,0,0.05) |
| `--shadow-md` | 0 4px 8px rgba(0,0,0,0.15) |
| `--shadow-lg` | 0 10px 25px rgba(0,0,0,0.1) |

### Z-index

| Token | Value |
|-------|-------|
| `--z-header` | 100 |
| `--z-overlay` | 200 |
| `--z-drawer` | 300 |

## Usage in Components

Use `var(--token)` in `className`:

```tsx
className="bg-[var(--color-brand-primary)] text-white"
className="rounded-[var(--radius-full)]"
className="shadow-[var(--shadow-md)]"
className="max-w-[var(--container-max)] px-[var(--container-padding-x)]"
```

## Responsive Breakpoints

Tailwind default breakpoints:

| Prefix | Min width |
|--------|-----------|
| (none) | 0 |
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

## Typography Setup

Open Sans is loaded in `app/layout.tsx` via `next/font/google` and assigned to `--font-sans`. The body uses `font-family: var(--font-sans)`.
