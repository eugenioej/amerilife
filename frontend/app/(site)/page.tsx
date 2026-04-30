import type { Metadata } from "next";
import { HeroSection } from "@/app/components/home/HeroSection";
import { LegacySection } from "@/app/components/home/LegacySection";
import { StatBannerSection } from "@/app/components/home/StatBannerSection";
import { FaqSection } from "@/app/components/home/FaqSection";
import { JsonLd } from "@/app/components/seo/JsonLd";
import { organizationJsonLd, staticPageMetadata } from "@/lib/seo";
import { rewriteUploadsUrl } from "@/lib/wp-media";
import { Network, Users, Cpu, TrendingUp } from "lucide-react";

export const metadata: Metadata = staticPageMetadata(
  "AmeriLife | Insurance and Financial Solutions",
  "Delivering insurance and financial solutions to agents and advisors to help people live longer, healthier lives.",
  "/"
);

const STAT_SECTIONS = [
  {
    heading: "STRENGTH IN SCALE",
    statNumber: "166",
    statLabel: "Unique IMOs, Agencies & Financial Firms",
    description:
      "Every year, more than 5 million Americans are advised on and delivered the health and financial solutions they need through AmeriLife's vast, nationwide distribution. And our network continues to grow at a rapid pace with 32 new organizations having joined AmeriLife in the past three years.",
    ctaText: "GET TO KNOW OUR NETWORK",
    ctaHref: "/national-network/",
    imageUrl: rewriteUploadsUrl(
      "https://headlessameril.wpenginepowered.com/wp-content/uploads/2022/01/GettyImages-1214224199_Resize-scaled.jpg"
    ),
    imageAlt: "AmeriLife network and distribution",
    direction: "left" as const,
    icon: Network,
  },
  {
    heading: "Culture of Service",
    statNumber: "300,000+",
    statLabel: "Client-Centered Agents & Advisors",
    description:
      "AmeriLife unites insurance agents, financial advisors, and industry experts who — alongside our leaders and corporate support staff — are passionate about cultivating meaningful relations with clients.",
    ctaText: "READ OUR STORY",
    ctaHref: "/about-us/who-we-are/",
    imageUrl: rewriteUploadsUrl(
      "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/04/Join_Agent_VideoPreview2_Gemini_HD_4x-scaled.webp"
    ),
    imageUnoptimized: true,
    imageAlt: "AmeriLife agents and advisors",
    direction: "right" as const,
    icon: Users,
    tone: "footer" as const,
  },
  {
    heading: "Technology That Works (For You)",
    statNumber: "Thousands",
    statLabel: "of Agents Powered by Agent Xcelerator®",
    description:
      "From smart lead scoring and real-time sales analytics to leveraging the full potential of powerful CRM technology, AmeriLife offers an extensive suite of technology, tools and insights that's re-defining the industry and helping marketers, agents and advisors do what they do best — serve their clients better than anyone else.",
    ctaText: "POWER YOUR BUSINESS",
    ctaHref: "/technology-and-analytics/",
    imageUrl: rewriteUploadsUrl(
      "https://headlessameril.wpenginepowered.com/wp-content/uploads/2022/02/Power_Tech_Home_1422x1144.png"
    ),
    imageAlt: "Agent Xcelerator technology",
    direction: "left" as const,
    icon: Cpu,
  },
  {
    heading: "PLATFORM TO ACCELERATE YOUR GROWTH",
    statNumber: "3,600",
    statLabel: "AmeriLife employees supporting your business",
    description:
      "At AmeriLife, we believe that the journey to accelerated, sustainable business growth is rooted in an active partnership and a commitment to collaboration, innovation, and personal and professional development.",
    ctaText: "START YOUR JOURNEY",
    ctaHref: "/join-our-team/",
    imageUrl: rewriteUploadsUrl(
      "https://headlessameril.wpenginepowered.com/wp-content/uploads/2022/11/Home-Page-Platform-Growth_1422x1144.png"
    ),
    imageAlt: "AmeriLife platform growth",
    direction: "right" as const,
    icon: TrendingUp,
    tone: "footer" as const,
  },
];

export default function Home() {
  return (
    <>
      <JsonLd schema={organizationJsonLd()} />
      <div className="home-hero-fold">
        <HeroSection />
      </div>
      <LegacySection />
      <div className="flex flex-col [&>section]:flex-shrink-0">
        {STAT_SECTIONS.map((props, i) => (
          <StatBannerSection key={i} {...props} />
        ))}
      </div>
      <FaqSection />
    </>
  );
}
