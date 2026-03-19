# Component Library

Components live under `frontend/app/components/`, organized by feature.

## layout/

Chrome and navigation.

| Component | Purpose |
|-----------|---------|
| `LayoutShell` | Async server component. Fetches WP nav, composes TopBar + SiteHeader + main + SiteFooter |
| `SiteHeader` | Sticky header with 3-level dropdown nav, hamburger for mobile, search button |
| `SiteFooter` | Footer with WP-driven nav links |
| `TopBar` | Thin teal bar above header |
| `MobileNav` | Mobile slide-out drawer |
| `HeaderSearch` | Search icon + inline search input |

### LayoutShell Props

| Prop | Type | Description |
|------|------|-------------|
| `children` | `React.ReactNode` | Page content |

## ui/

Design system primitives. Use these to build new components.

| Component | Purpose |
|-----------|---------|
| `Button` | Primary, secondary, ghost variants. Pill-shaped |
| `Link` | Wraps `next/link` with variant styles |
| `FadeInOnView` | Intersection Observer scroll-reveal wrapper |
| `LogoCarousel` | Auto-scrolling logo strip |
| `Sheet` | Slide-over drawer primitive |
| `ChevronDownIcon` | Icon component |

### Button Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"primary" \| "secondary" \| "ghost"` | `"primary"` | Visual style |
| `className` | `string` | `""` | Additional classes |
| ...rest | `ButtonHTMLAttributes` | — | Standard button props |

### Link Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "nav" \| "button"` | `"default"` | Link style |
| `className` | `string` | `""` | Additional classes |
| ...rest | `ComponentProps<NextLink>` | — | Standard Next.js Link props |

### FadeInOnView Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Content to reveal |
| `className` | `string` | `""` | Additional classes |
| `threshold` | `number` | `0.1` | Intersection threshold 0–1 |

## locations/

Agent and office pages. Used by `LocationPageTemplate` and `AgentDetailTemplate`.

**Data source:** All location and agent data comes from `frontend/lib/locations-data.ts`. There is no CMS for locations — add or edit entries in that file. See [DEVELOPMENT.md](DEVELOPMENT.md#adding-a-new-location-or-agent) for how to add a new office or agent.

| Component | Purpose |
|-----------|---------|
| `LocationPageTemplate` | Full page for a local office |
| `OfficeInfoHero` | Hero with office image, contact info, about |
| `AgentsGrid` | Grid of agent cards |
| `AgentCard` | Individual agent card with photo, name, link |
| `AgentDetailTemplate` | Individual agent bio page |
| `ConnectAgentBanner` | Map + contact form CTA |
| `FeaturesGrid` | Icon grid of service offerings |
| `FindAgentContent` | Find An Agent search UI |

### LocationPageTemplate Props

| Prop | Type | Description |
|------|------|-------------|
| `location` | `LocationData` | Office data from `lib/locations-data` |

### AgentDetailTemplate Props

| Prop | Type | Description |
|------|------|-------------|
| `agent` | `AgentData` | Agent data |
| `location` | `LocationData` | Parent office data |

### OfficeInfoHero Props

| Prop | Type | Description |
|------|------|-------------|
| `location` | `LocationData` | Office data |

### AgentsGrid Props

| Prop | Type | Description |
|------|------|-------------|
| `agents` | `AgentData[]` | List of agents |
| `locationSlug` | `string` | Slug for agent detail links |

### AgentCard Props

| Prop | Type | Description |
|------|------|-------------|
| `agent` | `AgentData` | Agent data |
| `locationSlug` | `string` | Slug for detail page URL |

### ConnectAgentBanner Props

| Prop | Type | Description |
|------|------|-------------|
| `location` | `LocationData` | Office data (for map embed) |

### FeaturesGrid Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sectionHeading` | `string` | `"Our mission, Our story"` | Section title |
| `features` | `FeatureBlock[]` | — | Feature items (heading, body, icon) |

### FindAgentContent Props

| Prop | Type | Description |
|------|------|-------------|
| `locations` | `LocationData[]` | All locations for search/filter |

## blog/

News and blog components.

| Component | Purpose |
|-----------|---------|
| `BlogPostCard` | Post preview card |
| `BlogPostTemplate` | Full post layout |
| `BlogPagination` | Pagination controls |
| `NewsroomArticleRow` | Article row for newsroom listing |
| `AnnouncementsCarousel` | Carousel for announcements |

## home/

Homepage sections.

| Component | Purpose |
|-----------|---------|
| `HeroSection` | Hero with CTA |
| `StatBannerSection` | Stats banner |
| `LegacySection` | Legacy content block |
| `FaqSection` | FAQ accordion |

## about-us/

| Component | Purpose |
|-----------|---------|
| `MilestonesSlider` | Milestones timeline |
| `TechnologyIcons` | Technology icons grid |
| `DistributionIcons` | Distribution icons |
| `WhoWeAreIcons` | Who We Are icons |

## our-solutions/affiliates/

| Component | Purpose |
|-----------|---------|
| `AffiliatesHero` | Affiliates hero |
| `AffiliatesGrowthCards` | Growth cards |
| `AffiliatedCompaniesCarousel` | Company logos carousel |
| `AffiliatesPlatformIcons` | Platform icons |
| `AffiliatesQuoteBand` | Quote band |

## our-solutions/

| Component | Purpose |
|-----------|---------|
| `CarrierIcons` | Carrier icons grid |

## Form components

| Directory | Component | Purpose |
|-----------|-----------|---------|
| `connect/` | `ConnectForm` | Connect form |
| `contact/` | `ContactConnectAgentForm`, `ContactRepresentativeForm` | Contact forms |
| `existinglead/` | `ExistingLeadForm` | Existing lead form |
| `broker-contact-page/` | `BrokerContactForm` | Broker contact |
| `worksite/` | `WorksiteLeadForm` | Worksite lead form |
| `valspar/` | `ValsparForm` | Valspar landing form |

## legal/

| Component | Purpose |
|-----------|---------|
| `LegalPageLayout` | Layout for legal pages |
| `PrivacyAddendumRequestForm` | Privacy addendum request |

## faq/, brokers-faq/, kickoff-recap/, join-our-team/, thank-you/

Section-specific accordions, video placeholders, and content components.

## Data Types (from `lib/locations-data`)

| Type | Fields |
|------|--------|
| `LocationData` | slug, officeName, phone, officeImageUrl, address, hours, aboutOffice, agents, features |
| `AgentData` | slug, name, role, city, state, photoUrl, bio, email, phone, areasOfFocus |
| `FeatureBlock` | heading, body, icon? (medicare \| health \| life \| annuity) |
