import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/platform/admin-api";
import { getSql } from "@/lib/db";
import { staffHas } from "@/lib/platform/rbac";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Any authenticated admin. Slot status only — no secret last4. */
export async function GET(req: Request) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;
  const canFinance = staffHas(auth.staff.role, "finance:read");
  try {
    const sql = getSql();
    const rows = await sql`
      SELECT slot_key, display_name, category, enabled, sandbox_mode
      FROM integration_providers
      ORDER BY category, display_name
    `;
    return NextResponse.json({
      ok: true,
      dbOk: true,
      canFinance,
      providers: rows.map((p) => ({
        slotKey: String(p.slot_key),
        displayName: String(p.display_name),
        category: String(p.category),
        enabled: Boolean(p.enabled),
        sandboxMode: Boolean(p.sandbox_mode),
      })),
    });
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        dbOk: false,
        error: e instanceof Error ? e.message : "health failed",
      },
      { status: 500 }
    );
  }
}
