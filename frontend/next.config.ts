import type { NextConfig } from "next";
import { getRedirectsFromWP } from "./lib/wp-redirects";
import path from "path";
import { fileURLToPath } from "url";

const turbopackRoot =
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  turbopack: {
    root: turbopackRoot,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "amerilife.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.amerilife.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "headlessameril.wpenginepowered.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "uatamerilife.wpengine.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "headlessameril.wpenginepowered.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.greatplacetowork.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    const wp = await getRedirectsFromWP();
    return [
      { source: "/fbtermsandpolicy", destination: "/privacy-policy/", permanent: true },
      { source: "/fbtermsandpolicy/", destination: "/privacy-policy/", permanent: true },
      { source: "/privacy", destination: "/privacy-policy/", permanent: true },
      { source: "/privacy/", destination: "/privacy-policy/", permanent: true },
      { source: "/blog", destination: "/newsroom", permanent: true },
      { source: "/blog/", destination: "/newsroom", permanent: true },
      { source: "/about/news", destination: "/newsroom", permanent: true },
      { source: "/about/news/", destination: "/newsroom", permanent: true },
      ...wp,
    ];
  },
  async headers() {
    // CSP notes:
    // - script-src includes 'unsafe-inline' because GTM's bootstrap snippet is
    //   an inline script injected via next/script dangerouslySetInnerHTML.
    //   Removing it requires a nonce-based approach — see Google's Tag Platform CSP guide.
    // - connect-src covers GA4, GTM, Crazy Egg, and the headless WP GraphQL endpoint.
    // - frame-src covers GTM noscript iframe, YouTube video embeds, and Vimeo (e.g. /givesback).
    const csp = [
      "default-src 'self'",
      [
        "script-src 'self' 'unsafe-inline'",
        "https://www.googletagmanager.com",
        "https://www.google-analytics.com",
        "https://script.crazyegg.com",
        "https://www.google.com",
        "https://www.gstatic.com",
        "https://recaptcha.net",
      ].join(" "),
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      [
        "connect-src 'self'",
        "https://www.googletagmanager.com",
        "https://www.google-analytics.com",
        "https://analytics.google.com",
        "https://stats.g.doubleclick.net",
        "https://region1.google-analytics.com",
        "https://script.crazyegg.com",
        "https://headlessameril.wpenginepowered.com",
        "https://amerilife.com",
      ].join(" "),
      [
        "frame-src 'self'",
        "https://www.googletagmanager.com",
        "https://www.youtube.com",
        "https://www.youtube-nocookie.com",
        "https://player.vimeo.com",
        "https://www.google.com",
        "https://maps.google.com",
        "https://recaptcha.net",
      ].join(" "),
      "media-src 'self' https:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://headlessameril.wpenginepowered.com",
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: csp,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
