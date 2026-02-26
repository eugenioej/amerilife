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
    return [
      {
        source: "/home/",
        destination: "https://amerilife.com/home/",
        permanent: true,
      },
      {
        source: "/about/news/",
        destination: "https://amerilife.com/newsroom/",
        permanent: true,
      },
      {
        source: "/worksite/",
        destination: "https://amerilife.com/about-us/our-distribution/worksite-distribution/",
        permanent: true,
      },
      {
        source: "/brokers/lead/",
        destination: "https://amerilife.com/broker-contact-page/",
        permanent: true,
      },
      {
        source: "/about/affiliates/",
        destination: "https://amerilife.com/our-solutions/affiliates/",
        permanent: true,
      },
      // /career/ and /career/agents/ served locally - no redirect
      {
        source: "/career/consumers/",
        destination: "https://amerilife.com/our-solutions/consumers/",
        permanent: true,
      },
      {
        source: "/brokers/marketing/",
        destination: "https://amerilife.com/our-solutions/affiliates/",
        permanent: true,
      },
      {
        source: "/brokers/compliance/",
        destination: "https://amerilife.com/our-solutions/affiliates/",
        permanent: true,
      },
      {
        source: "/brokers/technology/",
        destination: "https://amerilife.com/our-solutions/affiliates/",
        permanent: true,
      },
      {
        source: "/eo/",
        destination: "https://agentbenefitsprogram.com/",
        permanent: true,
      },
      {
        source: "/products/",
        destination: "https://amerilife.com/our-solutions/consumers/",
        permanent: true,
      },
      {
        source: "/distribution/",
        destination: "https://amerilife.com/about-us/our-distribution/",
        permanent: true,
      },
      {
        source: "/acquisition-partner-program/",
        destination: "https://amerilife.com/acquisition-partner-program/",
        permanent: true,
      },
      {
        source: "/about/history/",
        destination: "/about-us/who-we-are",
        permanent: true,
      },
      {
        source: "/executive/",
        destination: "https://amerilife.com/about-us/our-leaders/",
        permanent: true,
      },
      {
        source: "/pnc/",
        destination: "https://amerilife.com/our-solutions/consumers/",
        permanent: true,
      },
      {
        source: "/about/faq/",
        destination: "https://amerilife.com/",
        permanent: true,
      },
      {
        source: "/jobs/",
        destination: "/join-our-team/",
        permanent: true,
      },
      {
        source: "/brokers/",
        destination: "https://amerilife.com/our-solutions/agents-and-advisors/",
        permanent: true,
      },
      {
        source: "/community/",
        destination: "/givesback",
        permanent: true,
      },
      {
        source: "/carriers/faq/",
        destination: "https://amerilife.com/our-solutions/carriers/",
        permanent: true,
      },
      {
        source: "/rpp/",
        destination: "https://amerilife.com/brokers/rpp/?brokers",
        permanent: true,
      },
      {
        source: "/career/consumers/articles/",
        destination: "https://amerilife.com/our-solutions/consumers/",
        permanent: true,
      },
      {
        source: "/career/agents/articles/",
        destination: "https://amerilife.com/newsroom/",
        permanent: true,
      },
      {
        source: "/career/find/",
        destination: "https://amerilife.com/",
        permanent: true,
      },
      {
        source: "/agent/",
        destination: "/career/agents/",
        permanent: true,
      },
      {
        source: "/career/services/medicare/",
        destination: "https://amerilife.com/",
        permanent: true,
      },
      {
        source: "/career/services/medicare/thank-you/",
        destination: "https://amerilife.com/",
        permanent: true,
      },
      {
        source: "/career/plano-texas-rsvp/",
        destination: "https://amerilife.com/career/plano-texas-missed-seminar/",
        permanent: true,
      },
      {
        source: "/career/services/medicare/supplements/",
        destination: "https://amerilife.com/",
        permanent: true,
      },
      {
        source: "/career/services/medicare/medicare_advantage_part_c/",
        destination: "https://amerilife.com/",
        permanent: true,
      },
      {
        source: "/career/services/medicare/pdp_part_d/",
        destination: "https://amerilife.com/",
        permanent: true,
      },
      {
        source: "/career/grapevine-texas-rsvp/",
        destination: "https://amerilife.com/career/grapevine-texas-missed-seminar/",
        permanent: true,
      },
      {
        source: "/career/atlanta-rsvp/",
        destination: "https://amerilife.com/career/atlanta-missed-seminar/",
        permanent: true,
      },
      {
        source: "/development/aia-aba/",
        destination: "https://amerilife.com/our-solutions/carriers/",
        permanent: true,
      },
      {
        source: "/about/",
        destination: "/about-us/who-we-are",
        permanent: true,
      },
      {
        source: "/development/",
        destination: "https://amerilife.com/our-solutions/carriers/",
        permanent: true,
      },
      {
        source: "/career/services/medicare/medicare-infographic/",
        destination: "https://amerilife.com/",
        permanent: true,
      },
      {
        source: "/career/services/medicare/introduction/",
        destination: "https://amerilife.com/",
        permanent: true,
      },
      {
        source: "/retirement-planning-annuities/",
        destination: "https://amerilife.com/our-solutions/consumers/",
        permanent: true,
      },
      {
        source: "/leads-and-marketing-services/",
        destination: "https://amerilife.com/our-solutions/affiliates/",
        permanent: true,
      },
      {
        source: "/innovative-sales-technology/",
        destination: "https://amerilife.com/our-solutions/affiliates/",
        permanent: true,
      },
      {
        source: "/producer-services/",
        destination: "https://amerilife.com/our-solutions/affiliates/",
        permanent: true,
      },
      {
        source: "/a-vision-of-the-future/",
        destination: "https://amerilife.com/our-solutions/affiliates/",
        permanent: true,
      },
      {
        source: "/eo-broker/",
        destination: "https://amerilife.com/our-solutions/agents-and-advisors/",
        permanent: true,
      },
      {
        source: "/partners/",
        destination: "https://amerilife.com/our-solutions/agents-and-advisors/",
        permanent: true,
      },
      {
        source: "/back-office-services-for-affiliates/",
        destination: "https://amerilife.com/our-solutions/affiliates/",
        permanent: true,
      },
      {
        source: "/development/tpa-services/",
        destination: "https://amerilife.com/our-solutions/carriers/",
        permanent: true,
      },
      {
        source: "/join-our-talent-community/",
        destination: "/join-our-team/",
        permanent: true,
      },
      {
        source: "/hispanic-heritage/",
        destination: "/givesback",
        permanent: true,
      },
      {
        source: "/thank-you-st-jude-radiothon/",
        destination: "/givesback",
        permanent: true,
      },
      {
        source: "/st-jude-radiothon/",
        destination: "/givesback",
        permanent: true,
      },
      {
        source: "/centralfloridatv/",
        destination: "https://www.planretirementyourway.com/",
        permanent: true,
      },
      {
        source: "/life-amerilife/",
        destination: "https://amerilife.sharepoint.com/sites/LifeAmeriLife",
        permanent: true,
      },
      ...wpRedirects,
    ];
  },
};

export default nextConfig;
