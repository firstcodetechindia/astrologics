import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/platform/admin-api";
import { getSql } from "@/lib/db";
import { staffHas } from "@/lib/platform/rbac";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function asDay(v: unknown): string {
  const raw = String(v);
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? raw.slice(0, 10) : d.toISOString().slice(0, 10);
}

function fillDays(anchor: string, length: number): string[] {
  const [yy, mm, dd] = anchor.split("-").map((x) => Number(x));
  const keys: string[] = [];
  for (let i = length - 1; i >= 0; i -= 1) {
    keys.push(new Date(Date.UTC(yy, mm - 1, dd - i)).toISOString().slice(0, 10));
  }
  return keys;
}

/** Read-only dashboard counts. Does not change vault, billing, or comms behavior. */
export async function GET(req: Request) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;
  const sql = getSql();
  const canFinance = staffHas(auth.staff.role, "finance:read");
  try {
    const customers = await sql`SELECT count(*)::int AS n FROM billing_customers`;
    const astroActive = await sql`SELECT count(*)::int AS n FROM billing_astrologers WHERE active = ${true}`;
    const astroInactive = await sql`SELECT count(*)::int AS n FROM billing_astrologers WHERE active = ${false}`;
    const staff = await sql`SELECT count(*)::int AS n FROM admin_staff`;
    const todayPay = await sql`
      SELECT count(*)::int AS n, COALESCE(sum(amount_minor), 0)::bigint AS revenue
      FROM payments
      WHERE status = ${"captured"}
        AND COALESCE(captured_at, created_at) >= date_trunc('day', now())
    `;
    const refunds = await sql`
      SELECT count(*)::int AS n FROM refund_requests WHERE status = ${"requested"}
    `;
    const waPending = await sql`
      SELECT count(*)::int AS n FROM whatsapp_template_submissions
      WHERE status = ${"submitted"} OR status = ${"pending"}
    `;
    const providersTotal = await sql`SELECT count(*)::int AS n FROM integration_providers`;
    const providersEnabled = await sql`SELECT count(*)::int AS n FROM integration_providers WHERE enabled = ${true}`;
    const messages = await sql`
      SELECT count(*)::int AS n FROM message_log
      WHERE created_at >= date_trunc('day', now())
    `;
    const customersToday = await sql`
      SELECT count(*)::int AS n FROM billing_customers
      WHERE created_at >= date_trunc('day', now())
    `;
    const seriesRows = await sql`
      SELECT (date_trunc('day', COALESCE(captured_at, created_at)))::date AS day,
             COALESCE(sum(amount_minor), 0)::bigint AS revenue,
             count(*)::int AS n
      FROM payments
      WHERE status = ${"captured"}
        AND COALESCE(captured_at, created_at) >= now() - interval '13 days'
      GROUP BY 1
      ORDER BY 1
    `;
    const signupRows = await sql`
      SELECT (date_trunc('day', created_at))::date AS day, count(*)::int AS n
      FROM billing_customers
      WHERE created_at >= now() - interval '13 days'
      GROUP BY 1
      ORDER BY 1
    `;
    const messageRows = await sql`
      SELECT (date_trunc('day', created_at))::date AS day,
             channel,
             count(*)::int AS n
      FROM message_log
      WHERE created_at >= now() - interval '6 days'
      GROUP BY 1, 2
      ORDER BY 1
    `;
    const todayRows = await sql`SELECT (date_trunc('day', now()))::date::text AS day`;
    const todayKey = asDay(todayRows[0]?.day || new Date().toISOString());
    const revenueHits = new Map(
      seriesRows.map((r) => [asDay(r.day), { revenueMinor: Number(r.revenue || 0), count: Number(r.n || 0) }])
    );
    const signupHits = new Map(signupRows.map((r) => [asDay(r.day), Number(r.n || 0)]));
    const messageHits = new Map<string, { email: number; sms: number; whatsapp: number }>();
    for (const r of messageRows) {
      const day = asDay(r.day);
      const prev = messageHits.get(day) || { email: 0, sms: 0, whatsapp: 0 };
      const ch = String(r.channel || "").toLowerCase();
      if (ch === "email") prev.email += Number(r.n || 0);
      else if (ch === "sms") prev.sms += Number(r.n || 0);
      else if (ch === "whatsapp") prev.whatsapp += Number(r.n || 0);
      messageHits.set(day, prev);
    }
    const revenueSeries = fillDays(todayKey, 14).map((day) => ({
      day,
      revenueMinor: revenueHits.get(day)?.revenueMinor || 0,
      count: revenueHits.get(day)?.count || 0,
    }));
    const signupSeries = fillDays(todayKey, 14).map((day) => ({
      day,
      n: signupHits.get(day) || 0,
    }));
    const messageSeries = fillDays(todayKey, 7).map((day) => ({
      day,
      email: messageHits.get(day)?.email || 0,
      sms: messageHits.get(day)?.sms || 0,
      whatsapp: messageHits.get(day)?.whatsapp || 0,
    }));
    return NextResponse.json({
      ok: true,
      canFinance,
      customers: Number(customers[0]?.n || 0),
      customersToday: Number(customersToday[0]?.n || 0),
      astrologersActive: Number(astroActive[0]?.n || 0),
      astrologersInactive: Number(astroInactive[0]?.n || 0),
      staff: Number(staff[0]?.n || 0),
      todayPayments: canFinance ? Number(todayPay[0]?.n || 0) : null,
      todayRevenueMinor: canFinance ? Number(todayPay[0]?.revenue || 0) : null,
      pendingRefunds: canFinance ? Number(refunds[0]?.n || 0) : null,
      pendingWhatsapp: Number(waPending[0]?.n || 0),
      providersEnabled: Number(providersEnabled[0]?.n || 0),
      providersTotal: Number(providersTotal[0]?.n || 0),
      todayMessages: Number(messages[0]?.n || 0),
      dbOk: true,
      revenueSeries: canFinance ? revenueSeries : [],
      signupSeries,
      messageSeries,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "overview failed";
    return NextResponse.json({ ok: false, error: msg, dbOk: false }, { status: 500 });
  }
}
