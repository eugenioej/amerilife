import type { Metadata } from "next";
import { Open_Sans, Poppins } from "next/font/google";
import Script from "next/script";
import {
  CrazyEggScript,
  GoogleTagManagerNoScript,
  GoogleTagManagerScript,
} from "@/app/components/analytics/ThirdPartyScripts";
import { getSiteUrl } from "@/lib/seo";
import "./globals.css"

const openSans = Open_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["200", "300", "800"],
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
        url: "/og-default.jpg",
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
        <Script
          src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
          strategy="afterInteractive"
          data-document-language="true"
          data-domain-script="019ae616-08df-7cc6-bd3a-4ecab492d976-test"
          charSet="UTF-8"
        />
        <Script id="onetrust-wrapper" strategy="afterInteractive">
          {`
            function OptanonWrapper() {}
          `}
        </Script>
        <GoogleTagManagerNoScript />
        <GoogleTagManagerScript />
        <CrazyEggScript />
        {children}
      </body>
    </html>
  );
}
