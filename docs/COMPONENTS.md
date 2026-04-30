# Component Library

All components live under `frontend/app/components/`, organized by feature domain.

---

## layout/

Chrome, navigation, and global overlays. Used by `LayoutShell` and the route group layouts.

| Component | Purpose |
|-----------|---------|
| `LayoutShell` | Async Server Component. Fetches WP nav menus, composes TopBar + SiteHeader + `<main>` + SiteFooter |
| `SiteHeader` | Sticky header with 3-level dropdown nav, mobile hamburger, search button, and "Contact" popup trigger |
| `SiteFooter` | Footer with WP-driven nav links and legal links |
| `TopBar` | Thin teal bar above the header |
| `MobileNav` | Mobile slide-out drawer with full nav tree |
| `HeaderSearch` | Search icon toggle with inline search input |
| `ContactFormDialog` | Modal dialog wrapping the header contact Gravity Form |
| `ContactPopupProvider` | Context provider that manages open/close state for `ContactFormDialog` |
| `SiteBreadcrumb` | Breadcrumb nav rendered on detail pages (leaders, agents) |

### LayoutShell Props

| Prop | Type | Description |
|------|------|-------------|
| `children` | `React.ReactNode` | Page content rendered between header and footer |

---

## ui/

Design system primitives. Always use these when building new components rather than writing raw HTML elements.

| Component | Purpose |
|-----------|---------|
| `Button` | Primary, secondary, and ghost variants. Pill-shaped. Accepts all standard `button` attributes |
| `Link` | Wraps `next/link` with consistent variant styles (default, nav, button) |
| `FadeInOnView` | Intersection Observer scroll-reveal wrapper — animates children into view on scroll |
| `LogoCarousel` | Auto-scrolling, infinite-loop horizontal logo strip |
| `Sheet` | Slide-over drawer primitive (used by MobileNav) |
| `ChevronDownIcon` | SVG chevron icon used in dropdowns and accordions |

### Button Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"primary" \| "secondary" \| "ghost"` | `"primary"` | Visual style |
| `className` | `string` | `""` | Additional Tailwind classes |
| `...rest` | `ButtonHTMLAttributes` | — | All standard `<button>` props |

### Link Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "nav" \| "button"` | `"default"` | Link style |
| `className` | `string` | `""` | Additional classes |
| `...rest` | `ComponentProps<NextLink>` | — | All `next/link` props |

### FadeInOnView Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Content to animate |
| `className` | `string` | `""` | Additional classes |
| `threshold` | `number` | `0.1` | Intersection threshold (0–1) |

---

## gravity-forms/

Gravity Forms rendering and submission. See [FORMS.md](FORMS.md) for full documentation.

| Component | Purpose |
|-----------|---------|
| `GravityForm` | `"use client"` component. Renders all form fields from a `GfFormData` prop, manages state, and handles submission via `submitGravityForm()` |
| `GfRecaptchaField` | Renders the reCAPTCHA v2 invisible field; exposes a token callback |

### GravityForm Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `form` | `GfFormData` | Yes | Pre-fetched form schema from `fetchGravityForm()` |
| `variant` | `"default" \| "on-dark" \| "inline"` | No | Visual style variant |
| `onSuccess` | `() => void` | No | Callback after successful submission |

---

## seo/

| Component | Purpose |
|-----------|---------|
| `JsonLd` | Renders a `<script type="application/ld+json">` tag for structured data (Organization, BreadcrumbList, etc.) |

---

## analytics/

| Component | Purpose |
|-----------|---------|
| `ThirdPartyScripts` | Loads third-party analytics and tag manager scripts (Google Tag Manager, etc.) via `next/script`. Placed in `app/layout.tsx` |

---

## locations/

Agency location pages and agent profile pages. Data comes from the WordPress Agency CPT (via `lib/agencies.ts`) with a static fallback from `lib/locations-data.ts`. See [AGENCIES.md](AGENCIES.md).

