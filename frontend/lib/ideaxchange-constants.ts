export const IDEAXCHANGE_SESSION_COOKIE = "ideaxchange_session";
export const IDEAXCHANGE_LOGIN_PATH = "/ideaxchange/";
/** Unified ideaXchange feed — post-login landing and logo target. */
export const IDEAXCHANGE_HOME_FEED_PATH = "/ideaxchange/home/";
/** @deprecated Legacy index — redirects to home feed. */
export const IDEAXCHANGE_MAGAZINE_PATH = "/ideaxchange/magazine/";
/** Topic taxonomy archives — `/ideaxchange/magazine/category/[slug]/`. */
export const IDEAXCHANGE_RECRUITING_HUB_PATH = "/ideaxchange/recruiting-hub/";
export const IDEAXCHANGE_CAREER_LEADERBOARD_PATH = "/ideaxchange/career-leaderboard/";
export const IDEAXCHANGE_LEADERBOARD_PATH = "/ideaxchange/leaderboard/";
export const IDEAXCHANGE_CARRIER_SPOTLIGHT_PATH = "/ideaxchange/carrier-spotlight/";
/** Hidden at launch — enable in Phase 2 when carrier assets are ready. */
export const IDEAXCHANGE_CARRIER_SPOTLIGHT_NAV_ENABLED = false;
export const IDEAXCHANGE_SALES_SUCCESS_PATH = "/ideaxchange/sales-success/";
/** Gated ideaXchange search results. */
export const IDEAXCHANGE_SEARCH_PATH = "/ideaxchange/search/";
/** Default landing after login and when no return path is set. */
export const IDEAXCHANGE_HOME_PATH = IDEAXCHANGE_HOME_FEED_PATH;
export const IDEAXCHANGE_SESSION_VALUE = "authenticated";

/** Temporary gate password — override via IDEAXCHANGE_GATE_PASSWORD in production. */
export const IDEAXCHANGE_GATE_PASSWORD =
  process.env.IDEAXCHANGE_GATE_PASSWORD ?? "AmeriLifeXchange!";

export function isIdeaxchangeLoginPath(pathname: string): boolean {
  return pathname === "/ideaxchange" || pathname === "/ideaxchange/";
}

/** Any /ideaxchange/* route except the public login page. */
export function isIdeaxchangeProtectedPath(pathname: string): boolean {
  if (!pathname.startsWith("/ideaxchange")) return false;
  return !isIdeaxchangeLoginPath(pathname);
}

export function isIdeaxchangeReturnPath(path: string): boolean {
  const pathname = path.split("?")[0] ?? path;
  return pathname.startsWith("/ideaxchange/") && !isIdeaxchangeLoginPath(pathname);
}
