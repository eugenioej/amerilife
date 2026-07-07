import { getPrimaryMenu } from "@/lib/wp-menus";
import { rewriteUploadsUrl } from "@/lib/wp-media";
import { HEADER_CONTACT_POPUP_FORM_ID, fetchGravityForm } from "@/lib/gf-client";
import type { IdeaxchangePersona } from "@/lib/ideaxchange-persona";
import { ContactPopupProvider } from "./ContactPopupProvider";
import { TopBar } from "./TopBar";
import { SiteHeader } from "./SiteHeader";
import {
  SiteFooter,
  FOOTER_CERTIFICATION_BADGE_SRC,
  FOOTER_LOGO_SRC,
} from "./SiteFooter";

export async function LayoutShell({
  children,
  ideaxchangePersona = null,
  microsoftAuthEnabled = false,
  inIdeaxchange = false,
}: {
  children: React.ReactNode;
  ideaxchangePersona?: IdeaxchangePersona | null;
  microsoftAuthEnabled?: boolean;
  inIdeaxchange?: boolean;
}) {
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
      {/* Skip-to-content — visually hidden until focused; required for WCAG 2.1 AA */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <div className="flex min-h-screen flex-col">
        <TopBar microsoftAuthEnabled={microsoftAuthEnabled} inIdeaxchange={inIdeaxchange} />
        <SiteHeader
          primaryMenu={primaryMenu}
          ideaxchangePersona={ideaxchangePersona}
          inIdeaxchange={inIdeaxchange}
        />
        <main id="main-content" className="flex min-h-0 min-w-0 flex-1 flex-col">
          {children}
        </main>
        <SiteFooter
          primaryMenu={primaryMenu}
          footerLogoUrl={footerLogoUrl}
          certificationBadgeUrl={certificationBadgeUrl}
        />
      </div>
    </ContactPopupProvider>
  );
}
