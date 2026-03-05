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
    const wpRedirects = await getRedirectsFromWP();
    console.error(`[next.config] Redirects loaded: ${wpRedirects.length} from WordPress`);
    return [
      // Canary: static redirect to verify Next.js redirects work on Atlas.
      // Remove after confirmed working.
      { source: "/redirect-test", destination: "/about-us/who-we-are", permanent: false },
      ...wpRedirects,
    ];
  },
};

export default nextConfig;
