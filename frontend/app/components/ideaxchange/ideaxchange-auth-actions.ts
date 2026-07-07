"use server";

import { signIn, signOut } from "@/auth";
import { IDEAXCHANGE_HOME_PATH, IDEAXCHANGE_LOGIN_PATH } from "@/lib/ideaxchange-constants";

export async function signInWithMicrosoftEntra(formData: FormData) {
  const callbackUrl = formData.get("callbackUrl");
  const redirectTo =
    typeof callbackUrl === "string" && callbackUrl.startsWith("/ideaxchange/")
      ? callbackUrl
      : IDEAXCHANGE_HOME_PATH;

  await signIn("microsoft-entra-id", { redirectTo });
}

export async function signOutIdeaxchange() {
  await signOut({ redirectTo: IDEAXCHANGE_LOGIN_PATH });
}
