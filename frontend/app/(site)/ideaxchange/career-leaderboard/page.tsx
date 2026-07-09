import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CareerLeaderboardPage } from "@/app/components/ideaxchange/career-leaderboard/CareerLeaderboardPage";
import { requireIdeaxchangeAuth } from "@/lib/ideaxchange-auth";
import { IDEAXCHANGE_CAREER_LEADERBOARD_PATH } from "@/lib/ideaxchange-constants";
import {
  canAccessCareerLeaderboard,
  getIdeaxchangeDevViewMode,
} from "@/lib/ideaxchange-dev";
import { getCareerLeaderboardPageData } from "@/lib/ideaxchange-career-leaderboard-data";
import { getIdeaxchangeHomeForPersona } from "@/lib/ideaxchange-persona";
import { privatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = privatePageMetadata(
  "Career Leaderboard | ideaXchange",
  "Career agency incentive standings sourced from Piper.",
);

export default async function CareerLeaderboardIndexPage() {
  const auth = await requireIdeaxchangeAuth(IDEAXCHANGE_CAREER_LEADERBOARD_PATH);
  const devView = await getIdeaxchangeDevViewMode();

  if (!canAccessCareerLeaderboard(auth.persona, devView)) {
    redirect(getIdeaxchangeHomeForPersona(auth.persona));
  }

  const data = await getCareerLeaderboardPageData();

  return <CareerLeaderboardPage data={data} />;
}
