import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/platform/admin-api";
import { getSql } from "@/lib/db";
import { writeAuditLog } from "@/lib/platform/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = await requirePermission(req, "finance:read");
  if ("response" in auth) return auth.response;
  const sql = getSql();
  const plans = await sql`SELECT * FROM subscription_plans ORDER BY created_at DESC`;
  return NextResponse.json({ ok: true, plans });
}

export async function POST(req: Request) {
  const auth = await requirePermission(req, "finance:write");
  if ("response" in auth) return auth.response;
  const body = (await req.json().catch(() => ({}))) as {
    name?: string;
    description?: string;
    amountMinor?: number;
    cycle?: string;
    features?: string[];
    active?: boolean;
    id?: string;
  };
  const sql = getSql();
  if (body.id) {
    await sql`
      UPDATE subscription_plans SET
        name = ${String(body.name || "")},
        description = ${String(body.description || "")},
        amount_minor = ${Number(body.amountMinor || 0)},
        cycle = ${body.cycle === "annual" ? "annual" : "monthly"},
        features_json = ${JSON.stringify(body.features || [])},
        active = ${body.active !== false},
        updated_at = now()
      WHERE id = ${body.id}
    `;
  } else {
    await sql`
      INSERT INTO subscription_plans (name, description, amount_minor, cycle, features_json, active)
      VALUES (
        ${String(body.name || "Plan")},
        ${String(body.description || "")},
        ${Number(body.amountMinor || 0)},
        ${body.cycle === "annual" ? "annual" : "monthly"},
        ${JSON.stringify(body.features || [])},
        ${body.active !== false}
      )
    `;
  }
  await writeAuditLog({
    actor: auth.staff,
    action: "plan.upsert",
    entityType: "subscription_plan",
    summary: `Saved plan ${body.name}`,
  });
  const plans = await sql`SELECT * FROM subscription_plans ORDER BY created_at DESC`;
  return NextResponse.json({ ok: true, plans });
}
