import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { getBillingSettings } from "@/lib/billing/engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sql = getSql();
    const settings = await getBillingSettings();
    const astrologers = await sql`
      SELECT id, display_name, kind, commission_bps FROM billing_astrologers
      WHERE active = true ORDER BY display_name
    `;
    const plans = await sql`
      SELECT id, name, description, amount_minor, cycle, features_json
      FROM subscription_plans WHERE active = true ORDER BY amount_minor
    `;
    const products = await sql`
      SELECT id, name, kind, description, amount_minor
      FROM catalog_products WHERE active = true ORDER BY name
    `;
    return NextResponse.json({
      ok: true,
      gstRateBps: settings.gst_rate_bps,
      astrologers,
      plans,
      products,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Catalog unavailable";
    return NextResponse.json({ ok: false, error: msg }, { status: 503 });
  }
}
