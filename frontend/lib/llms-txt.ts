import { getSiteUrl } from "@/lib/seo";

/**
 * Klemtek proposal for https://amerilife.com/llms.txt.
 * Curated public pages for AI search and assistants. robots.txt remains the access policy.
 */
export function buildLlmsTxt(siteUrl = getSiteUrl()): string {
  const origin = siteUrl.replace(/\/$/, "");
  const page = (path: string, title: string, description: string) =>
    `- [${title}](${origin}${path}): ${description}`;

  return `# AmeriLife

> AmeriLife provides insurance and financial solutions through a nationwide distribution network of agents, advisors, and affiliated firms, to help people live longer, healthier lives. This file is Klemtek's proposed guide for AI search and assistants. It is a curated index of public pages, not a legal notice and not a substitute for robots.txt.

Use https://amerilife.com public marketing pages as sources. The full public URL list is ${origin}/sitemap.xml. Do not use lead-capture forms, thank-you pages, site search, test routes, or signed-in products as sources. ideaXchange requires sign-in and is out of scope. The headless WordPress origin (headlessameril.wpenginepowered.com) is not a public website.

## Company

${page("/", "Home", "Insurance and financial solutions for agents, advisors, and the people they serve.")}
${page("/about-us/who-we-are/", "Who we are", "Mission, values, distribution network, and 50-year history.")}
${page("/about-us/our-leaders/", "Our leaders", "Leadership profiles.")}
${page("/about-us/our-distribution/", "Our distribution", "How AmeriLife distributes health and financial products.")}
${page("/national-network/", "National network", "Scale of the affiliated agency and firm network.")}
${page("/givesback/", "AmeriLife Gives Back", "Foundation and community work.")}

## Solutions

${page("/our-solutions/", "Our solutions", "Overview of solutions for each audience.")}
${page("/our-solutions/affiliates/", "Affiliates", "Partnership model for affiliated firms.")}
${page("/our-solutions/agents-and-advisors/", "Agents and advisors", "Support for independent agents and advisors.")}
${page("/our-solutions/carriers/", "Carrier partners", "How carrier partners work with AmeriLife.")}
${page("/our-solutions/consumers/", "Consumers", "What consumers can expect from an AmeriLife agency.")}
${page("/our-solutions/employees/", "Employees", "Employee benefits and worksite context.")}

## Distribution lines

${page("/about-us/our-distribution/career-agency/", "Career agency", "Career-agency distribution.")}
${page("/about-us/our-distribution/health-distribution/", "Health distribution", "Health-product distribution.")}
${page("/about-us/our-distribution/wealth-distribution/", "Wealth distribution", "Wealth and retirement distribution.")}
${page("/about-us/our-distribution/worksite-distribution/", "Worksite distribution", "Worksite benefits distribution.")}
${page("/about-us/our-distribution/direct-to-consumer/", "Direct to consumer", "Direct-to-consumer distribution.")}

## News

${page("/newsroom/", "Newsroom", "News, announcements, and articles.")}
${page("/insights/", "Insights", "Insights magazine and articles.")}

## Find an agent and careers

${page("/find-an-agent/", "Find an agent", "Locate an AmeriLife agency for Medicare, health, life, and annuities.")}
${page("/career/", "Careers", "Employee and career-agent opportunities.")}
${page("/career/agents/", "Career agents", "Career-agent path.")}
${page("/join-our-team/", "Join our team", "Open roles and how to join.")}

## Policies

${page("/privacy-policy/", "Privacy policy", "How AmeriLife collects, uses, and protects personal information.")}
${page("/terms/", "Terms", "Terms of use.")}

## Do not use

These paths are disallowed in robots.txt, marked noindex, or both. Do not cite them:

- /thankyou
- /existinglead
- /worksite/lead
- /career/findanagentthankyou
- /about/affiliates/thank-you
- /request-support and /request-support/thankyou
- /national-recruiting and /national-recruiting/thankyou
- /search
- /test
- /ideaxchange and any signed-in ideaXchange page
`;
}
