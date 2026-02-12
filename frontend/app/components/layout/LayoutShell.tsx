import { getPrimaryMenu } from "@/lib/wp-menus";
import { TopBar } from "./TopBar";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export async function LayoutShell({ children }: { children: React.ReactNode }) {
  const primaryMenu = await getPrimaryMenu();

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <SiteHeader primaryMenu={primaryMenu} />
      <main className="flex-1">{children}</main>
      <SiteFooter primaryMenu={primaryMenu} />
    </div>
  );
}