| Component | Purpose |
|-----------|---------|
| `LocationPageTemplate` | Full office location page (hero, agents grid, features, connect form) |
| `OfficeInfoHero` | Hero section with office image, name, phone, address, hours, and about text |
| `AgentsGrid` | Responsive grid of `AgentCard` components |
| `AgentCard` | Individual agent card with photo, name, role, and link to detail page |
| `AgentDetailTemplate` | Individual agent bio page with contact options |
| `ConnectAgentBanner` | Map embed + "Connect with an Agent" Gravity Form CTA |
| `FeaturesGrid` | Icon + heading + body grid of service offerings (Medicare, Health, Life, Annuity) |
| `FindAgentContent` | `/find-an-agent` search UI with agency cards and state/name filters |

### LocationPageTemplate Props

| Prop | Type | Description |
|------|------|-------------|
| `location` | `LocationData` | Office data (from Agency CPT or `locations-data.ts`) |
| `form` | `GfFormData \| null` | Pre-fetched Gravity Form for the connect section |

### AgentDetailTemplate Props

| Prop | Type | Description |
|------|------|-------------|
| `agent` | `AgentData` | Agent data |
| `location` | `LocationData` | Parent office data |
| `form` | `GfFormData \| null` | Pre-fetched Gravity Form for the contact section |

### AgentsGrid Props

| Prop | Type | Description |
|------|------|-------------|
| `agents` | `AgentData[]` | List of agents |
| `locationSlug` | `string` | Agency slug for building agent detail URLs |

### AgentCard Props

| Prop | Type | Description |
|------|------|-------------|
| `agent` | `AgentData` | Agent data |
| `locationSlug` | `string` | Agency slug for detail page URL |

### FeaturesGrid Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sectionHeading` | `string` | `"Our mission, Our story"` | Section title |
| `features` | `FeatureBlock[]` | — | Feature items |

---

## about-us/

### about-us/ (top-level)

| Component | Purpose |
|-----------|---------|
| `MilestonesSlider` | Horizontal scrolling milestones timeline |
| `TechnologyIcons` | Icon grid for the Technology section |
| `DistributionIcons` | Icon grid for the Our Distribution section |
| `WhoWeAreIcons` | Icon grid for the Who We Are section |

### about-us/leaders/

Leaders data is fetched from the WordPress Leader CPT via `GET_LEADERS` and `GET_LEADER_BY_SLUG`.

| Component | Purpose |
|-----------|---------|
| `LeadersGrid` | Responsive grid of `LeaderCard` components for the Our Leaders listing |
| `LeaderCard` | Individual leader card with photo, name, title, and link to detail |
| `LeaderDetailTemplate` | Full leader bio page with headshot, title, and rich-text bio |
| `LeadersBackedBySection` | "Backed by" logo/stats band shown below the leaders grid |

---

## insights/

Insights articles are a WordPress Custom Post Type. Data is fetched via `lib/insights-data.ts`.

| Component | Purpose |
|-----------|---------|
| `InsightsMagazinePage` | `/insights/` landing — magazine-style featured article grid + sidebar |
| `InsightPostTemplate` | Individual insight article layout with hero, body, share panel, and related articles |
| `InsightsCategoryPage` | `/insights/category/[slug]/` listing with pagination |
| `InsightsCategoryArticlesSection` | Article grid within a category listing |
| `InsightsCategoryPagination` | Numbered pagination for category pages |
| `InsightsNewsroomColumn` | Sidebar column with recent newsroom posts |
| `InsightSharePanel` | Social share buttons (copy link, social networks) |
| `InsightTopicBadge` | Colored topic/category badge pill |
| `InsightsAds` | Ad slots configured via WordPress options (`GET_INSIGHTS_ADS_SETTINGS`) |

---

## blog/

Blog / Newsroom components. Blog posts are standard WordPress posts.

