import type { Metadata } from "next";
import type { InsightDetail, PostByUri, YoastSeoData } from "./queries";
import { formatInsightExcerptPlain } from "./insight-excerpt";

const SITE_SUFFIX = " | AmeriLife";

const DEFAULT_SITE = "https://amerilife.com";

/** Canonical site origin for metadata, sitemap, and JSON-LD (falls back to production). */
export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE;
}

function getSiteUrlOptional(): string | undefined {
  const u = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return u || undefined;
}

/**
 * Rewrites a canonical URL from WordPress origin to the frontend origin.
 * Used when Yoast returns the headless WP URL; we need canonicals to point to the Next.js site.
 */
function rewriteCanonicalToFrontend(canonical: string): string {
  const siteUrl = getSiteUrlOptional();
  if (!siteUrl) return canonical;
  try {
    const canonicalUrl = new URL(canonical);
    const siteBase = new URL(siteUrl);
    return siteBase.origin + canonicalUrl.pathname + canonicalUrl.search;
  } catch {
    return canonical;
  }
}

/**
 * Maps Yoast SEO data from WPGraphQL to Next.js Metadata.
 * Reusable for Pages, Posts, and other content types.
 */
export function yoastSeoToMetadata(
  seo: YoastSeoData | null | undefined,
  fallbackTitle: string
): Metadata {
  const title = seo?.title?.trim() || fallbackTitle;
  const displayTitle = title.includes(SITE_SUFFIX) ? title : `${title}${SITE_SUFFIX}`;

  const metadata: Metadata = {
    title: displayTitle,
  };

  const metaDesc = seo?.metaDesc?.trim();
  if (metaDesc) {
    metadata.description = metaDesc;
  }

  if (seo?.canonical?.trim()) {
    metadata.alternates = {
      canonical: rewriteCanonicalToFrontend(seo.canonical),
    };
  }

  const ogTitle = seo?.opengraphTitle?.trim() || displayTitle;
  const ogDescription = seo?.opengraphDescription?.trim() || metaDesc || undefined;
  const ogUrl = seo?.opengraphUrl?.trim();
  const ogImages: { url: string; alt?: string }[] | undefined = seo?.opengraphImage?.sourceUrl
    ? [
        {
          url: seo.opengraphImage.sourceUrl,
          alt: seo.opengraphImage.altText || undefined,
        },
      ]
    : undefined;

  metadata.openGraph = {
    title: ogTitle,
    description: ogDescription,
    url: ogUrl,
    images: ogImages,
  };

  const twitterTitle = seo?.twitterTitle?.trim() || ogTitle;
  const twitterDescription = seo?.twitterDescription?.trim() || ogDescription;
  const twitterImage = seo?.twitterImage?.sourceUrl;

  metadata.twitter = {
    card: "summary_large_image",
    title: twitterTitle,
    description: twitterDescription,
    images: twitterImage ? [twitterImage] : undefined,
  };

  return metadata;
}

/** Full metadata for static App Router pages (OG, Twitter, canonical). */
export function staticPageMetadata(
  title: string,
  description: string,
  pathname: string
): Metadata {
  const base = getSiteUrl();
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const canonical = new URL(path, base).toString();

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      siteName: "AmeriLife",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/** Metadata for routes that must not be indexed (search, thank-you, test, etc.). */
export function privatePageMetadata(
  title: string,
  description: string
): Metadata {
  return {
    title,
    description,
    robots: { index: false, follow: false },
  };
}

/** `path` omitted when the segment has no real index page (avoid 404 / empty stubs in structured data). */
export type BreadcrumbJsonLdItem = { name: string; path?: string };

/** BreadcrumbList schema.org for use with JsonLd. */
export function breadcrumbJsonLd(
  items: BreadcrumbJsonLdItem[],
  siteUrl = getSiteUrl()
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => {
      const el: Record<string, unknown> = {
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
      };
      if (item.path) {
        el.item = new URL(
          item.path.startsWith("/") ? item.path : `/${item.path}`,
          siteUrl
        ).toString();
      }
      return el;
    }),
  };
}

/** Organization JSON-LD for the homepage. */
export function organizationJsonLd(): Record<string, unknown> {
  const url = getSiteUrl().replace(/\/$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AmeriLife",
    url,
    logo: `${url}/og-default.jpg`,
    sameAs: [
      "https://www.linkedin.com/company/amerilife/",
      "https://www.facebook.com/AmeriLife/",
      "https://twitter.com/AmeriLife",
    ],
  };
}

/** Article JSON-LD for blog posts. */
export function articleJsonLd(
  post: PostByUri,
  options: { categoryLabel?: string; url: string }
): Record<string, unknown> {
  const authorName = post.author?.node?.name?.trim() || "AmeriLife";
  const image = post.featuredImage?.node?.sourceUrl;
  const published = post.date ? new Date(post.date).toISOString() : undefined;
  const desc =
    post.seo?.metaDesc?.trim() ||
    (post.excerpt
      ? post.excerpt.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
      : undefined);

  const article: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title ?? "Article",
    ...(desc ? { description: desc } : {}),
    ...(published ? { datePublished: published } : {}),
    author: { "@type": "Person", name: authorName },
    publisher: {
      "@type": "Organization",
      name: "AmeriLife",
      url: getSiteUrl(),
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": options.url },
  };

  if (image) {
    article.image = [image];
  }
  if (options.categoryLabel) {
    article.articleSection = options.categoryLabel;
  }

  return article;
}

/** Article JSON-LD for Insights CPT posts. */
export function insightArticleJsonLd(
  insight: InsightDetail,
  options: { categoryLabel?: string; url: string }
): Record<string, unknown> {
  const authorName = "AmeriLife";
  const image = insight.featuredImage?.node?.sourceUrl;
  const published = insight.date ? new Date(insight.date).toISOString() : undefined;
  const desc =
    insight.seo?.metaDesc?.trim() ||
    (insight.excerpt ? formatInsightExcerptPlain(insight.excerpt) : undefined);

  const article: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: insight.title ?? "Article",
    ...(desc ? { description: desc } : {}),
    ...(published ? { datePublished: published } : {}),
    author: { "@type": "Person", name: authorName },
    publisher: {
      "@type": "Organization",
      name: "AmeriLife",
      url: getSiteUrl(),
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": options.url },
  };

  if (image) {
    article.image = [image];
  }
  if (options.categoryLabel) {
    article.articleSection = options.categoryLabel;
  }

  return article;
}
