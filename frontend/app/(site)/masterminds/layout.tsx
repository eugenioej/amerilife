import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#091229",
};

export const metadata: Metadata = {
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

export default function MastermindsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
