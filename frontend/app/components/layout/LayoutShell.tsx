import { getPrimaryMenu } from "@/lib/wp-menus";
import { rewriteUploadsUrl } from "@/lib/wp-media";
import { HEADER_CONTACT_POPUP_FORM_ID, fetchGravityForm } from "@/lib/gf-client";
import type { IdeaxchangeDevViewMode } from "@/lib/ideaxchange-dev";
import { IdeaxchangeDevViewSwitcher } from "@/app/components/ideaxchange/IdeaxchangeDevViewSwitcher";
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
  ideaxchangeDevView = "off",
  showIdeaxchangeDevSwitcher = false,
  microsoftAuthEnabled = false,
  inIdeaxchange = false,
}: {
  children: React.ReactNode;
  ideaxchangePersona?: IdeaxchangePersona | null;
  ideaxchangeDevView?: IdeaxchangeDevViewMode;
  showIdeaxchangeDevSwitcher?: boolean;
  microsoftAuthEnabled?: boolean;
  inIdeaxchange?: boolean;
}) {
  const footerLogoUrl = rewriteUploadsUrl(FOOTER_LOGO_SRC);
  const certificationBadgeUrl = rewriteUploadsUrl(FOOTER_CERTIFICATION_BADGE_SRC);

  const [primaryMenu, contactPopupForm] = await Promise.all([
    getPrimaryMenu(),
    fetchGravityForm(HEADER_CONTACT_POPUP_FORM_ID).catch(() => null),
  ]);

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
          ideaxchangeDevView={ideaxchangeDevView}
          inIdeaxchange={inIdeaxchange}
        />
        <main id="main-content" className="flex min-h-0 min-w-0 flex-1 flex-col">
          {children}
        </main>
        {showIdeaxchangeDevSwitcher ? (
          <IdeaxchangeDevViewSwitcher initialMode={ideaxchangeDevView} />
        ) : null}
        <SiteFooter
          primaryMenu={primaryMenu}
          footerLogoUrl={footerLogoUrl}
          certificationBadgeUrl={certificationBadgeUrl}
        />
      </div>
    </ContactPopupProvider>
  );
}