| Component | Purpose |
|-----------|---------|
| `BlogPostCard` | Post preview card with image, date, category, title, and excerpt |
| `BlogPostTemplate` | Full blog post layout with header, body, and sidebar |
| `BlogPagination` | Prev/next pagination controls |
| `BlogListingToolbar` | Category filter and sort toolbar for newsroom/category listings |
| `NewsroomArticleRow` | Condensed article row for newsroom sidebar or related articles |
| `AnnouncementsCarousel` | Auto-rotating carousel of featured announcement posts |

---

## home/

Homepage sections. Content is hardcoded (system page).

| Component | Purpose |
|-----------|---------|
| `HeroSection` | Full-width hero with headline, CTA buttons, and background |
| `HeroScrollDownButton` | Animated scroll indicator |
| `StatBannerSection` | Key statistics banner (agents, states, etc.) |
| `LegacySection` | Heritage/legacy content block |
| `FaqSection` | FAQ accordion section |

---

## our-solutions/

| Component | Purpose |
|-----------|---------|
| `CarrierIcons` | Grid of carrier partner logo icons |

### our-solutions/affiliates/

| Component | Purpose |
|-----------|---------|
| `AffiliatesHero` | Affiliates page hero section |
| `AffiliatesGrowthCards` | Growth metric cards |
| `AffiliatedCompaniesCarousel` | Horizontal scrolling carousel of affiliated company logos |
| `AffiliatesPlatformIcons` | Platform capability icons grid |
| `AffiliatesQuoteBand` | Quote/testimonial band |

---

## Form Components

Each of these wraps a page-specific form. Most use `GravityForm` internally; simpler ones use native HTML forms.

| Directory | Component | Page | Notes |
|-----------|-----------|------|-------|
| `connect/` | `ConnectForm` | `/connect` | Gravity Form |
| `contact/` | `ContactConnectAgentForm` | `/contact` | Gravity Form |
| `contact/` | `ContactRepresentativeForm` | `/contact` | Gravity Form |
| `existinglead/` | `ExistingLeadForm` | `/existinglead` | Native form |
| `broker-contact-page/` | `BrokerContactForm` | `/broker-contact-page` | Gravity Form |
| `worksite/` | `WorksiteLeadForm` | `/worksite/lead` | Gravity Form |
| `valspar/` | `ValsparForm` | `/valspar` | Gravity Form |

---

## legal/

| Component | Purpose |
|-----------|---------|
| `LegalPageLayout` | Consistent layout wrapper for legal pages (privacy, terms, SMS terms) |
| `PrivacyAddendumRequestForm` | State-specific privacy addendum request form (bare layout) |

---

## Other Feature Components

| Directory | Component | Purpose |
|-----------|-----------|---------|
| `faq/` | `FaqAccordion` | Expandable FAQ items |
| `faq/` | `FaqNewsroomSection` | Related newsroom posts for FAQ pages |
| `brokers-faq/` | `BrokersFaqAccordion` | Broker-specific FAQ accordion |
| `kickoff-recap/` | `KickoffAccordion` | Expandable recap sections |
| `join-our-team/` | `VideoWithPlaceholder` | YouTube embed with poster image placeholder |
| `givesback/` | `GivesBackPhotoSlideshow` | Photo slideshow for Gives Back page |
| `thank-you/` | `ThankYouPageContent` | Generic thank-you page body |

---

## Data Types

Shared types used across location/agent components (from `lib/locations-data.ts`):

| Type | Key Fields |
|------|-----------|
| `LocationData` | `slug`, `officeName`, `phone`, `officeImageUrl`, `address`, `hours`, `aboutOffice`, `agents`, `features`, `gravityFormId` |
| `AgentData` | `slug`, `name`, `role`, `city`, `state`, `photoUrl`, `bio`, `email`, `phone`, `areasOfFocus` |
| `FeatureBlock` | `heading`, `body`, `icon` (`medicare \| health \| life \| annuity`) |
