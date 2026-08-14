import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/platform/admin-api";
import { getSql } from "@/lib/db";
import { decideRefund, requestRefund } from "@/lib/billing/engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = await requirePermission(req, "finance:read");
  if ("response" in auth) return auth.response;
  const sql = getSql();
  const rows = await sql`
    SELECT r.*, p.gateway, p.amount_minor AS payment_amount, p.gateway_payment_id, c.display_name,
           i.invoice_no, cn.credit_note_no
    FROM refund_requests r
    JOIN payments p ON p.id = r.payment_id
    LEFT JOIN billing_customers c ON c.id = p.customer_id
    LEFT JOIN invoices i ON i.payment_id = p.id AND i.voided = false
    LEFT JOIN credit_notes cn ON cn.refund_request_id = r.id
    ORDER BY r.created_at DESC
    LIMIT 80
  `;
  return NextResponse.json({ ok: true, refunds: rows });
}

export async function POST(req: Request) {
  const auth = await requirePermission(req, "finance:write");
  if ("response" in auth) return auth.response;
  const body = (await req.json().catch(() => ({}))) as {
    paymentId?: string;
    refundId?: string;
    reason?: string;
    decision?: "approved" | "rejected";
  };
  try {
    if (body.refundId && body.decision) {
      const result = await decideRefund(body.refundId, body.decision, auth.staff);
      return NextResponse.json({ ok: true, ...result });
    }
    if (body.paymentId) {
      const id = await requestRefund(body.paymentId, String(body.reason || "user request"));
      return NextResponse.json({ ok: true, refundId: id });
    }
    return NextResponse.json({ ok: false, error: "paymentId or refundId required" }, { status: 400 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Refund failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}
