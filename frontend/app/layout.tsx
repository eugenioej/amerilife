import type { Metadata } from "next";
import { Open_Sans, Poppins } from "next/font/google";
import { getSiteUrl } from "@/lib/seo";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "800"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "AmeriLife | Insurance and Financial Solutions",
  description:
    "Delivering insurance and financial solutions to agents and advisors to help people live longer, healthier lives.",
  openGraph: {
    siteName: "AmeriLife",
    type: "website",
    title: "AmeriLife | Insurance and Financial Solutions",
    description:
      "Delivering insurance and financial solutions to agents and advisors to help people live longer, healthier lives.",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "AmeriLife",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@AmeriLife",
    title: "AmeriLife | Insurance and Financial Solutions",
    description:
      "Delivering insurance and financial solutions to agents and advisors to help people live longer, healthier lives.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${openSans.variable} ${poppins.variable} antialiased`}
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {children}
      </body>
    </html>
  );
}
