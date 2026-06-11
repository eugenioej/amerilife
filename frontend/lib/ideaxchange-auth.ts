import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  IDEAXCHANGE_LOGIN_PATH,
  IDEAXCHANGE_MAGAZINE_PATH,
  IDEAXCHANGE_SESSION_COOKIE,
  IDEAXCHANGE_SESSION_VALUE,
} from "@/lib/ideaxchange-constants";

export {
  IDEAXCHANGE_LOGIN_PATH,
  IDEAXCHANGE_MAGAZINE_PATH,
  IDEAXCHANGE_SESSION_COOKIE,
  IDEAXCHANGE_SESSION_VALUE,
} from "@/lib/ideaxchange-constants";

export function isIdeaxchangeSession(value: string | undefined): boolean {
  return value === IDEAXCHANGE_SESSION_VALUE;
}

export async function getIdeaxchangeSession(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(IDEAXCHANGE_SESSION_COOKIE)?.value;
}

/** Server-side guard for gated ideaXchange magazine routes. */
export async function requireIdeaxchangeAuth(returnPath?: string): Promise<void> {
  const session = await getIdeaxchangeSession();
  if (isIdeaxchangeSession(session)) return;

  const next = returnPath?.startsWith("/") ? returnPath : IDEAXCHANGE_MAGAZINE_PATH;
  const login = `${IDEAXCHANGE_LOGIN_PATH}?next=${encodeURIComponent(next)}`;
  redirect(login);
}

export function ideaxchangeSessionCookieOptions(maxAgeSeconds = 60 * 60 * 24 * 7) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
