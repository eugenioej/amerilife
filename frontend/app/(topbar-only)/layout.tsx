import { TopBar } from "@/app/components/layout/TopBar";

export default function TopBarOnlyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
