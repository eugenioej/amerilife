export type SearchEntry = {
  path: string;
  title: string;
  description: string;
  keywords: string[];
};

const SEARCH_INDEX: SearchEntry[] = [
  {
    path: "/",
    title: "AmeriLife | Insurance and Financial Solutions",
    description:
      "Delivering insurance and financial solutions to agents and advisors to help people live longer, healthier lives.",
    keywords: [
      "strength in scale",
      "culture of service",
      "technology",
      "platform growth",
      "national network",
      "who we are",
    ],
  },
  {
    path: "/about-us/who-we-are/",
    title: "Who We Are",
    description:
      "AmeriLife's strength is its mission: to provide insurance and retirement solutions to help people live longer, healthier lives. Learn about our values, distribution network, and 50+ year legacy.",
    keywords: [
      "values",
      "mission",
      "distribution",
      "affiliates",
      "agents",
      "carriers",
      "consumers",
      "employees",
      "milestones",
    ],
  },
  {
    path: "/about-us/our-leaders/",
    title: "Our Leaders",
    description:
      "Meet AmeriLife's executive leadership team — industry veterans committed to ethics, integrity, and helping people and businesses achieve financial security.",
    keywords: [
      "executive team",
      "leadership",
      "CEO",
      "management",
      "about AmeriLife",
      "insurance leadership",
    ],
  },
  {
    path: "/about-us/our-distribution/",
    title: "Our Distribution",
    description:
      "AmeriLife's vast marketing and distribution network connects agents and advisors with consumers nationwide. Explore our distribution channels and by the numbers.",
    keywords: [
      "wealth distribution",
      "health distribution",
      "career agency",
      "worksite distribution",
      "by the numbers",
    ],
  },
  {
    path: "/about-us/our-distribution/health-distribution/",
    title: "Health Distribution",
    description:
      "As one of the industry's largest independent distribution networks, AmeriLife Health delivers exceptional customer value through Medicare Advantage, Medicare Supplement, PDP, ACA, ancillary and life insurance sales.",
    keywords: [
      "Medicare",
      "simplified issue life",
      "ancillary health",
      "direct-to-consumer",
      "national network",
      "carriers",
      "sales tools",
    ],
  },
  {
    path: "/about-us/our-distribution/direct-to-consumer/",
    title: "Direct-to-Consumer",
    description:
      "AmeriLife’s direct-to-consumer division, including Senior Healthcare Direct, delivers Medicare Advantage and Medicare Supplement products to Medicare-eligible customers nationwide.",
    keywords: [
      "Senior Healthcare Direct",
      "Medicare Advantage",
      "Medicare Supplement",
      "DTC",
      "call center",
      "YourMedicare",
    ],
  },
  {
    path: "/about-us/our-distribution/career-agency/",
    title: "Career Agency",
    description:
      "As more Americans look to insurance and retirement solutions to protect their families, AmeriLife's agents are on the front lines. We're committed to helping independent agents develop and grow with training, incentives, and industry-leading products.",
    keywords: [
      "training",
      "incentives",
      "resources",
      "new agent",
      "professional development",
    ],
  },
  {
    path: "/about-us/our-distribution/worksite-distribution/",
    title: "Worksite Distribution",
    description:
      "AmeriLife Benefits helps employers turn their employee benefits program into a competitive advantage with customized benefit solutions, communications and administrative services.",
    keywords: [
      "group benefits",
      "critical illness",
      "dental",
      "vision",
      "employers",
      "leadership",
    ],
  },
  {
    path: "/about-us/our-distribution/wealth-distribution/",
    title: "Wealth Distribution",
    description:
      "AmeriLife's Wealth Distribution empowers agents and advisors who demand more out of their independent distribution platforms, with a focus on accumulation and retirement income, protection solutions, and advisory services.",
    keywords: [
      "annuities",
      "accumulation",
      "retirement income",
      "protection",
      "advisory",
    ],
  },
  {
    path: "/brokers/faq/",
    title: "Frequently Asked Questions About AmeriLife",
    description:
      "Find answers to common questions about independent insurance agents, what AmeriLife can do for your business, and our distribution network.",
    keywords: ["FAQ", "brokers", "independent agents", "distribution"],
  },
  {
    path: "/broker-contact-page/",
    title: "Independent Partner Contact Us",
    description:
      "Contact AmeriLife about brokerage partnerships. Discuss carrier solutions, asset management, leads, training, and more. For broker use only.",
    keywords: [
      "broker",
      "partnership",
      "carrier solutions",
      "leads",
      "training",
    ],
  },
  {
    path: "/career/",
    title: "AmeriLife Offices",
    description:
      "Explore career opportunities with AmeriLife. Join our team as an employee or become a career agent.",
    keywords: ["career agents", "join our team", "offices"],
  },
  {
    path: "/career/agents/",
    title: "Career Agents",
    description:
      "Your career starts here. Do you have an outgoing personality and entrepreneurial spirit? AmeriLife provides leads, training, and support to help career agents excel.",
    keywords: [
      "leads",
      "training",
      "sales bonuses",
      "promotion from within",
      "AmeriLife University",
    ],
  },
  {
    path: "/consumers/",
    title: "Insurance for Individuals and Families",
    description:
      "We help families build a solid financial foundation with insurance now to free you to focus on your plans for the future.",
    keywords: [
      "consumers",
      "individuals",
      "families",
      "life insurance",
      "health insurance",
      "Medicare",
      "find an agent",
    ],
  },
  {
    path: "/consumers/faq/",
    title: "Frequently Asked Questions for Consumers",
    description:
      "Find answers to common questions about insurance for individuals and families. AmeriLife offers life, health, Medicare and financial solutions.",
    keywords: ["FAQ", "consumers", "life insurance", "Medicare", "annuities"],
  },
  {
    path: "/contact/",
    title: "Contact Us",
    description:
      "Contact AmeriLife. Choose a topic to connect with an AmeriLife representative.",
    keywords: ["contact", "representative", "phone", "email"],
  },
  {
    path: "/connect/",
    title: "Connect With Us",
    description:
      "Connect with a licensed insurance representative. Fill out the form to get more information about AmeriLife products and solutions.",
    keywords: ["connect", "licensed agent", "contact us"],
  },
  {
    path: "/existinglead/",
    title: "Existing Agents Contact Us",
    description:
      "Licensed agents: Contact AmeriLife to learn about partnering opportunities and contracting with an AmeriLife affiliated insurance marketing organization.",
    keywords: ["existing agents", "partnering", "contracting", "IMO"],
  },
  {
    path: "/expectations-when-you-join-our-team/",
    title: "Expectations When You Join Our Team",
    description:
      "Join #TeamAmeriLife! Offer insurance and retirement solutions to provide peace of mind and help people live longer healthier lives.",
    keywords: [
      "training support",
      "agent support",
      "first 90 days",
      "products",
      "AmeriLife University",
    ],
  },
  {
    path: "/faq/",
    title: "Frequently Asked Questions",
    description:
      "Find answers to common questions about partnering with AmeriLife, becoming an agent, and our insurance and financial solutions.",
    keywords: ["FAQ", "partnering", "agent", "insurance", "financial solutions"],
  },
  {
    path: "/flexibility-and-optionality/",
    title: "Flexibility & Optionality",
    description:
      "At AmeriLife, we embrace your uniqueness. We're a partner that aligns and grows with you, pivots with you, and develops solutions that are as flexible and nimble as today's ever-changing market demands.",
    keywords: ["industry-leading products", "flexibility", "optionality", "carriers"],
  },
  {
    path: "/insights/",
    title: "Insights",
    description:
      "Magazine-style stories on health, wealth, and leadership from AmeriLife — America's leading health and wealth distribution company.",
    keywords: [
      "insights",
      "magazine",
      "health",
      "wealth",
      "leadership",
      "AmeriLife",
    ],
  },
  {
    path: "/insights/category/health/",
    title: "Health Insights",
    description:
      "Health, Medicare, and wellness insights for agents and advisors from AmeriLife.",
    keywords: ["health", "Medicare", "insights", "agents", "wellness"],
  },
  {
    path: "/insights/category/wealth/",
    title: "Wealth Insights",
    description:
      "Wealth, retirement, and financial planning insights from AmeriLife.",
    keywords: ["wealth", "retirement", "financial planning", "insights"],
  },
  {
    path: "/insights/category/leadership/",
    title: "Leadership Insights",
    description:
      "Leadership and industry perspectives for insurance and financial professionals.",
    keywords: ["leadership", "insights", "agents", "distribution"],
  },
  {
    path: "/insights/category/life/",
    title: "Life Insurance Insights",
    description:
      "Life insurance trends and guidance from AmeriLife Insights.",
    keywords: ["life insurance", "IUL", "insights", "sales"],
  },
  {
    path: "/givesback/",
    title: "AmeriLife Gives Back Foundation",
    description:
      "As a values-driven company, giving back is in AmeriLife's DNA. The AmeriLife Gives Back Foundation supports senior veterans and community partnerships.",
    keywords: [
      "foundation",
      "veterans",
      "Honor Flight",
      "community",
      "giving back",
    ],
  },
  {
    path: "/join-our-team/",
    title: "Join Our Team",
    description:
      "As part of the AmeriLife team, you have the ability to positively impact the lives of Americans nationwide. Explore career opportunities for employees and sales agents.",
    keywords: [
      "career",
      "employees",
      "sales agents",
      "work where your work matters",
    ],
  },
  {
    path: "/kickoff-recap-2025/",
    title: "Kickoff Recap 2025",
    description:
      "That's a wrap on AmeriLife's 2025 National Kickoff Conference. Thank you to everyone who joined us in Tampa, Florida.",
    keywords: [
      "kickoff",
      "conference",
      "Tampa",
      "2025",
      "AEP leadership",
      "expo hall",
    ],
  },
  {
    path: "/national-network/",
    title: "National Network",
    description:
      "AmeriLife represents a vast national network of affiliates and partners aligned under one mission: to provide solutions that deliver peace of mind and help people across the United States live longer, healthier lives.",
    keywords: [
      "affiliates",
      "partners",
      "Thomas H. Lee Partners",
      "active partnership",
    ],
  },
  {
    path: "/our-solutions/",
    title: "Our Solutions",
    description:
      "Our solutions represent AmeriLife's ongoing commitment to deliver opportunities for our stakeholders to make a difference and carve their own path.",
    keywords: [
      "about us",
      "affiliates",
      "agents",
      "carriers",
      "consumers",
      "employees",
    ],
  },
  {
    path: "/our-solutions/affiliates/",
    title: "Affiliates",
    description:
      "When you partner with AmeriLife, you join a family of independent companies that make up the industry's most powerful distribution network — all while maintaining the autonomy to run your business that you've worked so hard to build.",
    keywords: [
      "affiliates",
      "distribution network",
      "autonomy",
      "partnership",
    ],
  },
  {
    path: "/our-solutions/agents-and-advisors/",
    title: "Agents & Advisors",
    description:
      "A career as an independent agent or registered advisor with AmeriLife means joining a national network of like-minded professionals and gaining access to products, training and technology to build your business your way.",
    keywords: [
      "new business opportunities",
      "empowered independence",
      "competitive products",
      "advanced tools",
    ],
  },
  {
    path: "/our-solutions/carriers/",
    title: "Carrier Partners",
    description:
      "Learn how AmeriLife distributes insurance solutions through our powerful network of industry-leading insurance carrier partnerships.",
    keywords: [
      "Medicare Advantage",
      "Medicare Supplement",
      "life insurance",
      "annuities",
      "product expertise",
    ],
  },
  {
    path: "/our-solutions/consumers/",
    title: "Consumers",
    description:
      "Helping you live a longer, healthier life. AmeriLife offers life and health insurance, annuities, Medicare solutions, and retirement planning from leading carriers — customized for your needs.",
    keywords: [
      "Medicare",
      "annuities",
      "life insurance",
      "voluntary health",
      "Medigap",
    ],
  },
  {
    path: "/our-solutions/employees/",
    title: "Employees",
    description:
      "When you work for AmeriLife, you're joining a company with a purpose — to help people live longer, healthier and more secure lives. Explore our culture, benefits, and career opportunities.",
    keywords: [
      "career",
      "benefits",
      "total rewards",
      "compensation",
      "wellbeing",
    ],
  },
  {
    path: "/privacy-policy/",
    title: "Privacy Policy",
    description:
      "AmeriLife Privacy Policy - Learn how we collect, use, and protect your personal information.",
    keywords: ["privacy", "personal information", "data collection", "consent"],
  },
  {
    path: "/sma-amerilife-video/",
    title: "AmeriLife and Senior Market Advisors (SMA) Video",
    description:
      "AmeriLife and Senior Market Advisors (SMA) have joined forces. Learn about the partnership and how we're better together.",
    keywords: [
      "SMA",
      "Senior Market Advisors",
      "partnership",
      "better together",
    ],
  },
  {
    path: "/sms-text-messaging-terms-and-conditions/",
    title: "SMS Text Messaging Terms and Conditions",
    description:
      "AmeriLife SMS Text Messaging Terms and Conditions - Learn how we use SMS text messaging.",
    keywords: ["SMS", "text messaging", "terms", "opt in"],
  },
  {
    path: "/solutions-and-opportunities/",
    title: "Solutions & Opportunities",
    description:
      "AmeriLife's consultative approach, broad carrier selection and vast distribution network meet the needs of consumers at all stages of their lives — where they are, how they want to buy, and all within their individual budgets.",
    keywords: [
      "expanding your world",
      "consultative approach",
      "carrier selection",
      "distribution",
    ],
  },
  {
    path: "/terms/",
    title: "Terms of Use",
    description:
      "AmeriLife Legal Notice and Terms of Use - Please read these terms and conditions before using this website.",
    keywords: ["terms", "legal notice", "conditions"],
  },
  {
    path: "/valspar/",
    title: "Valspar",
    description:
      "AmeriLife is a national leader in the development, marketing and distribution of annuity, life and health insurance solutions.",
    keywords: [
      "annuity",
      "life insurance",
      "health insurance",
      "distribution",
    ],
  },
  {
    path: "/worksite/",
    title: "Employers",
    description:
      "AmeriLife worksite benefits for employers and organizations. Connect with an AmeriLife Benefits representative.",
    keywords: ["employers", "organizations", "worksite benefits"],
  },
  {
    path: "/worksite/lead/",
    title: "Employers & Organizations Contact Us",
    description:
      "Contact AmeriLife to learn about worksite benefits for employers and organizations. Connect with an AmeriLife Benefits representative.",
    keywords: [
      "employers",
      "organizations",
      "contact",
      "worksite benefits",
    ],
  },
  {
    path: "/technology-and-analytics/",
    title: "Technology & Analytics",
    description:
      "AmeriLife leverages technology and analytics to drive growth and innovation across our distribution network.",
    keywords: ["technology", "analytics", "innovation", "distribution"],
  },
  {
    path: "/find-an-agent/",
    title: "Find An Agent",
    description:
      "Find an AmeriLife agent near you. Connect with licensed agents for Medicare, life insurance, annuities, and retirement solutions.",
    keywords: ["find agent", "agent locator", "Medicare", "insurance", "local agent"],
  },
  {
    path: "/texas/",
    title: "AmeriLife Texas Market",
    description:
      "Find AmeriLife agents across Texas — Dallas, Fort Worth, McKinney, Mansfield, Highland Village, Rockwall and more.",
    keywords: [
      "Texas",
      "Dallas",
      "Fort Worth",
      "McKinney",
      "find agent",
      "AmeriLife of Texas",
      "Medicare",
    ],
  },
  {
    path: "/florida/",
    title: "AmeriLife of Florida, LLC",
    description:
      "Find AmeriLife agents in Florida — West Palm Beach and Fort Lauderdale. Medicare, health, life, and annuities.",
    keywords: [
      "Florida",
      "West Palm Beach",
      "Fort Lauderdale",
      "find agent",
      "AmeriLife of Florida",
      "Medicare",
    ],
  },
  {
    path: "/polk-county/",
    title: "AmeriLife of Polk County, LLC",
    description:
      "AmeriLife of Polk County - Winter Haven, FL. Connect with an AmeriLife agent for insurance and retirement solutions.",
    keywords: [
      "Polk County",
      "Winter Haven",
      "agent",
      "Medicare",
      "insurance",
      "annuities",
    ],
  },
];

export type SearchResult = SearchEntry & {
  score: number;
};

/**
 * Searches the static page index. Each word in the query is matched
 * independently against title, description, and keywords. Results are
 * ranked by weighted relevance (title > keywords > description).
 */
export function searchPages(query: string): SearchResult[] {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 1);

  if (terms.length === 0) return [];

  const scored: SearchResult[] = [];

  for (const entry of SEARCH_INDEX) {
    const titleLower = entry.title.toLowerCase();
    const descLower = entry.description.toLowerCase();
    const kwLower = entry.keywords.map((k) => k.toLowerCase());

    let score = 0;
    let matchedTerms = 0;

    for (const term of terms) {
      let termScore = 0;

      if (titleLower.includes(term)) termScore += 10;
      if (kwLower.some((kw) => kw.includes(term))) termScore += 5;
      if (descLower.includes(term)) termScore += 2;

      if (termScore > 0) {
        matchedTerms++;
        score += termScore;
      }
    }

    if (matchedTerms === 0) continue;

    // Bonus when all search terms match
    if (matchedTerms === terms.length) {
      score *= 1.5;
    }

    scored.push({ ...entry, score });
  }

  scored.sort((a, b) => b.score - a.score);

  return scored;
}
