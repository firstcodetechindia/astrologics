import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/platform/admin-api";
import { getSql } from "@/lib/db";
import { adjustWallet } from "@/lib/billing/engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = await requirePermission(req, "finance:read");
  if ("response" in auth) return auth.response;
  const sql = getSql();
  const wallets = await sql`
    SELECT w.*, c.display_name, c.phone, c.email
    FROM wallets w
    JOIN billing_customers c ON c.id = w.customer_id
    ORDER BY w.updated_at DESC
  `;
  const ledger = await sql`
    SELECT l.*, c.display_name
    FROM wallet_ledger l
    JOIN wallets w ON w.id = l.wallet_id
    JOIN billing_customers c ON c.id = w.customer_id
    ORDER BY l.created_at DESC
    LIMIT 80
  `;
  return NextResponse.json({ ok: true, wallets, ledger });
}

export async function POST(req: Request) {
  const auth = await requirePermission(req, "finance:write");
  if ("response" in auth) return auth.response;
  const body = (await req.json().catch(() => ({}))) as {
    customerId?: string;
    amountMinor?: number;
    reason?: string;
  };
  if (!body.customerId || !body.amountMinor) {
    return NextResponse.json({ ok: false, error: "customerId and amountMinor required" }, { status: 400 });
  }
  const balance = await adjustWallet(
    body.customerId,
    Number(body.amountMinor),
    String(body.reason || "admin_adjust"),
    auth.staff
  );
  return NextResponse.json({ ok: true, balance });
}
