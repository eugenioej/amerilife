import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { LayoutShell } from "./components/layout/LayoutShell";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AmeriLife | Insurance and Financial Solutions",
  description:
    "Delivering insurance and financial solutions to agents and advisors to help people live longer, healthier lives.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.variable} antialiased`} style={{ fontFamily: "var(--font-sans)" }}>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
