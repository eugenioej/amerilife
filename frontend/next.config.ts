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
        ],
      },
    ];
  },
};

export default nextConfig;
