import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isMicrosoftIdeaxchangeAuthEnabled } from "@/lib/ideaxchange-auth-config";
import {
  IDEAXCHANGE_HOME_PATH,
  IDEAXCHANGE_LOGIN_PATH,
  IDEAXCHANGE_SESSION_COOKIE,
  IDEAXCHANGE_SESSION_VALUE,
  isIdeaxchangeReturnPath,
} from "@/lib/ideaxchange-constants";
import {
  type IdeaxchangePersona,
  getIdeaxchangeHomeForPersona,
} from "@/lib/ideaxchange-persona";

export {
  IDEAXCHANGE_HOME_PATH,
  IDEAXCHANGE_LOGIN_PATH,
  IDEAXCHANGE_MAGAZINE_PATH,
  IDEAXCHANGE_RECRUITING_HUB_PATH,
  IDEAXCHANGE_LEADERBOARD_PATH,
  IDEAXCHANGE_CARRIER_SPOTLIGHT_PATH,
  IDEAXCHANGE_SESSION_COOKIE,
  IDEAXCHANGE_SESSION_VALUE,
  isIdeaxchangeLoginPath,
  isIdeaxchangeProtectedPath,
  isIdeaxchangeReturnPath,
} from "@/lib/ideaxchange-constants";

export { isMicrosoftIdeaxchangeAuthEnabled } from "@/lib/ideaxchange-auth-config";
export type { IdeaxchangePersona } from "@/lib/ideaxchange-persona";
export {
  getIdeaxchangeHomeForPersona,
  getIdeaxchangeNavForPersona,
  canAccessIdeaxchangePath,
} from "@/lib/ideaxchange-persona";

export type IdeaxchangeAuthState = {
  mode: "microsoft" | "legacy";
  persona: IdeaxchangePersona;
  homePath: string;
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    roles: string[];
    groups: string[];
  } | null;
};

export function isIdeaxchangeSession(value: string | undefined): boolean {
  return value === IDEAXCHANGE_SESSION_VALUE;
}

/** Read IdeaXchange auth from the legacy shared-password cookie. */
export async function getLegacyIdeaxchangeSession(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(IDEAXCHANGE_SESSION_COOKIE)?.value;
}

/** Unified auth state for Microsoft JIT or legacy password gate. */
export async function getIdeaxchangeAuth(): Promise<IdeaxchangeAuthState | null> {
  if (isMicrosoftIdeaxchangeAuthEnabled()) {
    const session = await auth();
    if (!session?.user?.id) return null;

    const persona = session.user.persona ?? "sales";
    return {
      mode: "microsoft",
      persona,
      homePath: getIdeaxchangeHomeForPersona(persona),
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        roles: session.user.roles ?? [],
        groups: session.user.groups ?? [],
      },
    };
  }

  const legacy = await getLegacyIdeaxchangeSession();
  if (!isIdeaxchangeSession(legacy)) return null;

  return {
    mode: "legacy",
    persona: "sales",
    homePath: IDEAXCHANGE_HOME_PATH,
    user: null,
  };
}

export async function hasIdeaxchangeAccess(): Promise<boolean> {
  const state = await getIdeaxchangeAuth();
  return state !== null;
}

/** Server-side guard for gated ideaXchange routes. */
export async function requireIdeaxchangeAuth(returnPath?: string): Promise<IdeaxchangeAuthState> {
  const state = await getIdeaxchangeAuth();
  if (state) return state;

  const next =
    returnPath && isIdeaxchangeReturnPath(returnPath) ? returnPath : IDEAXCHANGE_HOME_PATH;
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
