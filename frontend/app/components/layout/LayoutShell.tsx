import { getPrimaryMenu } from "@/lib/wp-menus";
import { TopBar } from "./TopBar";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export async function LayoutShell({ children }: { children: React.ReactNode }) {
  const primaryMenu = await getPrimaryMenu();

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <TopBar />
      <SiteHeader primaryMenu={primaryMenu} />
      <main className="flex-1 overflow-x-hidden">{children}</main>
      <SiteFooter primaryMenu={primaryMenu} />
    </div>
  );
}
