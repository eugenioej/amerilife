import GivesBackHero from "@/app/components/givesback/GivesBackHero";
import GivesBackContentFeatureSection from "@/app/components/givesback/GivesBackContentFeatureSection";
import GivesBackTimeline from "@/app/components/givesback/GivesBackTimeline";
import GivesBackDonorTierCarousel from "@/app/components/givesback/GivesBackDonorTierCarousel";
// import GivesBackBoardMemberCard from "@/app/components/givesback/GivesBackBoardMemberCard";
// import GivesBackSectionContainer from "@/app/components/givesback/GivesBackSectionContainer";

export default function GivesBackPage() {
  return (
    <main className="bg-white">
      <GivesBackHero />

      <GivesBackContentFeatureSection />

      <GivesBackTimeline />

      <GivesBackDonorTierCarousel />
    </main>
  );
}