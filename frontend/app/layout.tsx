import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const metadata: Metadata = {
  title: "AmeriLife | Insurance and Financial Solutions",
  description:
    "Delivering insurance and financial solutions to agents and advisors to help people live longer, healthier lives.",
  ...(siteUrl && { metadataBase: new URL(siteUrl) }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.variable} antialiased`} style={{ fontFamily: "var(--font-sans)" }}>
        {children}
      </body>
    </html>
  );
}
