import type { Metadata } from "next";
import { ContentUnavailableView } from "@/app/components/content-unavailable/ContentUnavailableView";
import { staticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = staticPageMetadata(
  "Content unavailable | AmeriLife",
  "This page is no longer available. Explore AmeriLife's solutions, leadership, distribution network, newsroom, and careers from here.",
  "/content-unavailable/"
);

export default function ContentUnavailablePage() {
  return <ContentUnavailableView />;
}
