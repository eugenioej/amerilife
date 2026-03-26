import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl().replace(/\/$/, "");
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/test",
        "/search",
        "/thankyou",
        "/existinglead",
        "/worksite/lead",
        "/career/findanagentthankyou",
        "/about/affiliates/thank-you",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
