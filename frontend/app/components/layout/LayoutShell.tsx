import { getPrimaryMenu } from "@/lib/wp-menus";
import { rewriteUploadsUrl } from "@/lib/wp-media";
import { HEADER_CONTACT_POPUP_FORM_ID, fetchGravityForm } from "@/lib/gf-client";
import { ContactPopupProvider } from "./ContactPopupProvider";
import { TopBar } from "./TopBar";
import { SiteHeader } from "./SiteHeader";
import {
  SiteFooter,
  FOOTER_CERTIFICATION_BADGE_SRC,
  FOOTER_LOGO_SRC,
} from "./SiteFooter";

export async function LayoutShell({ children }: { children: React.ReactNode }) {
  const primaryMenu = await getPrimaryMenu();
  const footerLogoUrl = rewriteUploadsUrl(FOOTER_LOGO_SRC);
  const certificationBadgeUrl = rewriteUploadsUrl(FOOTER_CERTIFICATION_BADGE_SRC);

  let contactPopupForm = null;
  try {
    contactPopupForm = await fetchGravityForm(HEADER_CONTACT_POPUP_FORM_ID);
  } catch {
    contactPopupForm = null;
  }

  return (
    <ContactPopupProvider contactPopupForm={contactPopupForm}>
      <div className="flex min-h-screen flex-col overflow-x-clip">
        <TopBar />
        <SiteHeader primaryMenu={primaryMenu} />
        <main className="flex min-h-0 flex-1 flex-col overflow-x-clip">{children}</main>
        <SiteFooter
          primaryMenu={primaryMenu}
          footerLogoUrl={footerLogoUrl}
          certificationBadgeUrl={certificationBadgeUrl}
        />
      </div>
    </ContactPopupProvider>
  );
}
