import { NextResponse } from "next/server";
import { getIdeaxchangeAuth } from "@/lib/ideaxchange-auth";
import { mergeEntraMembershipIds } from "@/lib/ideaxchange-persona";

/** Authenticated session snapshot — use after login to validate Entra groups/roles. */
export async function GET() {
  const state = await getIdeaxchangeAuth();
  if (!state) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const roles = state.user?.roles ?? [];
  const groups = state.user?.groups ?? [];
  const membershipIds = mergeEntraMembershipIds(roles, groups);

  return NextResponse.json({
    authenticated: true,
    mode: state.mode,
    persona: state.persona,
    homePath: state.homePath,
    user: state.user,
    entra: {
      rolesClaim: roles,
      groupsClaim: groups,
      /** Security group object IDs from either claim (Entra often uses `roles` for group GUIDs). */
      membershipIds,
      note:
        membershipIds.length > 0 && groups.length === 0
          ? "Group GUIDs arrived in rolesClaim — map them with IDEAXCHANGE_ENTRA_GROUP_*_ID env vars."
          : undefined,
    },
  });
}
