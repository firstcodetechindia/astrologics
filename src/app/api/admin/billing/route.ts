import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/platform/admin-api";
import { getSql } from "@/lib/db";
import {
  getBillingSettings,
  updateBillingSettings,
  type BillingSettings,
} from "@/lib/billing/engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = await requirePermission(req, "finance:read");
  if ("response" in auth) return auth.response;
  const sql = getSql();
  const settings = await getBillingSettings();
  const payments = await sql`
    SELECT p.*, c.display_name AS customer_name, a.display_name AS astrologer_name,
           i.invoice_no
    FROM payments p
    LEFT JOIN billing_customers c ON c.id = p.customer_id
    LEFT JOIN billing_astrologers a ON a.id = p.astrologer_id
    LEFT JOIN invoices i ON i.payment_id = p.id
    ORDER BY p.created_at DESC
    LIMIT 80
  `;
  const plans = await sql`SELECT * FROM subscription_plans ORDER BY created_at DESC`;
  const astrologers = await sql`SELECT * FROM billing_astrologers ORDER BY created_at DESC`;
  const products = await sql`SELECT * FROM catalog_products ORDER BY created_at DESC`;
  return NextResponse.json({ ok: true, settings, payments, plans, astrologers, products });
}

export async function PATCH(req: Request) {
  const auth = await requirePermission(req, "finance:write");
  if ("response" in auth) return auth.response;
  const body = (await req.json().catch(() => ({}))) as Partial<BillingSettings>;
  const settings = await updateBillingSettings(body, auth.staff);
  return NextResponse.json({ ok: true, settings });
}
