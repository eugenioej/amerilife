import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";
import { DISALLOWED_SITEMAP_PATHS } from "@/lib/sitemap-config";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl().replace(/\/$/, "");
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [...DISALLOWED_SITEMAP_PATHS],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
