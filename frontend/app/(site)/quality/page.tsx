import QualityPage from '@/app/components/quality/QualityPage';
import NationalRecruitingHeader from "@/app/components/national-recruiting/NationalRecruitingHeader";
import NationalRecruitingFooter from "@/app/components/national-recruiting/NationalRecruitingFooter";

export default function Page() {
  return (
    <div className="request-support-page min-h-screen bg-white">
      <NationalRecruitingHeader/>
      <QualityPage />
      <NationalRecruitingFooter/>
    </div>
  );
}