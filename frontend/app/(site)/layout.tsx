import { LayoutShell } from "@/app/components/layout/LayoutShell";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LayoutShell>{children}</LayoutShell>;
}
