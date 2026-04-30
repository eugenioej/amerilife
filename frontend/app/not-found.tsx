import { ContentUnavailableView } from "@/app/components/content-unavailable/ContentUnavailableView";
import { LayoutShell } from "@/app/components/layout/LayoutShell";

export default async function NotFound() {
  return (
    <LayoutShell>
      <ContentUnavailableView />
    </LayoutShell>
  );
}
