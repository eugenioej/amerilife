import { LayoutShell } from "@/app/components/layout/LayoutShell";

export const metadata = {
  title: "Masterminds",
  description: "Masterminds Agenda",

  manifest: "/manifest.json",

  themeColor: "#091229",

  appleWebApp: {
    capable: true,
    title: "Masterminds",
  },

  icons: {
    apple: "/icon-192.png",
  },
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutShell>{children}</LayoutShell>;
}
