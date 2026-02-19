import type { Metadata } from "next";
import type { YoastSeoData } from "./queries";

const SITE_SUFFIX = " | AmeriLife";

function getSiteUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim() || undefined;
}

/**
 * Rewrites a canonical URL from WordPress origin to the frontend origin.
 * Used when Yoast returns the headless WP URL; we need canonicals to point to the Next.js site.
 */
function rewriteCanonicalToFrontend(canonical: string): string {
  const siteUrl = getSiteUrl();
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
