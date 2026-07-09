import { headers } from "next/headers";
import { LayoutShell } from "@/app/components/layout/LayoutShell";
import { getIdeaxchangeAuth } from "@/lib/ideaxchange-auth";
import { isMicrosoftIdeaxchangeAuthEnabled } from "@/lib/ideaxchange-auth-config";
import {
  getIdeaxchangeDevViewMode,
  isIdeaxchangeDevUnlockEnabled,
} from "@/lib/ideaxchange-dev";
import { isIdeaxchangePath } from "@/lib/ideaxchange-nav";

export const metadata = {
  title: "AmeriLife",
  description: "AmeriLife",

  manifest: "/manifest.json",

  appleWebApp: {
    capable: true,
    title: "AmeriLife",
  },

  icons: {
    apple: "/icon-192.png",
  },
};

export const viewport = {
  themeColor: "#091229",
};

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ideaxchangeAuth = await getIdeaxchangeAuth();
  const pathname = (await headers()).get("x-pathname") ?? "";
  const inIdeaxchange = isIdeaxchangePath(pathname);
  const ideaxchangeDevView = inIdeaxchange ? await getIdeaxchangeDevViewMode() : "off";
  const showIdeaxchangeDevSwitcher =
    inIdeaxchange && isIdeaxchangeDevUnlockEnabled() && Boolean(ideaxchangeAuth);

  return (
    <LayoutShell
      ideaxchangePersona={ideaxchangeAuth?.persona ?? null}
      ideaxchangeDevView={ideaxchangeDevView}
      showIdeaxchangeDevSwitcher={showIdeaxchangeDevSwitcher}
      microsoftAuthEnabled={isMicrosoftIdeaxchangeAuthEnabled()}
      inIdeaxchange={inIdeaxchange}
    >
      {children}
    </LayoutShell>
  );
}
