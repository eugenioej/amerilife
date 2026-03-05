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
    ],
  },
  async redirects() {
    return getRedirectsFromWP();
  },
};

export default nextConfig;
