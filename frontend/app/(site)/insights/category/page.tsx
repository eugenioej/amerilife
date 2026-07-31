import { permanentRedirect } from "next/navigation";

export default function LegacyInsightCategoryBaseRedirectPage() {
  permanentRedirect("/insights/");
}