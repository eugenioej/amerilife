import { redirect } from "next/navigation";
import { requireIdeaxchangeAuth } from "@/lib/ideaxchange-auth";
import { IDEAXCHANGE_HOME_FEED_PATH } from "@/lib/ideaxchange-constants";

/** Legacy /ideaxchange/magazine/ — redirects to the unified home feed. */
export default async function IdeaxchangeMagazineIndexRedirect() {
  await requireIdeaxchangeAuth("/ideaxchange/magazine/");
  redirect(IDEAXCHANGE_HOME_FEED_PATH);
}
