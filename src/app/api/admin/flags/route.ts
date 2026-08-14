import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/platform/admin-api";
import {
  AUTH0_FLAG_KEY,
  getFeatureFlag,
  listFeatureFlags,
  setFeatureFlag,
} from "@/lib/platform/feature-flags";
import { writeAuditLog } from "@/lib/platform/audit";
import { getAuth0VaultConfig } from "@/lib/auth/auth0";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = await requirePermission(req, "flags:write");
  if ("response" in auth) return auth.response;
  const flags = await listFeatureFlags();
  const auth0Ready = Boolean(await getAuth0VaultConfig());
  return NextResponse.json({
    ok: true,
    flags,
    auth0: {
      flag: await getFeatureFlag(AUTH0_FLAG_KEY),
      credentialsConfigured: auth0Ready,
      activePath: (await getFeatureFlag(AUTH0_FLAG_KEY)) && auth0Ready ? "auth0" : "otp",
    },
  });
}

export async function PATCH(req: Request) {
  const auth = await requirePermission(req, "flags:write");
  if ("response" in auth) return auth.response;
  const body = (await req.json().catch(() => ({}))) as { key?: string; enabled?: boolean };
  if (!body.key || typeof body.enabled !== "boolean") {
    return NextResponse.json({ ok: false, error: "key and enabled are required" }, { status: 400 });
  }
  if (body.key === AUTH0_FLAG_KEY && body.enabled) {
    const cfg = await getAuth0VaultConfig();
    if (!cfg) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Cannot enable Auth0 until live domain, client ID, client secret and app secret are saved in the vault (sandbox_* / *.example values do not count).",
        },
        { status: 400 }
      );
    }
  }
  await setFeatureFlag(body.key, body.enabled, auth.staff.id);
  await writeAuditLog({
    actor: auth.staff,
    action: "flag.update",
    entityType: "feature_flag",
    entityId: body.key,
    summary: `${body.key} set to ${body.enabled ? "ON" : "OFF"}`,
  });
  const flags = await listFeatureFlags();
  return NextResponse.json({ ok: true, flags });
}
