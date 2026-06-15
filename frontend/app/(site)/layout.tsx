import { LayoutShell } from "@/app/components/layout/LayoutShell";

export const metadata = {
  title: "Masterminds",
  description: "Masterminds Agenda",

  manifest: "/manifest.json",

  appleWebApp: {
    capable: true,
    title: "Masterminds",
  },

  icons: {
    apple: "/icon-192.png",
  },
};

export const viewport = {
  themeColor: "#091229",
};


export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutShell>{children}</LayoutShell>;
}
